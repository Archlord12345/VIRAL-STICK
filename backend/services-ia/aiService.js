const axios = require("axios");

const {
  COMPANION_PERSONAS,
  MODULE_PROMPTS,
  PROMPT_FACTORY,
} = require("./prompts");

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

const HUGGING_FACE_CHAT_URL =
  "https://router.huggingface.co/v1/chat/completions";

const DEFAULT_HF_MODELS = {
  prompt: [
    "openai/gpt-oss-120b",
    "zai-org/GLM-4.5V",
    "moonshotai/Kimi-K2-Instruct-0905",
  ],
  text: [
    "openai/gpt-oss-120b",
    "zai-org/GLM-4.5V",
    "moonshotai/Kimi-K2-Instruct-0905",
  ],
  chat: [
    "zai-org/GLM-4.5V",
    "openai/gpt-oss-120b",
    "moonshotai/Kimi-K2-Instruct-0905",
  ],
  reasoning: [
    "openai/gpt-oss-120b",
    "zai-org/GLM-4.5V",
    "moonshotai/Kimi-K2-Instruct-0905",
  ],
  // Modèles image gratuits et stables sur l'API Inference HuggingFace.
  // Ordre : du plus rapide au plus lent en fallback.
  image: [
    "stabilityai/stable-diffusion-xl-base-1.0",   // SDXL — gratuit, fiable
    "runwayml/stable-diffusion-v1-5",              // SD 1.5 — très stable
    "CompVis/stable-diffusion-v1-4",               // SD 1.4 — dernier recours
  ],
};

const getEnv = () => ({
  GEMINI_KEY: process.env.GEMINI_API_KEY,
  MISTRAL_KEY: process.env.MISTRAL_API_KEY,
  DEEPSEEK_KEY: process.env.DEEPSEEK_API_KEY,
  OPENROUTER_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",

  OPENROUTER_SITE_URL:
    process.env.OPENROUTER_SITE_URL || "https://viral-stick.local",
  OPENROUTER_SITE_NAME: process.env.OPENROUTER_SITE_NAME || "VIRAL STICK",
  HUGGING_FACE_KEY: process.env.HUGGING_FACE_KEY || process.env.HF_TOKEN,
  HUGGING_FACE_MODEL:
    process.env.HUGGING_FACE_MODEL || DEFAULT_HF_MODELS.image[0],
  HUGGING_FACE_TEXT_MODEL:
    process.env.HUGGING_FACE_TEXT_MODEL || DEFAULT_HF_MODELS.text[0],
  HUGGING_FACE_CHAT_MODEL:
    process.env.HUGGING_FACE_CHAT_MODEL || DEFAULT_HF_MODELS.chat[0],
  HUGGING_FACE_PROMPT_MODEL:
    process.env.HUGGING_FACE_PROMPT_MODEL || DEFAULT_HF_MODELS.prompt[0],
  HUGGING_FACE_REASONING_MODEL:
    process.env.HUGGING_FACE_REASONING_MODEL || DEFAULT_HF_MODELS.reasoning[0],
});

const GEMINI_URL = (model, key) =>
  `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

function truncateText(value, maxLength = 1400) {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}...`;
}

function extractImagePrompt(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";

  const cleaned = normalized
    .replace(/IMAGE_UTILISATEUR_BASE64:[^\n]*/gi, "")
    .replace(/USER_IMAGE_REFERENCE:[^\n]*/gi, "")
    .replace(/USER_IMAGE_URL:[^\n]*/gi, "")
    .replace(/IMAGE_UTILISATEUR_URL:[^\n]*/gi, "")
    .replace(/SOURCE_CONTEXT:/gi, "Contexte source:")
    .replace(/IMAGE_CONTEXT:/gi, "Contexte image:")
    .replace(/\s+/g, " ")
    .trim();

  return truncateText(cleaned, 1200);
}

function parseJSON(text) {
  const raw = String(text || "")
    .replace(/```json|```/gi, "")
    .trim();

  const candidates = [raw];

  const objectMatch = raw.match(/\{[\s\S]*\}/);
  if (objectMatch) candidates.push(objectMatch[0]);

  const arrayMatch = raw.match(/\[[\s\S]*\]/);
  if (arrayMatch) candidates.push(arrayMatch[0]);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }

  const repaired = raw
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();

  for (const candidate of [repaired, repaired.match(/\{[\s\S]*\}/)?.[0]].filter(
    Boolean,
  )) {
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }

  throw new Error("Impossible de parser le JSON");
}

function getAxiosErrorDetails(error) {
  const status = error?.response?.status;
  const statusText = error?.response?.statusText;

  let responseData = error?.response?.data;
  if (Buffer.isBuffer(responseData)) {
    try {
      responseData = JSON.parse(responseData.toString("utf8"));
    } catch {
      responseData = responseData.toString("utf8");
    }
  }

  const providerMessage =
    responseData?.error?.message ||
    responseData?.message ||
    responseData?.error ||
    error?.message ||
    "Unknown error";

  return {
    status,
    statusText,
    providerMessage:
      typeof providerMessage === "string"
        ? providerMessage
        : JSON.stringify(providerMessage),
    responseData,
  };
}

function sanitizeMemePayload(payload, voice = false) {
  return {
    topText: normalizeText(payload?.topText || "QUAND TOUT PART EN VRILLE"),
    bottomText: normalizeText(
      payload?.bottomText || "ET QUE TU FAIS SEMBLANT DE GÉRER",
    ),
    descriptionImage: normalizeText(
      payload?.descriptionImage ||
        "Une scène expressive, exagérée et très relatable",
    ),
    ...(voice
      ? {
          original_transcript_subtitle: normalizeText(
            payload?.original_transcript_subtitle ||
              "Transcription indisponible",
          ),
        }
      : {}),
  };
}

function getLocationContext(location) {
  const contexts = {
    france:
      "Humour français: sarcasme, galère administrative, fatigue sociale, autodérision, références du quotidien compréhensibles.",
    cameroun:
      "Humour camerounais: chaleur sociale, expressions locales, énergie communautaire, petites vérités du quotidien, football et vie courante.",
    senegal:
      "Humour sénégalais: convivialité, finesse, observation sociale, chaleur humaine et petites situations partagées.",
    coteivoire:
      "Humour ivoirien: énergie festive, confiance, style, débrouillardise et punchlines populaires.",
    mali: "Humour malien: observation posée, tradition, quotidien et contraste entre sérieux et réalité.",
    benin:
      "Humour béninois: philosophie du quotidien, détente, débrouille et expressions naturelles.",
    congo:
      "Humour congolais: musicalité, énergie, style, vie de groupe et grands gestes.",
    rdc: "Humour RDC: ambiance vibrante, culture populaire, vie quotidienne et intensité expressive.",
    maroc:
      "Humour marocain: chaleur, famille, petites contradictions sociales et hospitalité détournée avec humour.",
    algerie:
      "Humour algérien: franc, nerveux, direct, enraciné dans le vécu quotidien.",
    tunisie: "Humour tunisien: léger, vif, méditerranéen, urbain et spontané.",
    belgique:
      "Humour belge: calme, absurde doux, autodérision et petites bizarreries du quotidien.",
    suisse: "Humour suisse: précis, calme, contraste entre ordre et imprévu.",
    canada: "Humour québécois: oral, imagé, énergique, familier et coloré.",
    international:
      "Humour international: références universelles, compréhension immédiate, ton accessible et partageable.",
  };

  return contexts[location] || contexts.international;
}

function getHuggingFaceCandidateModels(mode) {
  const env = getEnv();
  const configured =
    mode === "chat"
      ? env.HUGGING_FACE_CHAT_MODEL
      : mode === "prompt"
        ? env.HUGGING_FACE_PROMPT_MODEL
        : mode === "reasoning"
          ? env.HUGGING_FACE_REASONING_MODEL
          : env.HUGGING_FACE_TEXT_MODEL;

  return [
    configured,
    ...(DEFAULT_HF_MODELS[mode] || DEFAULT_HF_MODELS.text),
  ].filter((value, index, array) => value && array.indexOf(value) === index);
}

async function callHuggingFace(
  systemPrompt,
  userPrompt,
  schema,
  mode = "text",
) {
  const { HUGGING_FACE_KEY } = getEnv();
  if (!HUGGING_FACE_KEY) throw new Error("Hugging Face text: no token");

  const candidates = getHuggingFaceCandidateModels(mode);
  let lastError;

  for (const model of candidates) {
    for (const jsonAttempt of schema === "json" ? [true, false] : [false]) {
      try {
        const res = await axios.post(
          HUGGING_FACE_CHAT_URL,
          {
            model,
            messages: [
              {
                role: "system",
                content:
                  schema === "json" && !jsonAttempt
                    ? `${systemPrompt}\n\nIMPORTANT: réponds avec un JSON strict, sans markdown, sans commentaire, sans texte avant ou après.`
                    : systemPrompt,
              },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 500,
            temperature: schema === "text" ? 0.8 : 0.35,
            response_format:
              schema === "json" && jsonAttempt
                ? { type: "json_object" }
                : undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${HUGGING_FACE_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 90000,
          },
        );

        const text = res.data?.choices?.[0]?.message?.content || "";
        return schema === "text" ? normalizeText(text) : parseJSON(text);
      } catch (error) {
        lastError = error;
        const details = getAxiosErrorDetails(error);
        const unsupported =
          details.status === 400 &&
          String(details.providerMessage || "").includes(
            "not supported by any provider",
          );
        const parseFailure =
          !details.status &&
          String(details.providerMessage).includes(
            "Impossible de parser le JSON",
          );

        console.warn(
          `[AI] Hugging Face ${mode} model ${model}${schema === "json" ? (jsonAttempt ? " [json-mode]" : " [prompt-only-json]") : ""} failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
        );

        if (parseFailure && jsonAttempt) {
          continue;
        }

        if (!unsupported && !parseFailure) {
          throw error;
        }
      }
    }
  }

  throw lastError || new Error("Hugging Face: no supported model available");
}

async function callOpenRouter(systemPrompt, userPrompt, schema) {
  const {
    OPENROUTER_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_SITE_URL,
    OPENROUTER_SITE_NAME,
  } = getEnv();
  if (!OPENROUTER_KEY) throw new Error("OpenRouter: no key");

  const res = await axios.post(
    OPENROUTER_CHAT_URL,
    {
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: schema === "text" ? 0.8 : 0.65,
      response_format: schema === "json" ? { type: "json_object" } : undefined,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": OPENROUTER_SITE_URL,
        "X-Title": OPENROUTER_SITE_NAME,
        "Content-Type": "application/json",
      },
      timeout: 90000,
    },
  );

  const text = res.data?.choices?.[0]?.message?.content || "";
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

async function callDeepSeek(systemPrompt, userPrompt, schema) {
  const { DEEPSEEK_KEY } = getEnv();
  if (!DEEPSEEK_KEY) throw new Error("DeepSeek: no key");

  const res = await axios.post(
    DEEPSEEK_URL,
    {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const text = res.data?.choices?.[0]?.message?.content || "";
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

async function callMistral(systemPrompt, userPrompt, schema) {
  const { MISTRAL_KEY } = getEnv();
  if (!MISTRAL_KEY) throw new Error("Mistral: no key");

  const res = await axios.post(
    MISTRAL_URL,
    {
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.85,
    },
    {
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const text = res.data?.choices?.[0]?.message?.content || "";
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

async function callGemini(systemPrompt, userPrompt, schema) {
  const { GEMINI_KEY } = getEnv();
  if (!GEMINI_KEY) throw new Error("Gemini: no key");

  const model = schema === "text" ? "gemini-2.0-flash" : "gemini-2.5-flash";
  const res = await axios.post(GEMINI_URL(model, GEMINI_KEY), {
    contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
  });

  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

async function buildGenerationPrompt(factoryPrompt, rawContext, mode = "text") {
  try {
    const prepared = await callHuggingFace(
      factoryPrompt,
      rawContext,
      "json",
      mode === "chat" ? "chat" : "prompt",
    );

    const generatedPrompt = normalizeText(
      prepared?.generation_prompt || rawContext,
    );

    return normalizeText(
      [generatedPrompt, "SOURCE_CONTEXT:", rawContext].join("\n\n"),
    );
  } catch (error) {
    const details = getAxiosErrorDetails(error);
    console.warn(
      `[AI] Prompt builder fallback${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
    );
    return normalizeText(
      [rawContext, "SOURCE_CONTEXT:", rawContext].join("\n\n"),
    );
  }
}

async function withTextFallback(fn, fallbackData) {
  const providers = [
    {
      name: "Hugging Face",
      call: () => fn((...args) => callHuggingFace(...args, "text")),
    },
    { name: "Mistral", call: () => fn(callMistral) },
    { name: "DeepSeek", call: () => fn(callDeepSeek) },
    { name: "Gemini", call: () => fn(callGemini) },
    { name: "OpenRouter", call: () => fn(callOpenRouter) },
  ];

  for (const provider of providers) {
    try {
      const result = await provider.call();
      console.log(`[AI] ${provider.name} OK`);
      return result;
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] ${provider.name} failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }
  }

  console.warn("[AI] All text providers failed, using fallback");
  return fallbackData;
}

/**
 * Retourne les paramètres optimaux selon le modèle.
 * SDXL supporte 1024×1024 ; SD 1.x préfère 512×512.
 */
function getHFImageParameters(model) {
  if (/xl/i.test(model)) {
    return { width: 1024, height: 1024, guidance_scale: 7.5, num_inference_steps: 25 };
  }
  // SD 1.x — résolution native 512, plus de mémoire = crash serveur
  return { width: 512, height: 512, guidance_scale: 7.5, num_inference_steps: 25 };
}

async function generateWithHuggingFace(prompt) {
  const { HUGGING_FACE_KEY, HUGGING_FACE_MODEL } = getEnv();
  if (!HUGGING_FACE_KEY) throw new Error("Hugging Face image: no token");

  // On utilise l'API Inference standard (gratuite avec token HF)
  // https://api-inference.huggingface.co/models/<model>
  const HF_INFERENCE_BASE = "https://api-inference.huggingface.co/models";

  const candidates = [HUGGING_FACE_MODEL, ...DEFAULT_HF_MODELS.image].filter(
    (value, index, array) => value && array.indexOf(value) === index,
  );

  let lastError;

  for (const model of candidates) {
    try {
      const parameters = getHFImageParameters(model);

      const res = await axios.post(
        `${HF_INFERENCE_BASE}/${model}`,
        {
          inputs: extractImagePrompt(prompt),
          parameters,
          options: {
            wait_for_model: true, // Attend que le modèle soit chargé (cold-start)
            use_cache: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_KEY}`,
            // Accept générique : certains modèles renvoient image/jpeg
            Accept: "image/*",
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
          timeout: 180000, // 3 min — cold-start peut être long
          validateStatus: () => true,
        },
      );

      // Vérifie que la réponse est bien une image
      const mimeType = res.headers["content-type"] || "image/jpeg";
      const isImage = String(mimeType).startsWith("image/");

      if (res.status >= 200 && res.status < 300 && isImage) {
        const base64 = Buffer.from(res.data, "binary").toString("base64");
        console.log(`[AI] Hugging Face image OK — model: ${model}, mime: ${mimeType}`);
        return {
          imageUrl: `data:${mimeType};base64,${base64}`,
          description: normalizeText(prompt),
          provider: `huggingface-${model}`,
          fallback: false,
        };
      }

      // Réponse non-image : on parse l'erreur pour le log
      let errorBody = "";
      try {
        errorBody = Buffer.from(res.data, "binary").toString("utf8");
      } catch {
        errorBody = String(res.status);
      }

      const err = new Error(`HF image ${res.status}: ${errorBody.slice(0, 200)}`);
      err.response = {
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        headers: res.headers,
      };
      throw err;
    } catch (error) {
      lastError = error;
      const details = getAxiosErrorDetails(error);
      const providerMessage = String(details.providerMessage || "").toLowerCase();

      // Erreurs récupérables → on tente le modèle suivant
      const recoverable =
        details.status === 400 ||
        details.status === 404 ||
        details.status === 410 ||
        details.status === 429 ||
        details.status === 503 ||  // modèle en cours de chargement
        providerMessage.includes("not supported by provider") ||
        providerMessage.includes("not supported by any provider") ||
        providerMessage.includes("deprecated") ||
        providerMessage.includes("loading") ||
        providerMessage.includes("temporarily unavailable") ||
        providerMessage.includes("is currently loading");

      console.warn(
        `[AI] Hugging Face image model ${model} failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );

      if (!recoverable) {
        throw error;
      }
    }
  }

  throw (
    lastError || new Error("Hugging Face image: no supported model available")
  );
}

const AIService = {
  generateStatusRemix: async ({
    text,
    location = "international",
    imageContext,
    inputImageUrl,
    inputImageBase64,
  }) => {
    const locationContext = getLocationContext(location);
    const rawContext = [
      `LOCALISATION: ${location}`,
      `CADRE CULTUREL: ${locationContext}`,
      `CONTEXTE SOURCE: ${normalizeText(text)}`,
      imageContext ? `CONTEXTE IMAGE: ${normalizeText(imageContext)}` : null,
      inputImageUrl ? `IMAGE_UTILISATEUR_URL: ${inputImageUrl}` : null,
      inputImageBase64
        ? `IMAGE_UTILISATEUR_BASE64: image fournie par l'utilisateur (data URL/base64 reçue)`
        : null,
      "OBJECTIF: fabriquer une caption mème premium, des améliorations visuelles utiles et une proposition d'image cohérente.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const generatedPrompt = await buildGenerationPrompt(
      PROMPT_FACTORY.memeText,
      rawContext,
      "text",
    );

    const remixData = await withTextFallback(
      async (call) =>
        call(MODULE_PROMPTS.statusRemixer, generatedPrompt, "json"),
      {
        meme_text: "MOI QUI PENSAIS POSTER ÇA TRANQUILLE",
        visual_enhancements: [
          "Renforcer le contraste du sujet principal",
          "Ajouter une caption courte en bas pour lecture mobile",
          "Recadrer sur la réaction clé",
        ],
        descriptionImage:
          "Une scène expressive, premium, mobile-first, pensée pour un post viral",
      },
    );

    const imagePrompt = [
      remixData?.descriptionImage,
      remixData?.meme_text,
      `SOURCE_CONTEXT: ${normalizeText(text)}`,
      imageContext ? `IMAGE_CONTEXT: ${normalizeText(imageContext)}` : null,
      inputImageUrl ? `USER_IMAGE_URL: ${inputImageUrl}` : null,
      inputImageBase64
        ? "USER_IMAGE_REFERENCE: une image utilisateur réelle a été fournie comme base64/data URL ; conserver son intention visuelle dans la génération finale"
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const imageResult = await AIService.generateImage(imagePrompt);

    return {
      meme_text: normalizeText(remixData?.meme_text || text),
      visual_enhancements: Array.isArray(remixData?.visual_enhancements)
        ? remixData.visual_enhancements
            .map((item) => normalizeText(item))
            .filter(Boolean)
        : [],
      descriptionImage: normalizeText(
        remixData?.descriptionImage || imageResult?.description,
      ),
      sourceImageUrl: inputImageUrl || inputImageBase64 || null,
      imageUrl: imageResult?.imageUrl || null,
      imageProvider: imageResult?.provider,
      fallback: !!imageResult?.fallback,
    };
  },
  generateMemeFromText: async (text, location = "international") => {
    const locationContext = getLocationContext(location);
    const rawContext = [
      `LOCALISATION: ${location}`,
      `CADRE CULTUREL: ${locationContext}`,
      `CONTEXTE UTILISATEUR: ${normalizeText(text)}`,
      "OBJECTIF: créer un prompt final pour un mème texte premium, social-first et drôle.",
    ].join("\n\n");

    const generatedPrompt = await buildGenerationPrompt(
      PROMPT_FACTORY.memeText,
      rawContext,
      "text",
    );

    const raw = await withTextFallback(
      async (call) =>
        call(MODULE_PROMPTS.contextReader, generatedPrompt, "json"),
      {
        topText: "QUAND TU VEUX GÉRER TRANQUILLE",
        bottomText: "ET QUE LE CHAOS CHOISIT TON NOM",
        descriptionImage:
          "Une personne figée pendant que tout s'effondre autour d'elle",
      },
    );

    return sanitizeMemePayload(raw, false);
  },

  generateMemeFromVoice: async (transcription) => {
    const rawContext = [
      `TRANSCRIPTION: ${normalizeText(transcription)}`,
      "OBJECTIF: créer un prompt final pour générer un mème issu d'une parole spontanée.",
      "Préserver l'énergie du parlé, la spontanéité et la chute comique.",
    ].join("\n\n");

    const generatedPrompt = await buildGenerationPrompt(
      PROMPT_FACTORY.memeText,
      rawContext,
      "text",
    );

    const raw = await withTextFallback(
      async (call) => call(MODULE_PROMPTS.voiceToMeme, generatedPrompt, "json"),
      {
        topText: "QUAND TU PARLES TROP VITE",
        bottomText: "MAIS QUE LE DRAME RESTE PARFAITEMENT COMPRÉHENSIBLE",
        descriptionImage: "Un micro saturé devant quelqu'un très expressif",
        original_transcript_subtitle: normalizeText(transcription),
      },
    );

    return sanitizeMemePayload(raw, true);
  },

  chatWithCompanion: async (companionId, message) => {
    const personaData =
      COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
    const systemPrompt = `Tu es ${personaData.persona}\nTon ton est: ${personaData.tone}\nInstructions: ${personaData.instructions.join(" ")}`;

    const fallbackMessage =
      "Désolé, j'ai une petite perte de synchronisation avec mon noyau central. Réessaie dans un instant.";

    const chatContext = [
      `COMPAGNON: ${companionId}`,
      `SYSTEM_PROMPT: ${systemPrompt}`,
      `MESSAGE_UTILISATEUR: ${normalizeText(message)}`,
    ].join("\n\n");

    try {
      const generatedPrompt = await buildGenerationPrompt(
        PROMPT_FACTORY.chat,
        chatContext,
        "chat",
      );

      const reply = await callHuggingFace(
        systemPrompt,
        generatedPrompt,
        "text",
        "chat",
      );
      console.log("[AI] Hugging Face chat OK");
      return reply;
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] Hugging Face chat failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    return withTextFallback(
      async (call) =>
        call(
          systemPrompt,
          `Message utilisateur: "${normalizeText(message)}"`,
          "text",
        ),
      fallbackMessage,
    );
  },

  generateImage: async (prompt) => {
    const normalizedPrompt = extractImagePrompt(prompt);

    let imagePrompt = normalizedPrompt;

    try {
      imagePrompt = extractImagePrompt(
        await buildGenerationPrompt(
          PROMPT_FACTORY.image,
          normalizedPrompt,
          "text",
        ),
      );
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] Hugging Face image prompt builder failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    let lastImageError = null;

    try {
      return await generateWithHuggingFace(imagePrompt || normalizedPrompt);
    } catch (e) {
      lastImageError = e;
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] Hugging Face image failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    const details = (() => {
      try {
        return getAxiosErrorDetails(lastImageError);
      } catch {
        return { status: null, providerMessage: "Unknown error" };
      }
    })();

    return {
      imageUrl: null,
      description: `Image générée : ${imagePrompt || normalizedPrompt}`,
      provider: "huggingface-text-only-fallback",
      fallback: true,
      unavailableReason:
        details.status === 402
          ? "Hugging Face image indisponible: crédits insuffisants sur le compte HF."
          : "Hugging Face image indisponible pour cette requête.",
    };
  },
};

module.exports = AIService;

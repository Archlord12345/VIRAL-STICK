const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { COMPANION_PERSONAS, MODULE_PROMPTS } = require("./prompts");

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_IMAGE_URL = "https://openrouter.ai/api/v1/images/generations";

const getEnv = () => ({
  GEMINI_KEY: process.env.GEMINI_API_KEY,
  MISTRAL_KEY: process.env.MISTRAL_API_KEY,
  DEEPSEEK_KEY: process.env.DEEPSEEK_API_KEY,
  OPENROUTER_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  OPENROUTER_IMAGE_MODEL:
    process.env.OPENROUTER_IMAGE_MODEL || "bytedance-seed/seedream-4.5",
  OPENROUTER_SITE_URL:
    process.env.OPENROUTER_SITE_URL || "https://viral-stick.local",
  OPENROUTER_SITE_NAME: process.env.OPENROUTER_SITE_NAME || "VIRAL STICK",
  HF_TOKEN: process.env.HF_TOKEN,
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

function parseJSON(text) {
  const cleaned = normalizeText(
    String(text || "").replace(/```json|```/gi, ""),
  );
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Impossible de parser le JSON");
  }
}

function getAxiosErrorDetails(error) {
  const status = error?.response?.status;
  const statusText = error?.response?.statusText;
  const providerMessage =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unknown error";

  return {
    status,
    statusText,
    providerMessage:
      typeof providerMessage === "string"
        ? providerMessage
        : JSON.stringify(providerMessage),
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

async function withTextFallback(fn, fallbackData) {
  const providers = [
    { name: "OpenRouter", call: () => fn(callOpenRouter) },
    { name: "Gemini", call: () => fn(callGemini) },
    { name: "Mistral", call: () => fn(callMistral) },
    { name: "DeepSeek", call: () => fn(callDeepSeek) },
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

async function generateWithGeminiImage(prompt) {
  const { GEMINI_KEY } = getEnv();
  if (!GEMINI_KEY) throw new Error("Gemini image: no key");

  try {
    const client = new GoogleGenerativeAI(GEMINI_KEY);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const candidates = response?.candidates || [];
    for (const candidate of candidates) {
      for (const part of candidate?.content?.parts || []) {
        if (part?.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          return {
            imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
            description: normalizeText(prompt),
            provider: "gemini-image",
            fallback: false,
          };
        }
      }
    }
  } catch (e) {
    console.warn(`[AI] Gemini image failed: ${e.message}`);
  }

  throw new Error("Gemini image unavailable");
}

async function generateWithOpenRouterImage(prompt) {
  const {
    OPENROUTER_KEY,
    OPENROUTER_IMAGE_MODEL,
    OPENROUTER_SITE_URL,
    OPENROUTER_SITE_NAME,
  } = getEnv();
  if (!OPENROUTER_KEY) throw new Error("OpenRouter image: no key");

  const res = await axios.post(
    OPENROUTER_IMAGE_URL,
    {
      model: OPENROUTER_IMAGE_MODEL,
      prompt,
      quality: "medium",
      size: "1024x1024",
      output_format: "png",
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": OPENROUTER_SITE_URL,
        "X-Title": OPENROUTER_SITE_NAME,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    },
  );

  const firstImage = res.data?.data?.[0];
  const imageUrl = firstImage?.b64_json
    ? `data:image/png;base64,${firstImage.b64_json}`
    : firstImage?.url || null;

  if (!imageUrl) {
    throw new Error("OpenRouter image: empty image response");
  }

  return {
    imageUrl,
    description: normalizeText(prompt),
    provider: `openrouter-${OPENROUTER_IMAGE_MODEL}`,
    fallback: false,
  };
}

async function generateWithHuggingFace(prompt) {
  const { HF_TOKEN } = getEnv();
  if (!HF_TOKEN) throw new Error("HF image: no token");

  const res = await axios.post(
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-Krea-dev",
    {
      inputs: prompt,
      parameters: {
        width: 1024,
        height: 1024,
        guidance_scale: 5.5,
        num_inference_steps: 28,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        Accept: "image/png",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 120000,
    },
  );

  const base64 = Buffer.from(res.data, "binary").toString("base64");
  const mimeType = res.headers["content-type"] || "image/png";

  return {
    imageUrl: `data:${mimeType};base64,${base64}`,
    description: normalizeText(prompt),
    provider: "huggingface-flux-krea",
    fallback: false,
  };
}

const AIService = {
  generateMemeFromText: async (text, location = "international") => {
    const locationContext = getLocationContext(location);
    const userPrompt = [
      `LOCALISATION: ${location}`,
      `CADRE CULTUREL: ${locationContext}`,
      `CONTEXTE UTILISATEUR: ${normalizeText(text)}`,
      "Trouve le noyau comique principal puis construis un mème plus fort que le contexte brut.",
    ].join("\n\n");

    const raw = await withTextFallback(
      async (call) => call(MODULE_PROMPTS.contextReader, userPrompt, "json"),
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
    const userPrompt = [
      `TRANSCRIPTION: ${normalizeText(transcription)}`,
      "Conserve l'énergie du parlé, nettoie juste ce qu'il faut, puis construis un mème avec une vraie chute.",
    ].join("\n\n");

    const raw = await withTextFallback(
      async (call) => call(MODULE_PROMPTS.voiceToMeme, userPrompt, "json"),
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

    return withTextFallback(
      async (call) =>
        call(
          systemPrompt,
          `Message utilisateur: "${normalizeText(message)}"`,
          "text",
        ),
      "Désolé, j'ai une petite perte de synchronisation avec mon noyau central. Réessaie dans un instant.",
    );
  },

  generateImage: async (prompt) => {
    const normalizedPrompt = normalizeText(prompt);

    try {
      return await generateWithOpenRouterImage(normalizedPrompt);
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] OpenRouter image failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    try {
      return await generateWithHuggingFace(normalizedPrompt);
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] Hugging Face image failed${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    try {
      return await generateWithGeminiImage(normalizedPrompt);
    } catch (e) {
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[AI] Gemini image unavailable${details.status ? ` (${details.status}${details.statusText ? ` ${details.statusText}` : ""})` : ""}: ${details.providerMessage}`,
      );
    }

    return {
      imageUrl: null,
      description: `Image générée : ${normalizedPrompt}`,
      provider: "fallback-text-only",
      fallback: true,
    };
  },
};

module.exports = AIService;

const axios = require("axios");
const { COMPANION_PERSONAS, MODULE_PROMPTS } = require("./prompts");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT_MEME =
  "Tu génères des mèmes humoristiques en français. Réponds UNIQUEMENT avec du JSON valide, sans markdown.";

async function callDeepSeek(systemPrompt, userPrompt, schema) {
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
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  return parseJSON(res.data.choices[0].message.content);
}

async function callMistral(systemPrompt, userPrompt, schema) {
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
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  const text = res.data.choices[0].message.content;
  if (schema === "text") return text;
  return parseJSON(text);
}

async function callGemini(systemPrompt, userPrompt, schema) {
  if (!GEMINI_KEY) throw new Error("Gemini: no key");
  const model = schema === "text" ? "gemini-2.0-flash" : "gemini-2.5-flash";
  const res = await axios.post(GEMINI_URL(model), {
    contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
  });
  const text = res.data.candidates[0].content.parts[0].text;
  if (schema === "text") return text;
  return parseJSON(text);
}

function parseJSON(text) {
  let cleaned = text.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Impossible de parser le JSON");
  }
}

async function withFallback(fn, fallbackData) {
  const providers = [
    { name: "Gemini", call: () => fn(callGemini) },
    { name: "Mistral", call: () => fn(callMistral) },
    { name: "DeepSeek", call: () => fn(callDeepSeek) },
  ];
  for (const p of providers) {
    try {
      const result = await p.call();
      console.log(`[AI] ${p.name} OK`);
      return result;
    } catch (e) {
      console.warn(`[AI] ${p.name} failed: ${e.message}`);
    }
  }
  console.warn("[AI] All providers failed, using fallback");
  return fallbackData;
}

const AIService = {
  generateMemeFromText: async (text) => {
    return withFallback(
      async (call) =>
        call(MODULE_PROMPTS.contextReader, `CONTEXTE UTILISATEUR: "${text}"`),
      {
        topText: "QUAND L'IA BUGUE...",
        bottomText: "...MAIS QUE TU GARDES LE SOURIRE",
        descriptionImage: "Un robot confus avec un panneau Error 500",
      },
    );
  },

  generateMemeFromVoice: async (transcription) => {
    return withFallback(
      async (call) =>
        call(
          MODULE_PROMPTS.voiceToMeme,
          `TRANSCRIPTION VOCALE: "${transcription}"`,
        ),
      {
        topText: "QUAND LA VOIX NE PASSE PAS...",
        bottomText: "...MAIS QUE LE MESSAGE EST CLAIR",
        descriptionImage: "Un micro qui fume avec des ondes sonores",
        original_transcript_subtitle: transcription,
      },
    );
  },

  chatWithCompanion: async (companionId, message) => {
    const personaData =
      COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
    const systemPrompt = `Tu es ${personaData.persona}
Ton ton est : ${personaData.tone}
Instructions : ${personaData.instructions.join(" ")}
Réponds en 2-3 phrases maximum, reste dans ton personnage.`;

    const result = await withFallback(
      async (call) => call(systemPrompt, `Message: "${message}"`, "text"),
      "Désolé, j'ai une petite perte de connexion avec mon noyau central. Peux-tu répéter ?",
    );
    return result;
  },
};

module.exports = AIService;

/**
 * providers/audio.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Providers de transcription audio.
 *
 * Chaque fonction a la même signature :
 *   callXxx(buffer, mimeType) → Promise<string>  (transcription)
 *
 * Ordre recommandé dans le pipeline :
 *   1. callGroqWhisper  — GRATUIT, ultra-rapide (~10x temps réel), nécessite GROQ_API_KEY
 *   2. callPuterWhisper — nécessite PUTER_KEY, plus lent
 */

const axios = require("axios");
const FormData = require("form-data");

// ─── Groq — Whisper large-v3 ──────────────────────────────────────────────────
// 100% gratuit sur le free tier (7200 sec audio/jour, largement suffisant).
// Whisper large-v3 : le meilleur modèle de transcription open-source.
// Latence ~2-5s pour 30s d'audio. Doc : https://console.groq.com/docs/speech-text

async function callGroqWhisper(buffer, mimeType) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Groq: GROQ_API_KEY manquant");

  // Groq attend un multipart/form-data avec le fichier audio
  const form = new FormData();

  // Détermine l'extension selon le mimeType
  const ext = mimeTypeToExt(mimeType);
  form.append("file", buffer, { filename: `audio.${ext}`, contentType: mimeType || "audio/wav" });
  form.append("model", "whisper-large-v3");
  form.append("language", "fr"); // Optimisé pour le français, change si besoin
  form.append("response_format", "json");

  const res = await axios.post(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    form,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        ...form.getHeaders(),
      },
      timeout: 60000,
    }
  );

  const text = res.data?.text;
  if (!text) throw new Error("Groq Whisper: réponse vide");

  console.log(`[Audio] Groq Whisper OK — ${text.slice(0, 60)}...`);
  return normalizeText(text);
}

// ─── Puter — Whisper via Inference API ────────────────────────────────────────
// Fallback. Nécessite PUTER_KEY. Plus lent que Groq.

const PUTER_AUDIO_MODELS = [
  process.env.PUTER_AUDIO_MODEL || "openai/whisper-large-v3",
  "openai/whisper-base",
];

async function callPuterWhisper(buffer, mimeType) {
  const key = process.env.PUTER_KEY || process.env.PUTER_TOKEN;
  if (!key) throw new Error("Puter Audio: PUTER_KEY manquant");

  const models   = [...new Set(PUTER_AUDIO_MODELS.filter(Boolean))];
  let lastError;

  for (const model of models) {
    try {
      const res = await axios.post(
        `https://api.puter.com/models/${model}`,
        buffer,
        {
          headers: {
            Authorization:  `Bearer ${key}`,
            "Content-Type": mimeType || "audio/wav",
          },
          params:         { wait_for_model: true },
          timeout:        120000,
          validateStatus: () => true,
        }
      );

      if (res.status >= 200 && res.status < 300 && res.data?.text) {
        console.log(`[Audio] Puter Whisper OK — model: ${model}`);
        return normalizeText(res.data.text);
      }

      throw Object.assign(
        new Error(`Puter audio ${res.status}: ${JSON.stringify(res.data).slice(0, 200)}`),
        { response: { status: res.status, data: res.data } }
      );
    } catch (e) {
      lastError = e;
      const status = e?.response?.status;
      console.warn(`[Audio] Puter model ${model} failed (${status}): ${e?.message?.slice(0, 100)}`);
    }
  }

  throw lastError || new Error("Puter Audio: aucun modèle disponible");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function mimeTypeToExt(mimeType) {
  const map = {
    "audio/wav":   "wav",
    "audio/wave":  "wav",
    "audio/mp3":   "mp3",
    "audio/mpeg":  "mp3",
    "audio/mp4":   "mp4",
    "audio/m4a":   "m4a",
    "audio/ogg":   "ogg",
    "audio/webm":  "webm",
    "audio/flac":  "flac",
    "video/webm":  "webm",
    "video/mp4":   "mp4",
  };
  return map[mimeType] || "wav";
}

module.exports = { callGroqWhisper, callPuterWhisper };

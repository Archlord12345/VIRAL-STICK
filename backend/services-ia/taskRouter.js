/**
 * taskRouter.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Routing intelligent : chaque type de tâche a son pipeline IA dédié.
 *
 * Principe :
 *   - Un provider "primaire" traite la requête.
 *   - En cas d'échec, on passe au suivant dans la liste (fallback).
 *   - Chaque tâche n'appelle QUE les providers pertinents pour elle.
 *   - Aucun provider ne "voit" les tâches pour lesquelles il n'est pas fait.
 *
 * Types de tâches :
 *   text   → génération de mème, chat, remix (Gemini > Mistral > Puter > DeepSeek)
 *   image  → génération d'image    (Pollinations > Puter > Stability)
 *   audio  → transcription Whisper (Groq > Puter)
 *   sticker→ composition Sharp     (local, pas d'IA externe)
 */

const textProviders  = require("./providers/text");
const imageProviders = require("./providers/image");
const audioProviders = require("./providers/audio");

// ─── Pipelines par type de tâche ─────────────────────────────────────────────

const PIPELINES = {
  /**
   * TEXT — Génération de mème, chat compagnon, remix de status
   * Primaire : Gemini 2.5 Flash (excellent en créatif, quota généreux)
   * Fallback 1 : Mistral (bon en français)
   * Fallback 2 : Puter (modèles OpenAI-compat)
   * Fallback 3 : DeepSeek (raisonnement fort)
   * Fallback 4 : OpenRouter (filet de sécurité)
   */
  text: [
    { name: "Gemini",      fn: textProviders.callGemini },
    { name: "Mistral",     fn: textProviders.callMistral },
    { name: "Puter",       fn: textProviders.callPuter },
    { name: "DeepSeek",    fn: textProviders.callDeepSeek },
    { name: "OpenRouter",  fn: textProviders.callOpenRouter },
  ],

  /**
   * IMAGE — Génération text-to-image
   * Primaire : Pollinations.ai (GRATUIT, sans clé, très fiable)
   * Fallback 1 : Puter Inference (nécessite PUTER_KEY)
   * Fallback 2 : Pollinations modèle alternatif
   */
  image: [
    { name: "Pollinations",     fn: imageProviders.callPollinations },
    { name: "PollinationsFlux", fn: imageProviders.callPollinationsFlux },
    { name: "Puter",            fn: imageProviders.callPuterImage },
  ],

  /**
   * AUDIO — Transcription Whisper
   * Primaire : Groq (Whisper large v3, GRATUIT, ultra-rapide ~10x temps réel)
   * Fallback : Puter Inference Whisper
   */
  audio: [
    { name: "Groq",  fn: audioProviders.callGroqWhisper },
    { name: "Puter", fn: audioProviders.callPuterWhisper },
  ],
};

// ─── Helpers utilitaires ─────────────────────────────────────────────────────

function getAxiosErrorDetails(error) {
  const status      = error?.response?.status;
  const statusText  = error?.response?.statusText;
  let   responseData = error?.response?.data;

  if (Buffer.isBuffer(responseData)) {
    try { responseData = JSON.parse(responseData.toString("utf8")); }
    catch { responseData = responseData.toString("utf8"); }
  }

  const providerMessage =
    responseData?.error?.message ||
    responseData?.message        ||
    responseData?.error          ||
    error?.message               ||
    "Unknown error";

  return {
    status,
    statusText,
    providerMessage: typeof providerMessage === "string"
      ? providerMessage
      : JSON.stringify(providerMessage),
    responseData,
  };
}

// ─── Exécution d'un pipeline ─────────────────────────────────────────────────

/**
 * Exécute les providers d'un pipeline dans l'ordre.
 * Passe au suivant uniquement si le courant échoue.
 *
 * @param {"text"|"image"|"audio"} taskType
 * @param {Function} callFn   — (providerFn) => Promise<result>
 * @param {*}        fallback — valeur retournée si TOUS échouent
 */
async function runPipeline(taskType, callFn, fallback = null) {
  const pipeline = PIPELINES[taskType];
  if (!pipeline) throw new Error(`[Router] Type de tâche inconnu : ${taskType}`);

  let lastError;

  for (const { name, fn } of pipeline) {
    try {
      const result = await callFn(fn);
      console.log(`[Router] ${taskType.toUpperCase()} — ${name} OK`);
      return result;
    } catch (e) {
      lastError = e;
      const details = getAxiosErrorDetails(e);
      console.warn(
        `[Router] ${taskType.toUpperCase()} — ${name} failed` +
        (details.status ? ` (${details.status})` : "") +
        `: ${details.providerMessage}`
      );
    }
  }

  console.warn(`[Router] ${taskType.toUpperCase()} — tous les providers ont échoué`);

  if (fallback !== null) return fallback;
  throw lastError || new Error(`[Router] Pipeline ${taskType} : aucun provider disponible`);
}

/**
 * Raccourci pour les tâches texte (le cas le plus fréquent).
 * Usage : runText((call) => call(systemPrompt, userPrompt, schema), fallback)
 */
async function runText(callFn, fallback = null) {
  return runPipeline("text", callFn, fallback);
}

/**
 * Raccourci pour la génération d'image.
 * Usage : runImage((call) => call(prompt), fallback)
 */
async function runImage(callFn, fallback = null) {
  return runPipeline("image", callFn, fallback);
}

/**
 * Raccourci pour la transcription audio.
 * Usage : runAudio((call) => call(buffer, mimeType), fallback)
 */
async function runAudio(callFn, fallback = null) {
  return runPipeline("audio", callFn, fallback);
}

module.exports = { runPipeline, runText, runImage, runAudio, PIPELINES };

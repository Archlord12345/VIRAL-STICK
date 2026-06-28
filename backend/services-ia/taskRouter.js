/**
 * taskRouter.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Routing intelligent : chaque type de tâche a son pipeline IA dédié.
 */

const textProviders  = require("./providers/text");
const imageProviders = require("./providers/image");
const audioProviders = require("./providers/audio");

// ─── Pipelines par type de tâche ─────────────────────────────────────────────

const PIPELINES = {
  /**
   * TEXT — Génération de mème, chat compagnon, remix de status
   * Pipeline : Grok (si clé présente) > Gemini > Mistral > Puter
   */
  text: [
    { name: "Grok",         fn: textProviders.callGrok },
    { name: "Gemini",       fn: textProviders.callGemini },
    { name: "Mistral",      fn: textProviders.callMistral },
    { name: "Puter",        fn: textProviders.callPuter },
    { name: "DeepSeek",     fn: textProviders.callDeepSeek },
    { name: "OpenRouter",   fn: textProviders.callOpenRouter },
  ],

  /**
   * IMAGE — Génération text-to-image (Flux via Pollinations est prioritaire car gratuit)
   */
  image: [
    { name: "PollinationsFlux", fn: imageProviders.callPollinationsFlux },
    { name: "Pollinations",     fn: imageProviders.callPollinations },
    { name: "Puter",            fn: imageProviders.callPuterImage },
  ],

  /**
   * AUDIO — Transcription Whisper
   */
  audio: [
    { name: "Groq",  fn: audioProviders.callGroqWhisper },
    { name: "Puter", fn: audioProviders.callPuterWhisper },
  ],
};

async function runPipeline(taskType, callFn, fallback = null) {
  const pipeline = PIPELINES[taskType];
  let lastError;

  for (const { name, fn } of pipeline) {
    try {
      const result = await callFn(fn);
      console.log(`[Router] ${taskType.toUpperCase()} — ${name} OK`);
      return result;
    } catch (e) {
      lastError = e;
      console.warn(`[Router] ${name} failed: ${e.message}`);
    }
  }

  if (fallback !== null) return fallback;
  throw lastError || new Error(`[Router] Pipeline ${taskType} échoué`);
}

module.exports = {
  runText: (callFn, fallback) => runPipeline("text", callFn, fallback),
  runImage: (callFn, fallback) => runPipeline("image", callFn, fallback),
  runAudio: (callFn, fallback) => runPipeline("audio", callFn, fallback),
  PIPELINES
};

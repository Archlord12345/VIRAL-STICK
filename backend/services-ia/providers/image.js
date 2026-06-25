/**
 * providers/image.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Providers de génération d'image, du plus gratuit au plus coûteux.
 *
 * Chaque fonction a la même signature :
 *   callXxx(prompt) → Promise<{ imageUrl, description, provider, fallback }>
 *
 * Ordre recommandé dans le pipeline :
 *   1. callPollinations      — gratuit, sans clé, Stable Diffusion XL
 *   2. callPollinationsFlux  — gratuit, sans clé, FLUX modèle
 *   3. callPuterImage        — nécessite PUTER_KEY
 */

const axios = require("axios");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

/**
 * Nettoie un prompt avant envoi aux modèles image.
 * Supprime les blocs internes (base64, URLs, métadonnées) qui polluent le prompt.
 */
function cleanImagePrompt(raw) {
  const cleaned = normalizeText(raw)
    .replace(/IMAGE_UTILISATEUR_BASE64:[^\n]*/gi, "")
    .replace(/USER_IMAGE_REFERENCE:[^\n]*/gi, "")
    .replace(/USER_IMAGE_URL:[^\n]*/gi, "")
    .replace(/IMAGE_UTILISATEUR_URL:[^\n]*/gi, "")
    .replace(/SOURCE_CONTEXT:/gi, "")
    .replace(/IMAGE_CONTEXT:/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Tronque à 500 chars max — les modèles image n'ont pas besoin de plus
  return cleaned.length > 500 ? cleaned.slice(0, 500).trim() + "..." : cleaned;
}

// ─── Pollinations.ai — Stable Diffusion XL ────────────────────────────────────
// 100% gratuit, sans clé API, images 1024×1024.
// Doc : https://image.pollinations.ai/prompt/{prompt}?model=flux&width=1024&height=1024&nologo=true

async function callPollinations(prompt) {
  const cleanedPrompt = cleanImagePrompt(prompt);
  if (!cleanedPrompt) throw new Error("Pollinations: prompt vide après nettoyage");

  // Encode le prompt pour l'URL
  const encodedPrompt = encodeURIComponent(cleanedPrompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;

  const res = await axios.get(url, {
    responseType:   "arraybuffer",
    timeout:        60000,
    validateStatus: () => true,
  });

  const mimeType = res.headers["content-type"] || "image/jpeg";
  const isImage  = String(mimeType).startsWith("image/");

  if (res.status >= 200 && res.status < 300 && isImage) {
    const base64 = Buffer.from(res.data, "binary").toString("base64");
    console.log(`[Image] Pollinations OK — SDXL — ${cleanedPrompt.slice(0, 60)}...`);
    return {
      imageUrl:    `data:${mimeType};base64,${base64}`,
      description: normalizeText(prompt),
      provider:    "pollinations-flux",
      fallback:    false,
    };
  }

  throw new Error(`Pollinations: status ${res.status}`);
}

// ─── Pollinations.ai — FLUX modèle alternatif ────────────────────────────────
// Même API, modèle turbo — plus rapide, légèrement moins détaillé.

async function callPollinationsFlux(prompt) {
  const cleanedPrompt = cleanImagePrompt(prompt);
  if (!cleanedPrompt) throw new Error("Pollinations Flux: prompt vide");

  const encodedPrompt = encodeURIComponent(cleanedPrompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux-realism&width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;

  const res = await axios.get(url, {
    responseType:   "arraybuffer",
    timeout:        60000,
    validateStatus: () => true,
  });

  const mimeType = res.headers["content-type"] || "image/jpeg";
  const isImage  = String(mimeType).startsWith("image/");

  if (res.status >= 200 && res.status < 300 && isImage) {
    const base64 = Buffer.from(res.data, "binary").toString("base64");
    console.log(`[Image] Pollinations Flux-Realism OK`);
    return {
      imageUrl:    `data:${mimeType};base64,${base64}`,
      description: normalizeText(prompt),
      provider:    "pollinations-flux-realism",
      fallback:    false,
    };
  }

  throw new Error(`Pollinations Flux: status ${res.status}`);
}

// ─── Puter Image Inference ────────────────────────────────────────────────────
// Fallback payant. Nécessite PUTER_KEY. Stable Diffusion XL + fallbacks SD.

const PUTER_IMAGE_MODELS = [
  process.env.PUTER_MODEL || "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
  "CompVis/stable-diffusion-v1-4",
];

function getPuterImageParams(model) {
  if (/xl/i.test(model)) {
    return { width: 1024, height: 1024, guidance_scale: 7.5, num_inference_steps: 25 };
  }
  return { width: 512, height: 512, guidance_scale: 7.5, num_inference_steps: 25 };
}

async function callPuterImage(prompt) {
  const key = process.env.PUTER_KEY || process.env.PUTER_TOKEN;
  if (!key) throw new Error("Puter Image: PUTER_KEY manquant");

  const cleanedPrompt = cleanImagePrompt(prompt);
  const models = [...new Set(PUTER_IMAGE_MODELS.filter(Boolean))];
  let lastError;

  for (const model of models) {
    try {
      const params = getPuterImageParams(model);
      const res = await axios.post(
        `https://api.puter.com/models/${model}`,
        {
          inputs:     cleanedPrompt,
          parameters: params,
          options:    { wait_for_model: true, use_cache: false },
        },
        {
          headers: {
            Authorization:  `Bearer ${key}`,
            Accept:         "image/*",
            "Content-Type": "application/json",
          },
          responseType:   "arraybuffer",
          timeout:        180000,
          validateStatus: () => true,
        }
      );

      const mimeType = res.headers["content-type"] || "image/jpeg";
      const isImage  = String(mimeType).startsWith("image/");

      if (res.status >= 200 && res.status < 300 && isImage) {
        const base64 = Buffer.from(res.data, "binary").toString("base64");
        console.log(`[Image] Puter OK — model: ${model}`);
        return {
          imageUrl:    `data:${mimeType};base64,${base64}`,
          description: normalizeText(prompt),
          provider:    `puter-${model}`,
          fallback:    false,
        };
      }

      // Réponse non-image : parse l'erreur
      let errBody = "";
      try { errBody = Buffer.from(res.data, "binary").toString("utf8"); }
      catch { errBody = String(res.status); }

      const err    = new Error(`Puter image ${res.status}: ${errBody.slice(0, 200)}`);
      err.response = { status: res.status, statusText: res.statusText, data: res.data };
      throw err;

    } catch (e) {
      lastError = e;
      const status  = e?.response?.status;
      const msg     = String(e?.response?.data || e?.message || "").toLowerCase();
      const skip    = [400, 404, 410, 429, 503].includes(status) ||
                      msg.includes("not supported") ||
                      msg.includes("deprecated")   ||
                      msg.includes("loading");

      console.warn(`[Image] Puter model ${model} failed (${status}): ${msg.slice(0, 100)}`);
      if (!skip) throw e;
    }
  }

  throw lastError || new Error("Puter Image: aucun modèle disponible");
}

// ─── Résultat fallback ultime (pas d'image, mais pas de crash) ────────────────

function imageFallbackResult(prompt, reason = "aucun provider image disponible") {
  return {
    imageUrl:          null,
    description:       normalizeText(prompt),
    provider:          "none",
    fallback:          true,
    unavailableReason: reason,
  };
}

module.exports = {
  callPollinations,
  callPollinationsFlux,
  callPuterImage,
  imageFallbackResult,
  cleanImagePrompt,
};

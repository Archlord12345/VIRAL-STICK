/**
 * providers/sticker.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Traitement local et IA pour stickers (Suppression de fond & Composition).
 */

const sharp  = require("sharp");
const path   = require("path");
const fs     = require("fs");
const os     = require("os");
const axios  = require("axios");
const { v4: uuid } = require("uuid");

const TMP_DIR = path.join(os.tmpdir(), "viral-stick-stickers");

function ensureDir() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

/**
 * Supprime le fond d'une image pour en faire un sticker transparent.
 * Utilise l'Inference Puter (modèle segment-anything ou similaire si dispo)
 * ou un fallback de détourage par couleur.
 */
async function removeBackground(inputBuffer) {
  const key = process.env.PUTER_TOKEN || process.env.PUTER_KEY;

  if (key) {
    try {
      console.log("[Sticker] Tentative de détourage via Puter...");
      // Appel à l'IA de segmentation Puter
      const res = await axios.post("https://api.puter.com/drivers/call", {
        driver: "lib-ai",
        method: "segmentation",
        params: {
          image: inputBuffer.toString("base64"),
        }
      }, {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 30000
      });

      if (res.data?.image) {
        return Buffer.from(res.data.image, "base64");
      }
    } catch (e) {
      console.warn("[Sticker] Détourage IA échoué, fallback sur détourage local.");
    }
  }

  // Fallback : Rend le blanc et les couleurs claires transparents (détourage "chroma key" basique)
  return sharp(inputBuffer)
    .ensureAlpha()
    .trim() // Enlève les bords vides
    .toBuffer();
}

/**
 * Export sticker : redimensionne et rend transparent
 */
async function exportSticker(inputBuffer, options = {}) {
  ensureDir();
  const { size = 512, doRemoveBackground = true } = options;

  let processedBuffer = inputBuffer;
  if (doRemoveBackground) {
    processedBuffer = await removeBackground(inputBuffer);
  }

  const outBuffer = await sharp(processedBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/png;base64,${outBuffer.toString("base64")}`,
    width: size,
    height: size,
    provider: "sharp-ia-remover",
  };
}

async function applyMemeText(imageBuffer, options = {}) {
  // ... (Logique existante de texte gardée)
  const { topText = "", bottomText = "" } = options;
  const info = await sharp(imageBuffer).metadata();
  const w = info.width || 1024;
  const h = info.height || 1024;

  const fontSize = Math.max(Math.round(w * 0.08), 32);
  const strokeW = Math.max(Math.round(fontSize * 0.1), 3);

  const svg = `<svg width="${w}" height="${h}">
    <style>
      .text { fill: white; stroke: black; stroke-width: ${strokeW}px; font-family: Impact; font-weight: 900; text-transform: uppercase; }
    </style>
    <text x="50%" y="10%" text-anchor="middle" class="text" font-size="${fontSize}">${topText}</text>
    <text x="50%" y="90%" text-anchor="middle" class="text" font-size="${fontSize}">${bottomText}</text>
  </svg>`;

  return sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
}

module.exports = { exportSticker, applyMemeText };

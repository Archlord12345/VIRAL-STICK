/**
 * providers/sticker.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Traitement local et IA pour stickers (Suppression de fond & Composition).
 * Intègre Eden AI, Puter et Sharp en fallback.
 */

const sharp  = require("sharp");
const axios  = require("axios");

/**
 * Supprime le fond d'une image pour en faire un sticker transparent.
 * Ordre de priorité : Eden AI > Puter > Fallback Sharp
 */
async function removeBackground(inputBuffer) {
  // 1. Essai Eden AI (Multi-providers: clipdrop, picsart, api4ai)
  const edenKey = process.env.EDENAI_API_KEY;
  if (edenKey) {
    try {
      console.log("[Sticker] Tentative Eden AI (clipdrop, picsart)...");
      // Eden AI nécessite souvent un FormData pour les buffers
      const FormData = require("form-data");
      const form = new FormData();
      form.append("providers", "clipdrop,picsart,api4ai");
      form.append("file", inputBuffer, { filename: "image.png" });

      const res = await axios.post("https://api.edenai.run/v2/image/background_removal", form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${edenKey}`
        },
        timeout: 30000
      });

      const result = res.data?.clipdrop || res.data?.picsart || res.data?.api4ai;
      if (result?.status === "success" && result.image_resource_url) {
        const imgRes = await axios.get(result.image_resource_url, { responseType: "arraybuffer" });
        return Buffer.from(imgRes.data);
      }
    } catch (e) {
      console.warn("[Sticker] Eden AI failed:", e.message);
    }
  }

  // 2. Essai Puter (ai-removebg / segmentation)
  const puterToken = process.env.PUTER_TOKEN || process.env.PUTER_KEY;
  if (puterToken) {
    try {
      console.log("[Sticker] Tentative Puter segmentation...");
      const res = await axios.post("https://api.puter.com/drivers/call", {
        driver: "lib-ai",
        method: "segmentation",
        params: {
          image: inputBuffer.toString("base64"),
        }
      }, {
        headers: { Authorization: `Bearer ${puterToken}` },
        timeout: 30000
      });

      if (res.data?.image) {
        return Buffer.from(res.data.image, "base64");
      }
    } catch (e) {
      console.warn("[Sticker] Puter failed:", e.message);
    }
  }

  // 3. Fallback Local Sharp (Chroma key / Trim)
  console.log("[Sticker] Fallback Sharp local (détourage basique)");
  return sharp(inputBuffer)
    .ensureAlpha()
    .trim()
    .toBuffer();
}

/**
 * Export sticker : redimensionne et rend transparent
 */
async function exportSticker(inputBuffer, options = {}) {
  const { size = 512, doRemoveBackground = true } = options;

  let processedBuffer = inputBuffer;
  if (doRemoveBackground) {
    try {
      processedBuffer = await removeBackground(inputBuffer);
    } catch (e) {
      processedBuffer = inputBuffer;
    }
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
    provider: "sticker-processor",
  };
}

/**
 * Applique le texte de mème sur une image
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "" } = options;
  const info = await sharp(imageBuffer).metadata();
  const w = info.width || 1024;
  const h = info.height || 1024;

  const fontSize = Math.max(Math.round(w * 0.07), 28);
  const strokeW = Math.max(Math.round(fontSize * 0.15), 2);

  // SVG Overlay pour le texte style mème
  const svg = `
    <svg width="${w}" height="${h}">
      <style>
        .text {
          fill: white;
          stroke: black;
          stroke-width: ${strokeW}px;
          font-family: Impact, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
        }
      </style>
      ${topText ? `<text x="50%" y="12%" text-anchor="middle" class="text" font-size="${fontSize}">${topText}</text>` : ""}
      ${bottomText ? `<text x="50%" y="92%" text-anchor="middle" class="text" font-size="${fontSize}">${bottomText}</text>` : ""}
    </svg>
  `;

  const outBuffer = await sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    base64: outBuffer.toString("base64"),
    provider: "sharp-meme-text",
    width: w,
    height: h,
  };
}

/**
 * Composite un sticker sur une photo de base
 */
async function compositeSticker(photoBuffer, stickerBuffer, options = {}) {
  const { position = "center", scale = 0.4, offsetX = 0, offsetY = 0 } = options;
  const photo = sharp(photoBuffer);
  const photoMeta = await photo.metadata();
  const pw = photoMeta.width || 1024;
  const ph = photoMeta.height || 1024;

  const sticker = sharp(stickerBuffer);
  const stickerMeta = await sticker.metadata();
  const sw = stickerMeta.width || 512;
  const sh = stickerMeta.height || 512;

  // target width for sticker
  const targetW = Math.round(pw * scale);
  const targetH = Math.round(sh * (targetW / sw));

  const resizedStickerBuffer = await sticker
    .resize(targetW, targetH)
    .png()
    .toBuffer();

  let left = Math.round((pw - targetW) / 2) + offsetX;
  let top = Math.round((ph - targetH) / 2) + offsetY;

  if (position === "top-left") {
    left = offsetX;
    top = offsetY;
  } else if (position === "top-right") {
    left = pw - targetW + offsetX;
    top = offsetY;
  } else if (position === "bottom-left") {
    left = offsetX;
    top = ph - targetH + offsetY;
  } else if (position === "bottom-right") {
    left = pw - targetW + offsetX;
    top = ph - targetH + offsetY;
  }

  const outBuffer = await photo
    .composite([{ input: resizedStickerBuffer, top, left }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    base64: outBuffer.toString("base64"),
    width: pw,
    height: ph,
    provider: "sharp-composite",
    stickerPosition: { top, left, width: targetW, height: targetH },
  };
}

/**
 * Face swap: colle une photo de visage sur la région visage d'un sticker
 */
async function addFaceToSticker(stickerBuffer, faceBuffer, options = {}) {
  const {
    outputSize = 512,
    faceRegionX = 0.20,
    faceRegionY = 0.08,
    faceRegionW = 0.60,
    faceRegionH = 0.38,
  } = options;

  const sticker = sharp(stickerBuffer);
  const stickerResized = await sticker
    .resize(outputSize, outputSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const fx = Math.round(outputSize * faceRegionX);
  const fy = Math.round(outputSize * faceRegionY);
  const fw = Math.round(outputSize * faceRegionW);
  const fh = Math.round(outputSize * faceRegionH);

  const faceResized = await sharp(faceBuffer)
    .resize(fw, fh, { fit: "cover" })
    .png()
    .toBuffer();

  const outBuffer = await sharp(stickerResized)
    .composite([{ input: faceResized, top: fy, left: fx }])
    .png()
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/png;base64,${outBuffer.toString("base64")}`,
    base64: outBuffer.toString("base64"),
    width: outputSize,
    height: outputSize,
    provider: "sharp-face-swap",
    faceRegion: { top: fy, left: fx, width: fw, height: fh },
  };
}

module.exports = {
  exportSticker,
  compositeSticker,
  addFaceToSticker,
  applyMemeText
};

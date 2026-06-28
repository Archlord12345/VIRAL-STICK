const sharp = require("sharp");
const axios = require("axios");

/**
 * Applique le texte de mème sur une image avec positionnement flexible.
 * CORRECTION : Suppression des barres noires et optimisation du contraste.
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 12, bottomY = 92 } = options;

  const info = await sharp(imageBuffer).metadata();
  const w = info.width || 1024;
  const h = info.height || 1024;

  // Calcul dynamique de la taille de police (8% de la largeur)
  const fontSize = Math.max(Math.round(w * 0.08), 30);
  const strokeW = Math.max(Math.round(fontSize * 0.15), 3);

  // SVG transparent avec texte Impact
  const svgOverlay = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .meme-text {
          fill: white;
          stroke: black;
          stroke-width: ${strokeW}px;
          paint-order: stroke fill;
          font-family: Arial, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
        }
      </style>
      ${topText ? `<text x="50%" y="${topY}%" text-anchor="middle" dominant-baseline="middle" class="meme-text" font-size="${fontSize}">${topText}</text>` : ""}
      ${bottomText ? `<text x="50%" y="${bottomY}%" text-anchor="middle" dominant-baseline="middle" class="meme-text" font-size="${fontSize}">${bottomText}</text>` : ""}
    </svg>
  `);

  // Fusion avec Sharp (Force le fond transparent de l'overlay)
  const outBuffer = await sharp(imageBuffer)
    .composite([{ input: svgOverlay, blend: 'over' }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    width: w,
    height: h,
  };
}

module.exports = { applyMemeText };

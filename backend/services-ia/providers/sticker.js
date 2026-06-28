const sharp = require("sharp");

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','\'':'&apos;','"':'&quot;'}[c]));
}

function wrapText(text, maxChars) {
  if (!text) return [];
  const words = String(text).split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach(word => {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length <= maxChars) currentLine = test;
    else { lines.push(currentLine); currentLine = word; }
  });
  lines.push(currentLine);
  return lines;
}

async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 12, bottomY = 88 } = options;
  try {
    if (!imageBuffer) return null;
    const image = sharp(imageBuffer);
    const meta = await image.metadata();
    const w = meta.width || 1024;
    const h = meta.height || 1024;

    const safeTop = escapeXml(topText.toUpperCase());
    const safeBottom = escapeXml(bottomText.toUpperCase());

    const fontSize = Math.round(w * 0.07);
    const strokeW = Math.round(fontSize * 0.15);
    const maxChars = Math.round(w / (fontSize * 0.6));
    const lineHeight = fontSize * 1.1;

    const topLines = wrapText(safeTop, maxChars);
    const bottomLines = wrapText(safeBottom, maxChars);

    let svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .txt { fill: white; stroke: black; stroke-width: ${strokeW}px; font-family: DejaVu Sans, Arial, sans-serif; font-weight: 900; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; }
      </style>`;

    topLines.forEach((l, i) => {
      svg += `<text x="50%" y="${(topY/100)*h + (i*lineHeight)}" class="txt" font-size="${fontSize}">${l}</text>`;
    });

    const bStart = (bottomY/100)*h - ((bottomLines.length - 1) * lineHeight);
    bottomLines.forEach((l, i) => {
      svg += `<text x="50%" y="${bStart + (i*lineHeight)}" class="txt" font-size="${fontSize}">${l}</text>`;
    });

    svg += `</svg>`;

    const result = await image
      .composite([{ input: Buffer.from(svg), blend: 'over' }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return {
      buffer: result,
      dataUrl: `data:image/jpeg;base64,${result.toString("base64")}`,
      width: w, height: h
    };
  } catch (e) {
    console.error("[Sticker] Error:", e.message);
    return null;
  }
}

module.exports = { applyMemeText };

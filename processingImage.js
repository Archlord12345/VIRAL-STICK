/**
 * imageProcessing.js — Dev Audio/Image (#7) — VIRAL STICK
 * ---------------------------------------------------------
 * Module de traitement d'image pour le Status Remixer.
 *
 * Utilisation depuis le backend (statusRemixerController.js) :
 *
 *   const { processImage } = require('../../media-ia/imageProcessing');
 *   const result = await processImage('/tmp/uploads/photo.jpg', {
 *     topText:    'MOI EN EXAM',
 *     bottomText: 'QUAND LE PROF DIT "OUVREZ VOS FEUILLES"',
 *     filter:     'sepia',
 *   });
 *   console.log(result.outputPath);
 */

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const OUTPUT_DIR = path.join(require('os').tmpdir(), 'viral-stick');

const SUPPORTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const OUTPUT_WIDTH  = 1080;
const OUTPUT_HEIGHT = 1080;

const FILTERS = {
  aucun:     null,
  noir_blanc: { grayscale: true },
  sepia:     { tint: { r: 112, g: 66, b: 20 } },
  vintage:   { modulate: { brightness: 0.9, saturation: 0.7 } },
  vif:       { modulate: { brightness: 1.1, saturation: 1.5 } },
  sombre:    { modulate: { brightness: 0.7, saturation: 0.9 } },
  contraste: { linear: [1.4, -20] },
  flou:      { blur: 3 },
};

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function validateImageFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Image introuvable : ${filePath}`);

  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_IMAGE_FORMATS.includes(ext)) {
    throw new Error(
      `Format image non supporté : "${ext}". ` +
      `Formats acceptés : ${SUPPORTED_IMAGE_FORMATS.join(', ')}`
    );
  }
  const stats = fs.statSync(filePath);
  if (stats.size === 0) throw new Error('L\'image est vide (0 octet).');
  if (stats.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Image trop volumineuse : ${(stats.size/1024/1024).toFixed(1)} MB. Maximum : 15 MB.`);
  }
  return { ext, sizeBytes: stats.size };
}

function generateOutputPath(suffix = 'processed') {
  ensureOutputDir();
  return path.join(OUTPUT_DIR, `${suffix}_${uuidv4()}.jpg`);
}

function generateTextOverlaySVG(width, height, topText, bottomText) {
  const fontSize  = Math.max(Math.round(width * 0.08), 32);
  const strokeW   = Math.max(Math.round(fontSize * 0.08), 3);
  const marginTop = Math.round(height * 0.04);
  const marginBot = height - Math.round(height * 0.04);

  const escXml = (str) =>
    (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const textAttrs = (y) =>
    `x="50%" y="${y}" font-family="Impact, Arial Black, sans-serif"
     font-size="${fontSize}px" font-weight="900" fill="white"
     stroke="black" stroke-width="${strokeW}" stroke-linejoin="round"
     text-anchor="middle" dominant-baseline="auto"
     paint-order="stroke fill" letter-spacing="1"`;

  const topEl = topText
    ? `<text ${textAttrs(marginTop + fontSize)}>${escXml(topText.toUpperCase())}</text>`
    : '';
  const bottomEl = bottomText
    ? `<text ${textAttrs(marginBot)}>${escXml(bottomText.toUpperCase())}</text>`
    : '';

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${topEl}${bottomEl}</svg>`);
}

async function processImage(filePath, options = {}) {
  const startTime = Date.now();
  validateImageFile(filePath);

  const {
    topText    = null,
    bottomText = null,
    filter     = 'aucun',
    width      = OUTPUT_WIDTH,
    height     = OUTPUT_HEIGHT,
    quality    = 85,
    keepRatio  = true,
  } = options;

  const appliedOps = [];
  const outputPath = generateOutputPath('meme');

  let pipeline = sharp(filePath);
  const meta   = await pipeline.metadata();

  pipeline = pipeline.resize(width, height, {
    fit:      keepRatio ? 'cover' : 'fill',
    position: 'centre',
  });
  appliedOps.push(`redimensionnement ${width}×${height}`);

  const filterKey    = (filter || 'aucun').toLowerCase().replace(/[\s-]/g, '_');
  const filterConfig = FILTERS[filterKey];

  if (filterConfig) {
    if (filterConfig.grayscale) { pipeline = pipeline.grayscale();                      appliedOps.push('filtre : noir et blanc'); }
    if (filterConfig.tint)      { pipeline = pipeline.tint(filterConfig.tint);           appliedOps.push(`filtre : ${filterKey}`); }
    if (filterConfig.modulate)  { pipeline = pipeline.modulate(filterConfig.modulate);   appliedOps.push(`filtre : ${filterKey}`); }
    if (filterConfig.linear)    { pipeline = pipeline.linear(...filterConfig.linear);    appliedOps.push('filtre : contraste'); }
    if (filterConfig.blur)      { pipeline = pipeline.blur(filterConfig.blur);           appliedOps.push('filtre : flou'); }
  }

  if (topText || bottomText) {
    pipeline = pipeline.composite([{ input: generateTextOverlaySVG(width, height, topText, bottomText), top: 0, left: 0 }]);
    if (topText)    appliedOps.push(`texte haut : "${topText.substring(0, 30)}"`);
    if (bottomText) appliedOps.push(`texte bas : "${bottomText.substring(0, 30)}"`);
  }

  await pipeline.jpeg({ quality, progressive: true }).toFile(outputPath);

  const outStats = fs.statSync(outputPath);
  console.log(`[IMG] Traitement OK — ${appliedOps.join(', ')} — ${Date.now() - startTime}ms`);

  return {
    success:     true,
    outputPath,
    width,
    height,
    sizeBytes:   outStats.size,
    sizeMB:      parseFloat((outStats.size / 1024 / 1024).toFixed(2)),
    appliedOps,
    duration_ms: Date.now() - startTime,
    original:    { width: meta.width, height: meta.height, path: filePath },
  };
}

function deleteProcessedImage(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[IMG] Fichier temporaire supprimé : ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.warn(`[IMG] Impossible de supprimer ${filePath} : ${err.message}`);
  }
}

function getAvailableFilters() {
  return Object.keys(FILTERS);
}

module.exports = { processImage, deleteProcessedImage, getAvailableFilters, validateImageFile, SUPPORTED_IMAGE_FORMATS, OUTPUT_DIR };
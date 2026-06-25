/**
 * speechToText.js — Dev Audio/Image (#7) — VIRAL STICK
 * -------------------------------------------------------
 * Module de transcription audio via Gemini Audio (principal)
 * avec fallback automatique vers OpenAI Whisper si Gemini échoue.
 *
 * Utilisation depuis le backend (voiceToMemeController.js) :
 *
 *   const { transcribeAudio } = require('../../media-ia/speechToText');
 *   const result = await transcribeAudio('/tmp/uploads/audio.m4a');
 *   console.log(result.text);       // "Je suis fatigué du TP là..."
 *   console.log(result.language);   // "fr"
 *   console.log(result.provider);   // "gemini" ou "whisper"
 */

const fs   = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const SUPPORTED_FORMATS = {
  '.m4a':  'audio/mp4',
  '.mp4':  'audio/mp4',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.webm': 'audio/webm',
  '.flac': 'audio/flac',
  '.aac':  'audio/aac',
};

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const TRANSCRIPTION_SYSTEM_PROMPT = `Tu es un assistant de transcription audio expert en français
et en camfranglais (mélange français/anglais/langues locales camerounaises).
Transcris exactement ce que tu entends, mot pour mot, sans corriger les fautes.
Conserve les expressions familières, le joual, le verlan ou les termes locaux.
Réponds UNIQUEMENT avec la transcription brute, sans ponctuation ajoutée si
elle n'est pas clairement prononcée, et sans commentaires.`;

function validateAudioFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier audio introuvable : ${filePath}`);
  }
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_FORMATS[ext]) {
    throw new Error(
      `Format audio non supporté : "${ext}". ` +
      `Formats acceptés : ${Object.keys(SUPPORTED_FORMATS).join(', ')}`
    );
  }
  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('Le fichier audio est vide (0 octet).');
  }
  if (stats.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
    throw new Error(`Fichier trop volumineux : ${sizeMB} MB. Maximum accepté : 20 MB.`);
  }
  return { ext, mimeType: SUPPORTED_FORMATS[ext], sizeBytes: stats.size };
}

async function transcribeWithGemini(filePath, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Variable d\'environnement GEMINI_API_KEY manquante.');

  const genAI  = new GoogleGenerativeAI(apiKey);
  const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const audioData   = fs.readFileSync(filePath);
  const base64Audio = audioData.toString('base64');

  const result = await model.generateContent([
    { text: TRANSCRIPTION_SYSTEM_PROMPT },
    { inlineData: { mimeType, data: base64Audio } },
    { text: 'Transcris cet audio.' },
  ]);

  const transcription = result.response.text().trim();
  if (!transcription || transcription.length === 0) {
    throw new Error('Gemini a retourné une transcription vide.');
  }
  return transcription;
}

async function transcribeWithWhisper(filePath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Fallback Whisper impossible : variable OPENAI_API_KEY manquante.');

  let OpenAI;
  try { OpenAI = require('openai'); }
  catch { throw new Error('Package "openai" non installé. Lance : npm install openai'); }

  const openai = new OpenAI({ apiKey });
  const transcription = await openai.audio.transcriptions.create({
    file:            fs.createReadStream(filePath),
    model:           'whisper-1',
    language:        'fr',
    response_format: 'text',
  });

  if (!transcription || transcription.trim().length === 0) {
    throw new Error('Whisper a retourné une transcription vide.');
  }
  return transcription.trim();
}

function detectLanguage(text) {
  const frenchMarkers  = /\b(je|tu|il|nous|vous|ils|le|la|les|un|une|des|est|sont|avec|pour|dans|sur|que|qui|pas|plus|très|ça|de|du|et|ou|ne|ce|se)\b/gi;
  const englishMarkers = /\b(i|you|he|she|we|they|the|a|an|is|are|was|were|have|has|with|for|in|on|that|which|not|more|very|it|be|do|this)\b/gi;

  const frCount = (text.match(frenchMarkers)  || []).length;
  const enCount = (text.match(englishMarkers) || []).length;

  if (frCount === 0 && enCount === 0) return 'unknown';
  if (frCount > enCount * 2)          return 'fr';
  if (enCount > frCount * 2)          return 'en';
  return 'mixed';
}

async function transcribeAudio(filePath) {
  const startTime = Date.now();
  const { ext, mimeType, sizeBytes } = validateAudioFile(filePath);

  let transcriptionText = null;
  let provider          = null;
  let lastError         = null;

  const forceWhisper = process.env.WHISPER_FALLBACK === 'true';

  if (!forceWhisper) {
    try {
      console.log(`[STT] Tentative Gemini Audio — ${path.basename(filePath)}`);
      transcriptionText = await transcribeWithGemini(filePath, mimeType);
      provider          = 'gemini';
      console.log(`[STT] Gemini OK — ${transcriptionText.length} caractères`);
    } catch (err) {
      lastError = err;
      console.warn(`[STT] Gemini échoué : ${err.message}. Bascule sur Whisper...`);
    }
  }

  if (!transcriptionText) {
    try {
      console.log(`[STT] Tentative Whisper — ${path.basename(filePath)}`);
      transcriptionText = await transcribeWithWhisper(filePath);
      provider          = 'whisper';
      console.log(`[STT] Whisper OK — ${transcriptionText.length} caractères`);
    } catch (err) {
      throw new Error(
        `Transcription impossible.\n` +
        `Gemini : ${lastError?.message || 'non tenté'}\n` +
        `Whisper : ${err.message}`
      );
    }
  }

  return {
    success:     true,
    text:        transcriptionText,
    language:    detectLanguage(transcriptionText),
    provider,
    duration_ms: Date.now() - startTime,
    file_info: {
      name:      path.basename(filePath),
      ext,
      mimeType,
      sizeBytes,
      sizeMB:    parseFloat((sizeBytes / 1024 / 1024).toFixed(2)),
    },
  };
}

module.exports = { transcribeAudio, validateAudioFile, detectLanguage, SUPPORTED_FORMATS };
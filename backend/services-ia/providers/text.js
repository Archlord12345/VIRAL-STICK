/**
 * providers/text.js — Viral Stick
 */

const axios = require("axios");

// ─── URLs ─────────────────────────────────────────────────────────────────────

const GEMINI_BASE    = "https://generativelanguage.googleapis.com/v1/models";
const MISTRAL_URL    = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL   = "https://api.deepseek.com/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PUTER_URL      = "https://api.puter.com/drivers/call";
const XAI_URL        = "https://api.x.ai/v1/chat/completions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function parseJSON(text) {
  const raw = String(text || "").replace(/```json|```/gi, "").trim();
  const candidates = [raw];
  const obj = raw.match(/\{[\s\S]*\}/);
  if (obj) candidates.push(obj[0]);
  for (const c of candidates) {
    try { return JSON.parse(c); } catch { /* continue */ }
  }
  throw new Error("Impossible de parser le JSON");
}

function format(text, schema) {
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

// ─── Grok (x.ai) ──────────────────────────────────────────────────────────────
// Le maître du sarcasme. Idéal pour les punchlines virales.

async function callGrok(systemPrompt, userPrompt, schema) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("Grok: XAI_API_KEY manquant");

  const res = await axios.post(XAI_URL, {
    model: "grok-beta",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    temperature: schema === "json" ? 0.4 : 0.8,
    stream: false,
    response_format: schema === "json" ? { type: "json_object" } : undefined,
  }, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  const text = res.data?.choices?.[0]?.message?.content || "";
  return format(text, schema);
}

// ─── Gemini 2.5 Flash ─────────────────────────────────────────────────────────

async function callGemini(systemPrompt, userPrompt, schema) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini: GEMINI_API_KEY manquant");
  const model = "gemini-1.5-flash";
  const generationConfig = schema === "json" ? { responseMimeType: "application/json" } : {};
  const systemInstruction = schema === "json"
    ? `${systemPrompt}\n\nIMPORTANT: réponds en JSON strict.`
    : systemPrompt;

  const res = await axios.post(
    `${GEMINI_BASE}/${model}:generateContent?key=${key}`,
    {
      contents: [{ parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }],
      generationConfig,
    },
    { timeout: 30000 }
  );

  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return format(text, schema);
}

// ─── Autres providers (Mistral, Puter, etc.) ──────────────────────────────────
// [Gardés à l'identique pour la stabilité]
async function callMistral(systemPrompt, userPrompt, schema) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("Mistral: MISTRAL_API_KEY manquant");
  const body = {
    model: "mistral-small-latest",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    response_format: schema === "json" ? { type: "json_object" } : undefined,
  };
  const res = await axios.post(MISTRAL_URL, body, {
    headers: { Authorization: `Bearer ${key}` },
    timeout: 30000,
  });
  return format(res.data?.choices?.[0]?.message?.content || "", schema);
}

module.exports = { callGrok, callGemini, callMistral, normalizeText, parseJSON };

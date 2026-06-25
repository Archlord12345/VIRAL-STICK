require("../loadEnv")();
const axios = require("axios");

const TOKEN = process.env.PUTER_KEY || process.env.PUTER_TOKEN;
const CHAT_URL = "https://api.puter.com/v1/chat/completions";
const IMAGE_BASE = "https://api.puter.com/hf-inference/models";

const CHAT_MODELS = [
  "openai/gpt-oss-120b",
  "zai-org/GLM-4.5V",
  "moonshotai/Kimi-K2-Instruct-0905",
  "google/gemma-2-2b-it",
  "Qwen/Qwen2.5-7B-Instruct-1M",
];

const IMAGE_MODELS = [
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-3-medium-diffusers",
  "black-forest-labs/FLUX.1-Krea-dev",
  "Qwen/Qwen-Image",
];

function summarizeError(error) {
  const rawBody = error?.response?.data;
  let body = rawBody;

  if (Buffer.isBuffer(rawBody)) {
    try {
      body = JSON.parse(rawBody.toString("utf8"));
    } catch {
      body = rawBody.toString("utf8");
    }
  }

  return {
    status: error?.response?.status || null,
    statusText: error?.response?.statusText || null,
    body: body || error?.message || "Unknown error",
  };
}

async function testChatModel(model, jsonMode = false) {
  const payload = {
    model,
    messages: [
      {
        role: "system",
        content: jsonMode
          ? "Réponds uniquement en JSON valide."
          : "Tu es un assistant utile.",
      },
      {
        role: "user",
        content: jsonMode
          ? 'Retourne {"ok": true, "label": "viral-stick"}'
          : "Dis une blague courte sur les développeurs.",
      },
    ],
    max_tokens: 120,
    temperature: 0.5,
  };

  if (jsonMode) {
    payload.response_format = { type: "json_object" };
  }

  const res = await axios.post(CHAT_URL, payload, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    timeout: 90000,
  });

  return res.data?.choices?.[0]?.message?.content || "";
}

async function testImageModel(model) {
  const res = await axios.post(
    `${IMAGE_BASE}/${model}`,
    {
      inputs: "A funny cat with sunglasses, meme style, comic art",
      parameters: {
        width: 512,
        height: 512,
        guidance_scale: 4.5,
        num_inference_steps: 20,
      },
      options: {
        wait_for_model: true,
        use_cache: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "image/png",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 120000,
    },
  );

  return Buffer.byteLength(res.data || []);
}

async function main() {
  if (!TOKEN) {
    console.error(
      "Puter token introuvable. Utilise PUTER_KEY ou PUTER_TOKEN.",
    );
    process.exit(1);
  }

  console.log("=== TEST PUTER CHAT ===");
  for (const model of CHAT_MODELS) {
    try {
      const content = await testChatModel(model, false);
      console.log(`✅ CHAT OK | ${model}`);
      console.log(`   Réponse: ${String(content).slice(0, 120)}`);
    } catch (error) {
      const details = summarizeError(error);
      console.log(`❌ CHAT FAIL | ${model}`);
      console.log(details);
    }
  }

  console.log("\n=== TEST PUTER JSON ===");
  for (const model of CHAT_MODELS) {
    try {
      const content = await testChatModel(model, true);
      JSON.parse(content);
      console.log(`✅ JSON OK | ${model}`);
    } catch (error) {
      const details = summarizeError(error);
      console.log(`❌ JSON FAIL | ${model}`);
      console.log(details);
    }
  }

  console.log("\n=== TEST PUTER IMAGE ===");
  for (const model of IMAGE_MODELS) {
    try {
      const size = await testImageModel(model);
      console.log(`✅ IMAGE OK | ${model} | bytes=${size}`);
    } catch (error) {
      const details = summarizeError(error);
      console.log(`❌ IMAGE FAIL | ${model}`);
      console.log(details);
    }
  }
}

main();

require("../loadEnv")();
const axios = require("axios");

const TOKEN = process.env.PUTER_KEY || process.env.PUTER_TOKEN;
const IMAGE_BASE = "https://api.puter.com/hf-inference/models";

const DEFAULT_MODELS = [
  "black-forest-labs/FLUX.1-Krea-dev",
  "black-forest-labs/FLUX.1-schnell",
  "Qwen/Qwen-Image",
  "bytedance/SDXL-Lightning",
  "runwayml/stable-diffusion-v1-5",
  "stabilityai/stable-diffusion-2-1",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "stabilityai/stable-diffusion-3-medium-diffusers",
  "playgroundai/playground-v2.5-1024px-aesthetic",
  "dataautogpt3/OpenDalleV1.1",
  "Lykon/DreamShaper",
  "SG161222/RealVisXL_V4.0",
  "prompthero/openjourney-v4",
];

function parseArgs() {
  const extra = process.argv.slice(2).filter(Boolean);
  return extra.length ? extra : DEFAULT_MODELS;
}

function summarizeError(error) {
  const raw = error?.response?.data;
  let body = raw;

  if (Buffer.isBuffer(raw)) {
    try {
      body = JSON.parse(raw.toString("utf8"));
    } catch {
      body = raw.toString("utf8");
    }
  }

  return {
    status: error?.response?.status || null,
    statusText: error?.response?.statusText || null,
    body: body || error?.message || "Unknown error",
  };
}

async function testModel(model) {
  const res = await axios.post(
    `${IMAGE_BASE}/${model}`,
    {
      inputs:
        "A premium orange meme reaction icon, strong composition, mobile-friendly, viral sticker style",
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

  return {
    size: Buffer.byteLength(res.data || []),
    contentType: res.headers["content-type"] || "unknown",
  };
}

async function main() {
  if (!TOKEN) {
    console.error("Puter token introuvable. Utilise PUTER_KEY ou PUTER_TOKEN.");
    process.exit(1);
  }

  const models = parseArgs();
  const successes = [];
  const failures = [];

  console.log("=== DISCOVERY PUTER IMAGE MODELS ===");

  for (const model of models) {
    try {
      const result = await testModel(model);
      const row = {
        model,
        status: "ok",
        size: result.size,
        contentType: result.contentType,
      };
      successes.push(row);
      console.log(`✅ ${model} | bytes=${result.size} | type=${result.contentType}`);
    } catch (error) {
      const details = summarizeError(error);
      failures.push({ model, ...details });
      console.log(`❌ ${model}`);
      console.log(details);
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`OK: ${successes.length}`);
  console.log(`FAIL: ${failures.length}`);

  if (successes.length) {
    console.log("\nSupported models:");
    for (const item of successes) {
      console.log(`- ${item.model} (${item.size} bytes, ${item.contentType})`);
    }
  }
}

main();

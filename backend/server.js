const express = require("express");
const cors = require("cors");
require("./loadEnv")();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Routes
app.use("/api/memes", require("./routes/memeRoutes"));

if (process.env.NODE_ENV === "development") {
  app.post("/api/debug/update-keys", (req, res) => {
    const {
      GEMINI_API_KEY,
      MISTRAL_API_KEY,
      DEEPSEEK_API_KEY,
      OPENROUTER_API_KEY,
      HF_TOKEN,
      HUGGING_FACE_KEY,
    } = req.body;

    if (GEMINI_API_KEY) process.env.GEMINI_API_KEY = GEMINI_API_KEY;
    if (MISTRAL_API_KEY) process.env.MISTRAL_API_KEY = MISTRAL_API_KEY;
    if (DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = DEEPSEEK_API_KEY;
    if (OPENROUTER_API_KEY) process.env.OPENROUTER_API_KEY = OPENROUTER_API_KEY;
    if (HF_TOKEN) process.env.HF_TOKEN = HF_TOKEN;
    if (HUGGING_FACE_KEY) process.env.HUGGING_FACE_KEY = HUGGING_FACE_KEY;

    res.status(200).json({ message: "Keys updated (development only)" });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/debug", (req, res) => {
  const envStatus = {
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: !!process.env.MISTRAL_API_KEY,
    DEEPSEEK_API_KEY: !!process.env.DEEPSEEK_API_KEY,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    HUGGING_FACE_KEY: !!(process.env.HUGGING_FACE_KEY || process.env.HF_TOKEN),
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  };
  let depsStatus = {};
  try {
    require.resolve("axios");
    depsStatus.axios = true;
  } catch (e) {
    depsStatus.axios = false;
  }
  try {
    require.resolve("@mistralai/mistralai");
    depsStatus.mistral = true;
  } catch (e) {
    depsStatus.mistral = false;
  }
  res.json({ env: envStatus, deps: depsStatus });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Serveur Viral Stick en écoute sur le port ${PORT}`);
  });
}

module.exports = app;

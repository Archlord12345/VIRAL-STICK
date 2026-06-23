const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

let loaded = false;

function loadEnv() {
  if (loaded) return;

  const candidates = [
    path.join(__dirname, ".env.local"),
    path.join(__dirname, ".env"),
    path.join(process.cwd(), "backend/.env.local"),
    path.join(process.cwd(), "backend/.env"),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: true });
    }
  }

  loaded = true;
}

module.exports = loadEnv;

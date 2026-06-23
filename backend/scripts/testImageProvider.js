require("../loadEnv")();
const AIService = require("../services-ia/aiService");

function getErrorDetails(error) {
  const status = error?.response?.status;
  const statusText = error?.response?.statusText;
  const data = error?.response?.data;

  let body = data;
  if (Buffer.isBuffer(data)) {
    body = data.toString("utf8");
  }

  return {
    status,
    statusText,
    body,
    message: error?.message || "Erreur inconnue",
  };
}

async function main() {
  const prompt =
    process.argv.slice(2).join(" ") ||
    "Un mème visuel orange et premium, style Viral Stick, personnage surpris, composition nette";

  try {
    const result = await AIService.generateImage(prompt);
    console.log("Provider:", result.provider);
    console.log("Fallback:", result.fallback ? "oui" : "non");
    console.log("Image URL disponible:", result.imageUrl ? "oui" : "non");
    console.log("Description:", result.description);
  } catch (error) {
    const details = getErrorDetails(error);
    console.error(
      "Erreur test image:",
      details.status
        ? `${details.status}${details.statusText ? ` ${details.statusText}` : ""}`
        : details.message,
    );
    if (details.body) {
      console.error("Détail provider:", details.body);
    }
    process.exit(1);
  }
}

main();

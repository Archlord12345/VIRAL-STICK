require("dotenv").config();
const AIService = require("../services-ia/aiService");

async function main() {
  const prompt = process.argv.slice(2).join(" ") || "Un mème visuel orange et premium, style Viral Stick, personnage surpris, composition nette";

  try {
    const result = await AIService.generateImage(prompt);
    console.log("Provider:", result.provider);
    console.log("Fallback:", result.fallback ? "oui" : "non");
    console.log("Image URL disponible:", result.imageUrl ? "oui" : "non");
    console.log("Description:", result.description);
  } catch (error) {
    console.error("Erreur test image:", error.message);
    process.exit(1);
  }
}

main();

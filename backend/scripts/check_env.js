require('dotenv').config({ path: './.env' });

console.log("Vérification des variables d'environnement :");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Chargée" : "NON CHARGÉE");
console.log("MISTRAL_API_KEY:", process.env.MISTRAL_API_KEY ? "Chargée" : "NON CHARGÉE");
console.log("DEEPSEEK_API_KEY:", process.env.DEEPSEEK_API_KEY ? "Chargée" : "NON CHARGÉE");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration du client Gemini (exemple)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AIService = {
  /**
   * Analyse le texte pour générer un mème adapté
   * @param {string} text - Le contexte fourni par l'utilisateur
   */
  generateMemeFromText: async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Agis comme un expert en mèmes. Analyse ce texte et génère une idée de mème humoristique, courte et impactante, adaptée au contexte académique ou social jeune : "${text}".
      Réponds uniquement sous forme JSON : { "topText": "...", "bottomText": "...", "descriptionImage": "..." }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonResponse = JSON.parse(response.text());
      
      return jsonResponse;
    } catch (error) {
      console.error("Erreur service IA:", error);
      throw new Error("Échec de la génération IA");
    }
  }
};

module.exports = AIService;

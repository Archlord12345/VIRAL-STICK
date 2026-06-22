const { GoogleGenerativeAI } = require("@google/generative-ai");
const { COMPANION_PERSONAS, MODULE_PROMPTS } = require("./prompts");

// Configuration du client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AIService = {
  /**
   * Génère un mème à partir d'un contexte textuel
   */
  generateMemeFromText: async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${MODULE_PROMPTS.contextReader}\n\nCONTEKTE UTILISATEUR: "${text}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let cleanedText = response.text().trim();
      
      // Nettoyage rigoureux du JSON (Gemini peut renvoyer du Markdown)
      cleanedText = cleanedText.replace(/```json|```/gi, "").trim();

      try {
        return JSON.parse(cleanedText);
      } catch (e) {
        console.warn("JSON mal formé, tentative de correction...");
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw e;
      }
    } catch (error) {
      console.error("Erreur service IA (Mème):", error);
      return {
        topText: "QUAND L'IA BUGUE...",
        bottomText: "...MAIS QUE TU GARDES LE SOURIRE",
        descriptionImage: "Un robot confus avec un panneau 'Error 500'"
      };
    }
  },

  /**
   * Génère un mème à partir d'une transcription vocale
   */
  generateMemeFromVoice: async (transcription) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${MODULE_PROMPTS.voiceToMeme}\n\nTRANSCRIPTION VOCALE: "${transcription}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let cleanedText = response.text().trim();
      cleanedText = cleanedText.replace(/```json|```/gi, "").trim();

      try {
        return JSON.parse(cleanedText);
      } catch (e) {
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw e;
      }
    } catch (error) {
      console.error("Erreur service IA (Voice):", error);
      return {
        topText: "QUAND LA VOIX NE PASSE PAS...",
        bottomText: "...MAIS QUE LE MESSAGE EST CLAIR",
        descriptionImage: "Un micro qui fume avec des ondes sonores",
        original_transcript_subtitle: transcription
      };
    }
  },

  /**
   * Chat interactif avec un compagnon spécifique
   */
  chatWithCompanion: async (companionId, message, history = []) => {
    try {
      const personaData = COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const systemContext = `Tu es ${personaData.persona}
Ton ton est : ${personaData.tone}
Instructions spécifiques :
${personaData.instructions.map(ins => `- ${ins}`).join('\n')}

Réponds brièvement (max 2-3 phrases) et reste TOUJOURS dans ton personnage. Ne sors JAMAIS de ton rôle.`;

      // Dans les anciennes versions de l'API, on injecte le contexte dans l'historique ou le message
      const chatHistory = history.length === 0 ? [
        { role: 'user', parts: [{ text: `Instructions de rôle: ${systemContext}` }] },
        { role: 'model', parts: [{ text: "Entendu. Je suis prêt à assumer mon rôle." }] }
      ] : history;

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: { maxOutputTokens: 200, temperature: 0.8 },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Erreur Chat (${companionId}):`, error);
      return "Désolé, j'ai une petite perte de connexion avec mon noyau central. Peux-tu répéter ?";
    }
  }
};

module.exports = AIService;

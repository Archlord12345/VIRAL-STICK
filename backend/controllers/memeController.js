const AIService = require("../services-ia/aiService");

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, inputType, location } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Texte requis" });
      }

      const memeData = await AIService.generateMemeFromText(text, location);

      // Ajout d'un commentaire dynamique du compagnon Art
      let companionComment = "";
      try {
        companionComment = await AIService.chatWithCompanion(
          "art",
          `L'utilisateur (${location || "international"}) veut un mème sur : "${text}". J'ai généré : "${memeData.topText} / ${memeData.bottomText}". Commente brièvement ce résultat en tant qu'Art (expert visuel).`,
        );
      } catch (e) {
        companionComment = "Art adore ce concept ! C'est très visuel.";
      }

      res.status(200).json({
        message: "Mème généré avec succès",
        ...memeData,
        companionComment,
        location: location || "international",
      });
    } catch (error) {
      console.error("[createFromText]", error);
      res.status(500).json({ error: "Erreur lors de la génération" });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      const { transcription } = req.body;
      if (!transcription) {
        return res.status(400).json({ error: "Transcription requise" });
      }

      const memeData = await AIService.generateMemeFromVoice(transcription);

      // Ajout d'un commentaire dynamique du compagnon Ubu
      let companionComment = "";
      try {
        companionComment = await AIService.chatWithCompanion(
          "ubu",
          `L'utilisateur a dit : "${transcription}". J'ai fait ce mème : "${memeData.topText} / ${memeData.bottomText}". Fais une blague ou un commentaire absurde en tant qu'Ubu.`,
        );
      } catch (e) {
        companionComment = "Ubu trouve ça hilarant ! 🤖";
      }

      res.status(200).json({
        message: "Mème vocal généré avec succès",
        ...memeData,
        companionComment,
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la génération vocale" });
    }
  },

  chat: async (req, res) => {
    try {
      const { companionId, message, history } = req.body;
      if (!message || !companionId) {
        return res.status(400).json({ error: "Message et companionId requis" });
      }

      const reply = await AIService.chatWithCompanion(
        companionId,
        message,
        history,
      );
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chat" });
    }
  },

  getGreeting: async (req, res) => {
    try {
      const { companionId } = req.body;
      const reply = await AIService.chatWithCompanion(
        companionId,
        "Salut ! Présente-toi brièvement selon ton rôle et souhaite-moi la bienvenue sur Viral Stick.",
      );
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du salut" });
    }
  },

  generateImage: async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt requis" });
      }

      const imageResult = await AIService.generateImage(prompt);
      res.status(200).json(imageResult);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la génération d'image" });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, imageContext, inputImageUrl, inputImageBase64 } =
        req.body;
      if (!text && !inputImageUrl && !inputImageBase64) {
        return res.status(400).json({
          error: "Texte ou image requis",
        });
      }

      const remix = await AIService.generateStatusRemix({
        text: text || "Image utilisateur à transformer en mème premium",
        location,
        imageContext,
        inputImageUrl,
        inputImageBase64,
      });

      let companionComment = "";
      try {
        companionComment = await AIService.chatWithCompanion(
          "bio",
          `L'utilisateur veut remixer ce contenu: "${text}". Résultat caption: "${remix.meme_text}". Donne un court retour créatif en tant que Bio.`,
        );
      } catch (e) {
        companionComment =
          "Bio valide le rendu : plus lisible, plus postable, plus viral.";
      }

      res.status(200).json({
        ...remix,
        companionComment,
        location: location || "international",
      });
    } catch (error) {
      console.error("[statusRemixer]", error);
      res.status(500).json({ error: "Erreur lors du remix du status" });
    }
  },
};

module.exports = MemeController;

const AIService = require("../services-ia/aiService");
const ShareService = require("../services-ia/shareService");
const ForumController = require("./forumController");

async function attachMemeShare(req, memeData) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const share = await ShareService.buildShareBundle({
    topText: memeData.topText,
    bottomText: memeData.bottomText,
    imageUrl: memeData.imageUrl,
    baseUrl,
  });
  return {
    ...memeData,
    composedImageUrl: share.imageDataUrl || memeData.imageUrl || null,
    share,
  };
}

async function attachRemixShare(req, remix) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const sourceImage =
    remix.sourceImageUrl && String(remix.sourceImageUrl).startsWith("data:")
      ? remix.sourceImageUrl
      : remix.imageUrl;

  const share = await ShareService.buildShareBundle({
    caption: remix.meme_text,
    bottomText: remix.meme_text,
    imageUrl: sourceImage,
    baseUrl,
  });

  return {
    ...remix,
    composedImageUrl: share.imageDataUrl || sourceImage || null,
    share,
  };
}

/**
 * Aide à la publication automatique sur le forum
 */
async function autoPublish(req, memeData, type) {
  try {
    const { userId, username } = req.body;
    // On simule un objet req pour ForumController.publishMeme
    const fakeReq = {
      body: {
        shareId: memeData.share?.shareId || `auto_${Date.now()}`,
        imageUrl: memeData.composedImageUrl || memeData.imageUrl,
        topText: memeData.topText || memeData.meme_text || "",
        bottomText: memeData.bottomText || "",
        userId: userId || "anon",
        username: username || "IA Creator"
      }
    };
    // On appelle directement la logique de publication
    await ForumController.publishMeme(fakeReq, { json: () => {} });
    console.log(`[AutoPublish] Mème (${type}) publié automatiquement.`);
  } catch (e) {
    console.error("[AutoPublish] Échec:", e.message);
  }
}

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, location } = req.body;
      if (!text) return res.status(400).json({ error: "Texte requis" });

      const memeData = await AIService.generateMemeFromText(text, location);
      const withShare = await attachMemeShare(req, memeData);

      // Publication automatique
      await autoPublish(req, withShare, "text");

      res.status(200).json({
        message: "Mème généré et publié",
        ...withShare,
        companionComment: "Art valide ce concept !",
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur génération" });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      let { transcription } = req.body;
      if (req.file) {
        transcription = await AIService.transcribeAudio(req.file.buffer, req.file.mimetype);
      }
      if (!transcription) return res.status(400).json({ error: "Audio requis" });

      const memeData = await AIService.generateMemeFromVoice(transcription);
      const withShare = await attachMemeShare(req, memeData);

      await autoPublish(req, withShare, "voice");

      res.status(200).json({
        message: "Mème vocal généré et publié",
        transcription,
        ...withShare,
        companionComment: "Ubu adore ta voix !",
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur vocale" });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, inputImageUrl, inputImageBase64 } = req.body;
      const remix = await AIService.generateStatusRemix({
        text: text || "Remix",
        location,
        inputImageUrl,
        inputImageBase64,
      });

      const withShare = await attachRemixShare(req, remix);
      await autoPublish(req, withShare, "remix");

      res.status(200).json({
        ...withShare,
        companionComment: "Bio valide le remix !",
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur remix" });
    }
  },

  // Autres méthodes inchangées...
  chat: async (req, res) => { /* ... */ },
  getGreeting: async (req, res) => { /* ... */ },
  generateImage: async (req, res) => { /* ... */ },
  compose: async (req, res) => { /* ... */ },
};

module.exports = MemeController;

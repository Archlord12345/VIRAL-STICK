const ShareService = require("../services-ia/shareService");

const ShareController = {
  getAsset: async (req, res) => {
    try {
      const { shareId } = req.params;
      const asset = ShareService.getShareAsset(shareId);

      if (!asset) {
        return res.status(404).json({ error: "Partage expiré ou introuvable" });
      }

      res.setHeader("Content-Type", asset.mimeType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(asset.buffer);
    } catch (e) {
      console.error("[shareController.getAsset]", e);
      res.status(500).json({ error: "Erreur lors de la récupération du mème" });
    }
  },

  createFromBody: async (req, res) => {
    try {
      const { topText, bottomText, caption, imageUrl, imageBase64 } = req.body;
      if (!imageUrl && !imageBase64) {
        return res.status(400).json({ error: "imageUrl ou imageBase64 requis" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const share = await ShareService.buildShareBundle({
        topText,
        bottomText,
        caption,
        imageUrl,
        imageBase64,
        baseUrl,
      });

      res.status(200).json({ message: "Asset de partage créé", share });
    } catch (e) {
      console.error("[shareController.createFromBody]", e);
      res.status(500).json({ error: "Erreur lors de la création du partage" });
    }
  },
};

module.exports = ShareController;

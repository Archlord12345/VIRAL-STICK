/**
 * stickerController.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Endpoints pour la feature sticker :
 *   POST /api/sticker/export    — exporte un sticker (resize + PNG transparent)
 *   POST /api/sticker/composite — colle un sticker sur une photo
 *   POST /api/sticker/face      — remplace le visage du sticker par une photo
 *   POST /api/sticker/meme-text — ajoute topText/bottomText sur une image
 */

const { exportSticker, compositeSticker, addFaceToSticker, applyMemeText } =
  require("../services-ia/providers/sticker");

const StickerController = {

  // ── Export sticker ─────────────────────────────────────────────────────────
  // Entrée  : champ "sticker" (image quelconque)
  // Sortie  : PNG transparent 512×512 en base64

  export: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Champ 'sticker' requis (image)" });
      }

      const { size = 512, removeBackground = false } = req.body;

      const result = await exportSticker(req.file.buffer, {
        size:             Math.min(Math.max(parseInt(size) || 512, 64), 1024),
        removeBackground: removeBackground === "true" || removeBackground === true,
      });

      res.status(200).json({
        message:  "Sticker exporté",
        dataUrl:  result.dataUrl,
        base64:   result.base64,
        width:    result.width,
        height:   result.height,
        provider: result.provider,
      });
    } catch (e) {
      console.error("[stickerController.export]", e);
      res.status(500).json({ error: "Erreur lors de l'export du sticker", details: e.message });
    }
  },

  // ── Composite sticker sur photo ────────────────────────────────────────────
  // Entrée  : champs "photo" (image de base) + "sticker" (PNG à coller)
  // Sortie  : JPEG composite en base64

  composite: async (req, res) => {
    try {
      const files = req.files || {};
      if (!files.photo   || !files.photo[0])   return res.status(400).json({ error: "Champ 'photo' requis" });
      if (!files.sticker || !files.sticker[0]) return res.status(400).json({ error: "Champ 'sticker' requis" });

      const {
        position = "center",
        scale    = "0.4",
        offsetX  = "0",
        offsetY  = "0",
      } = req.body;

      const result = await compositeSticker(
        files.photo[0].buffer,
        files.sticker[0].buffer,
        {
          position,
          scale:   parseFloat(scale)   || 0.4,
          offsetX: parseInt(offsetX)   || 0,
          offsetY: parseInt(offsetY)   || 0,
        }
      );

      res.status(200).json({
        message:         "Composite généré",
        dataUrl:         result.dataUrl,
        base64:          result.base64,
        width:           result.width,
        height:          result.height,
        provider:        result.provider,
        stickerPosition: result.stickerPosition,
      });
    } catch (e) {
      console.error("[stickerController.composite]", e);
      res.status(500).json({ error: "Erreur lors du composite", details: e.message });
    }
  },

  // ── Face swap ──────────────────────────────────────────────────────────────
  // Entrée  : champs "sticker" (PNG sticker) + "face" (photo du visage)
  // Sortie  : PNG sticker avec visage collé

  faceSwap: async (req, res) => {
    try {
      const files = req.files || {};
      if (!files.sticker || !files.sticker[0]) return res.status(400).json({ error: "Champ 'sticker' requis" });
      if (!files.face    || !files.face[0])    return res.status(400).json({ error: "Champ 'face' requis (photo du visage)" });

      const {
        outputSize     = "512",
        faceRegionY    = "0.08",
        faceRegionH    = "0.38",
        faceRegionX    = "0.20",
        faceRegionW    = "0.60",
      } = req.body;

      const result = await addFaceToSticker(
        files.sticker[0].buffer,
        files.face[0].buffer,
        {
          outputSize:  parseInt(outputSize)      || 512,
          faceRegionY: parseFloat(faceRegionY)   || 0.08,
          faceRegionH: parseFloat(faceRegionH)   || 0.38,
          faceRegionX: parseFloat(faceRegionX)   || 0.20,
          faceRegionW: parseFloat(faceRegionW)   || 0.60,
        }
      );

      res.status(200).json({
        message:    "Face swap appliqué",
        dataUrl:    result.dataUrl,
        base64:     result.base64,
        width:      result.width,
        height:     result.height,
        provider:   result.provider,
        faceRegion: result.faceRegion,
      });
    } catch (e) {
      console.error("[stickerController.faceSwap]", e);
      res.status(500).json({ error: "Erreur lors du face swap", details: e.message });
    }
  },

  // ── Texte mème sur image ───────────────────────────────────────────────────
  // Entrée  : champ "image" + body { topText, bottomText }
  // Sortie  : JPEG avec texte Impact overlay

  addMemeText: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Champ 'image' requis" });

      const { topText = "", bottomText = "" } = req.body;
      if (!topText && !bottomText) {
        return res.status(400).json({ error: "topText ou bottomText requis" });
      }

      const result = await applyMemeText(req.file.buffer, { topText, bottomText });

      res.status(200).json({
        message:  "Texte mème appliqué",
        dataUrl:  result.dataUrl,
        base64:   result.base64,
        provider: result.provider,
      });
    } catch (e) {
      console.error("[stickerController.addMemeText]", e);
      res.status(500).json({ error: "Erreur lors de l'ajout du texte", details: e.message });
    }
  },
};

module.exports = StickerController;

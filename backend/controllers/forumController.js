const { db, admin } = require("../firebase");

const ForumController = {
  /**
   * Publie officiellement un mème sur le forum
   */
  publishMeme: async (req, res) => {
    try {
      const { shareId, imageUrl, topText, bottomText, sourceMemeId } = req.body;

      if (!db) {
        console.error("[Forum Publish] Database not initialized");
        return res.status(500).json({ error: "Firestore non connecté" });
      }

      if (!shareId || !imageUrl) {
        return res.status(400).json({ error: "Données manquantes (shareId ou imageUrl)" });
      }

      // Protection contre les payloads trop gros (base64)
      if (imageUrl.startsWith("data:") && imageUrl.length > 800000) {
        return res.status(400).json({ error: "L'image est trop volumineuse pour le forum. Utilise l'URL publique." });
      }

      await db.collection("memes").doc(String(shareId)).set({
        shareId: String(shareId),
        imageUrl,
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0,
        remixes: 0,
        createdAt: Date.now(),
      });

      // Si c'est un remix, on prévient le mème d'origine
      if (sourceMemeId && sourceMemeId !== "null" && sourceMemeId !== "undefined") {
        try {
          await db.collection("memes").doc(String(sourceMemeId)).update({
            remixes: admin.firestore.FieldValue.increment(1)
          });
        } catch (e) {
          console.warn("[Forum Publish] Could not update source meme:", sourceMemeId, e.message);
        }
      }

      res.json({ success: true, message: "Mème publié sur le forum !" });
    } catch (e) {
      console.error("[Forum Publish] Unexpected Error:", e);
      res.status(500).json({ error: e.message || "Erreur interne lors de la publication" });
    }
  },

  getMemes: async (req, res) => {
    try {
      if (!db) return res.json([]);
      const { sortBy = "createdAt" } = req.query;

      // Note: orderBy sur un champ nécessite un index si combiné à d'autres filtres,
      // ici c'est un orderBy simple, ça devrait passer si les documents ont le champ.
      const snapshot = await db.collection("memes")
        .orderBy(sortBy, "desc")
        .limit(50)
        .get();

      const memes = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        memes.push({
          id: doc.id,
          ...data,
          likes: data.likes || 0,
          remixes: data.remixes || 0
        });
      });
      res.json(memes);
    } catch (e) {
      console.error("[Forum Get] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  },

  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      if (!db) throw new Error("Firestore non connecté");

      await db.collection("memes").doc(id).update({
        likes: admin.firestore.FieldValue.increment(1)
      });
      res.json({ success: true });
    } catch (e) {
      console.error("[Forum Like] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  }
};

module.exports = ForumController;

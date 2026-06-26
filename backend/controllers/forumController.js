const { db } = require("../firebase");

const ForumController = {
  /**
   * Publie officiellement un mème sur le forum
   */
  publishMeme: async (req, res) => {
    try {
      const { shareId, imageUrl, topText, bottomText, sourceMemeId } = req.body;

      if (!db) throw new Error("Firestore non connecté");
      if (!shareId || !imageUrl) return res.status(400).json({ error: "Données manquantes" });

      await db.collection("memes").doc(shareId).set({
        shareId,
        imageUrl,
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0,
        remixes: 0,
        createdAt: Date.now(),
      });

      // Si c'est un remix, on prévient le mème d'origine
      if (sourceMemeId) {
        const admin = require("firebase-admin");
        try {
          await db.collection("memes").doc(sourceMemeId).update({
            remixes: admin.firestore.FieldValue.increment(1)
          });
        } catch (e) { /* ignore si l'original n'existe plus */ }
      }

      res.json({ success: true, message: "Mème publié sur le forum !" });
    } catch (e) {
      console.error("[Forum Publish] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  },

  getMemes: async (req, res) => {
    try {
      if (!db) return res.json([]);
      const { sortBy = "createdAt" } = req.query;

      const snapshot = await db.collection("memes")
        .orderBy(sortBy, "desc")
        .limit(50)
        .get();

      const memes = [];
      snapshot.forEach(doc => { memes.push({ id: doc.id, ...doc.data() }); });
      res.json(memes);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = require("firebase-admin");
      await db.collection("memes").doc(id).update({
        likes: admin.firestore.FieldValue.increment(1)
      });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};

module.exports = ForumController;

const { db } = require("../firebase");

const ForumController = {
  /**
   * Liste les mèmes publics depuis Firestore
   */
  getMemes: async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: "Base de données non initialisée" });
      }

      const snapshot = await db.collection("memes")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const memes = [];
      snapshot.forEach(doc => {
        memes.push({ id: doc.id, ...doc.data() });
      });

      res.json(memes);
    } catch (e) {
      console.error("[forumController.getMemes]", e);
      res.status(500).json({ error: "Erreur lors de la récupération du forum" });
    }
  },

  /**
   * Like un mème dans Firestore
   */
  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      if (!db) return res.status(500).json({ error: "DB error" });

      const memeRef = db.collection("memes").doc(id);
      const doc = await memeRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Mème introuvable" });
      }

      // Utilisation d'un incrément atomique
      const admin = require("firebase-admin");
      await memeRef.update({
        likes: admin.firestore.FieldValue.increment(1)
      });

      res.json({ id, success: true });
    } catch (e) {
      console.error("[forumController.likeMeme]", e);
      res.status(500).json({ error: "Erreur lors du like" });
    }
  }
};

module.exports = ForumController;

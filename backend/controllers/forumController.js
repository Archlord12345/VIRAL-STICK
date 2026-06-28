const { db, admin } = require("../firebase");
const fs = require("fs");
const path = require("path");

const PERSISTENCE_FILE = path.join(__dirname, "../storage/forum_persistence.json");

// Ensure storage directory exists
if (!fs.existsSync(path.join(__dirname, "../storage"))) {
  fs.mkdirSync(path.join(__dirname, "../storage"), { recursive: true });
}

// Load local memes if they exist
let demoMemes = [];
try {
  if (fs.existsSync(PERSISTENCE_FILE)) {
    const data = fs.readFileSync(PERSISTENCE_FILE, "utf8");
    demoMemes = JSON.parse(data);
    console.log(`[Forum] Persistance locale chargée : ${demoMemes.length} mèmes.`);
  }
} catch (e) {
  console.error("[Forum] Erreur chargement persistance locale:", e.message);
}

function saveLocalPersistence() {
  try {
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(demoMemes, null, 2));
  } catch (e) {
    console.error("[Forum] Erreur sauvegarde persistance locale:", e.message);
  }
}

async function isDbUsable() {
  if (!db) return false;
  try {
    await db.collection("memes").limit(1).get();
    return true;
  } catch (e) {
    return false;
  }
}

const ForumController = {
  /**
   * Publie un mème sur le forum
   */
  publishMeme: async (req, res) => {
    try {
      const { shareId, imageUrl, topText, bottomText, sourceMemeId, userId, username } = req.body;
      const id = String(shareId || Date.now());

      const usable = await isDbUsable();

      const newMeme = {
        id: id,
        shareId: id,
        imageUrl: imageUrl || "https://placehold.co/600x600/1cb0f6/ffffff?text=Image+Missing",
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0,
        remixes: 0,
        createdAt: Date.now(),
        userId: userId || "anon",
        username: username || "Anonyme"
      };

      if (!usable) {
        // Mode persistance locale
        const exists = demoMemes.find(m => m.id === id);
        if (!exists) {
          demoMemes.unshift(newMeme);
          saveLocalPersistence();
        }
        return res.json({ success: true, message: "Publié (Mode Persistance Locale)" });
      }

      await db.collection("memes").doc(id).set({
        shareId: id,
        imageUrl,
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0,
        remixes: 0,
        createdAt: Date.now(),
        userId: userId || null,
        username: username || "Anonyme"
      });

      if (sourceMemeId && sourceMemeId !== "null" && sourceMemeId !== "undefined") {
        try {
          await db.collection("memes").doc(String(sourceMemeId)).update({
            remixes: admin.firestore.FieldValue.increment(1)
          });
        } catch (e) { /* ignore */ }
      }

      res.json({ success: true, message: "Mème publié sur le forum !" });
    } catch (error) {
      console.error("[Forum Publish] Error:", error);
      res.status(500).json({ error: "Erreur lors de la publication" });
    }
  },

  /**
   * Récupère les mèmes du forum
   */
  getMemes: async (req, res) => {
    try {
      const { sortBy = "createdAt", userId } = req.query;
      const usable = await isDbUsable();

      if (!usable) {
        let sorted = [...demoMemes];
        if (sortBy === "likes") sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        else if (sortBy === "remixes") sorted.sort((a, b) => (b.remixes || 0) - (a.remixes || 0));
        else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        return res.json(sorted.map(m => ({ ...m, likedByUser: false })));
      }

      const snapshot = await db.collection("memes").orderBy(sortBy, "desc").limit(50).get();
      const memes = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        let likedByUser = false;
        
        if (userId) {
          const likeDoc = await db.collection("likes").doc(`${userId}_${doc.id}`).get();
          likedByUser = likeDoc.exists;
        }
        
        memes.push({ id: doc.id, ...data, likedByUser });
      }
      res.json(memes);
    } catch (e) {
      console.error("[Forum getMemes] Firestore query failed, falling back to local persistence:", e.message);
      let sorted = [...demoMemes];
      if (sortBy === "likes") sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      else if (sortBy === "remixes") sorted.sort((a, b) => (b.remixes || 0) - (a.remixes || 0));
      else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return res.json(sorted.map(m => ({ ...m, likedByUser: false })));
    }
  },

  /**
   * Système de Like
   */
  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "Connexion requise" });

      const usable = await isDbUsable();
      if (!usable) {
        const meme = demoMemes.find(m => m.id === id);
        if (meme) {
          meme.likes = (meme.likes || 0) + 1;
          saveLocalPersistence();
        }
        return res.json({ success: true, liked: true });
      }

      const likeRef = db.collection("likes").doc(`${userId}_${id}`);
      const memeRef = db.collection("memes").doc(id);

      const result = await db.runTransaction(async (t) => {
        const likeDoc = await t.get(likeRef);
        const memeDoc = await t.get(memeRef);
        if (!memeDoc.exists) throw new Error("Mème introuvable");

        if (likeDoc.exists) {
          t.delete(likeRef);
          t.update(memeRef, { likes: admin.firestore.FieldValue.increment(-1) });
          return { liked: false };
        } else {
          t.set(likeRef, { userId, memeId: id, createdAt: Date.now() });
          t.update(memeRef, { likes: admin.firestore.FieldValue.increment(1) });
          return { liked: true };
        }
      });

      res.json({ success: true, liked: result.liked });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const usable = await isDbUsable();
      let memesSource = [];

      if (!usable) {
        memesSource = demoMemes;
      } else {
        const snapshot = await db.collection("memes").get();
        snapshot.forEach(doc => memesSource.push({ id: doc.id, ...doc.data() }));
      }

      const stats = {};
      memesSource.forEach(data => {
        const uid = data.userId || "anon";
        if (!stats[uid]) {
          stats[uid] = {
            userId: uid,
            username: data.username || "Anonyme",
            totalLikes: 0,
            memesPosted: 0,
            totalRemixes: 0
          };
        }
        stats[uid].totalLikes += (data.likes || 0);
        stats[uid].totalRemixes += (data.remixes || 0);
        stats[uid].memesPosted += 1;
      });

      const leaderboard = Object.values(stats)
        .sort((a, b) => (b.totalLikes + b.totalRemixes) - (a.totalLikes + a.totalRemixes))
        .slice(0, 20);

      res.json(leaderboard);
    } catch (e) {
      res.status(500).json({ error: "Erreur leaderboard" });
    }
  }
};

module.exports = ForumController;

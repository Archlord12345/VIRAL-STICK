
console.log("Test minimal...");
try {
  require("./loadEnv")();
  console.log("✅ loadEnv ok");
  
  const Firebase = require("./firebase");
  console.log("✅ Firebase imported ok");
  
  const ForumController = require("./controllers/forumController");
  console.log("✅ ForumController imported ok");
  
  // Maintenant testons juste isDbUsable:
  const isDbUsable = async () => {
    const db = Firebase.db;
    console.log("db:", db ? "ok" : "null");
    return false;
  }

  console.log("\n✅ Tous les imports OK !");
} catch (e) {
  console.error("Erreur:", e);
}

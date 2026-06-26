const admin = require("firebase-admin");

let db;

try {
  if (!admin.apps.length) {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "viral-stick-4320c.firebasestorage.app"
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: "viral-stick-4320c.firebasestorage.app"
      });
    }
  }
  db = admin.firestore();
  console.log("[Firebase] Firestore & Storage initialisés");
} catch (error) {
  console.error("[Firebase] Erreur d'initialisation:", error.message);
}

module.exports = { db, admin };

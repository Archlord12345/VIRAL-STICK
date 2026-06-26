const express = require("express");
<<<<<<< HEAD
const multer = require("multer");
const router = express.Router();
const MemeController = require("../controllers/memeController");

// Upload en mémoire (pas de stockage disque) — limite 15 Mo, conforme au
// contrat d'API qui attend un champ "audio" en multipart/form-data.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post("/generate-from-text", MemeController.createFromText);
// Alias conforme au contrat d'API (docs/contrat-api.md) : POST /api/context-reader
router.post("/context-reader", MemeController.createFromText);
router.post("/voice-to-meme", upload.single("audio"), MemeController.createFromVoice);
=======
const router = express.Router();
const MemeController = require("../controllers/memeController");

router.post("/generate-from-text", MemeController.createFromText);
router.post("/voice-to-meme", MemeController.createFromVoice);
>>>>>>> 9a71b9ba62fd2eb4616a0c864cc0b21c7a0ed075
router.post("/chat", MemeController.chat);
router.post("/chat/greeting", MemeController.getGreeting);
router.post("/generate-image", MemeController.generateImage);
router.post("/status-remixer", MemeController.statusRemixer);

module.exports = router;

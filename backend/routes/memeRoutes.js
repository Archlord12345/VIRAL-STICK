const express = require('express');
const router = express.Router();
const MemeController = require('../controllers/memeController');

router.post('/generate-from-text', MemeController.createFromText);

module.exports = router;

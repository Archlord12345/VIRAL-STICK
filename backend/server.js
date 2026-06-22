const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/memes', require('./routes/memeRoutes'));
app.use('/api/context-reader', require('./routes/contextReader'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Route 404 generique pour les endpoints inconnus
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint introuvable' });
});

// Gestionnaire d'erreurs centralise — garantit du JSON, jamais de page HTML
// (utile pour Multer notamment : Voice-to-Meme et Status Remixer en dependent)
app.use((err, req, res, next) => {
  console.error('[errorHandler]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux.' });
  }
  if (err.message && err.message.includes('non supporte')) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur Viral Stick en écoute sur le port ${PORT}`);
});
const AIService = require('../services-ia/aiService');

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Texte requis' });
      }
      
      const memeData = await AIService.generateMemeFromText(text);
      res.status(200).json({ 
        message: 'Mème généré avec succès',
        ...memeData
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la génération' });
    }
  }
};

module.exports = MemeController;

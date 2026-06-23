import { Alert } from 'react-native';

// Remplacez par l'IP locale de votre machine de développement backend
// Note : Ne pas utiliser localhost sur un émulateur Android (utilisez 10.0.2.2 ou votre IP WiFi)
const BASE_URL = 'http://10.2.2'; 

export const apiService = {
  /**
   * Envoie une image au backend pour générer des propositions de mèmes
   * @param {string} imageUri - Le chemin local de l'image sur le téléphone
   * @returns {Promise<string[]>} - Tableau de 3 punchlines humoristiques
   */
  analyzeImageForMeme: async (imageUri) => {
    try {
      const formData = new FormData();
      
      // Configuration du fichier pour l'upload via le middleware Multer du backend
      formData.append('image', {
        uri: imageUri,
        name: 'status_remix.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${BASE_URL}/status-remixer/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de contacter le serveur de forge.');
      }

      const data = await response.json();
      // Le backend doit renvoyer un objet contenant le tableau de suggestions
      return data.punchlines || []; 
      
    } catch (error) {
      //console.error("Erreur API StatusRemixer:", error);
      //Alert.alert("Erreur Connexion", "Impossible de joindre le serveur KERNEL FORGE.");
      //return [];
       console.log("Avis technique : Le backend n'est pas encore relié.");
      return null;
    }
  }
};

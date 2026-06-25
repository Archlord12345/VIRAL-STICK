import ShareMenu from 'react-native-share-menu';

export const shareIntentService = {
  /**
   * Initialise l'écouteur de partage entrant et nettoie les données reçues
   * @param {Function} callback - Fonction de traitement qui reçoit l'URI propre
   */
  listenForSharedContent: (callback) => {
    
    // Fonction interne pour valider et formater l'URI reçue d'Android
    const handleIncomingData = (sharedData) => {
      if (!sharedData || !sharedData.data) return;

      const { mimeType, data } = sharedData;

      // Si c'est une image provenant de WhatsApp ou de la Galerie
      if (mimeType && mimeType.startsWith('image/')) {
        let cleanUri = data;

        // Sécurité technique : Si l'URI reçue est un tableau (cas de certains partages multiples)
        if (Array.isArray(data)) {
          cleanUri = data[0];
        }

        // Renvoie l'URI formatée proprement à l'application
        callback({
          mimeType: 'image/jpeg', // Standardisation du flux
          data: cleanUri
        });
        
      } else if (mimeType === 'text/plain') {
        // Traitement sécurisé des extraits de texte/discussions collés
        callback({
          mimeType: 'text/plain',
          data: String(data).trim()
        });
      }
    };

    // 1. Capture du partage "à froid" (L'application était complètement fermée)
    ShareMenu.getInitialShare((sharedData) => {
      if (sharedData) {
        handleIncomingData(sharedData);
      }
    });

    // 2. Écoute du partage "à chaud" (L'application tournait déjà en arrière-plan)
    const listener = ShareMenu.addNewShareListener((sharedData) => {
      if (sharedData) {
        handleIncomingData(sharedData);
      }
    });

    // Renvoie la fonction de nettoyage indispensable pour le useEffect d'App.js
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }
};


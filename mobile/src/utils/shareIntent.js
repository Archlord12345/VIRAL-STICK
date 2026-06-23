import ShareMenu from 'react-native-share-menu';

export const shareIntentService = {
  /**
   * Initialise l'écouteur de partage entrant
   * @param {Function} callback - Fonction appelée lorsqu'un média est partagé vers l'application
   */
  listenForSharedContent: (callback) => {
    // 1. Vérifier si l'application a été ouverte via un partage (A froid)
    ShareMenu.getInitialShare((sharedData) => {
      if (sharedData && sharedData.data) {
        callback(sharedData);
      }
    });

    // 2. Écouter les partages entrants lorsque l'application est déjà en arrière-plan (A chaud)
    const listener = ShareMenu.addNewShareListener((sharedData) => {
      if (sharedData && sharedData.data) {
        callback(sharedData);
      }
    });

    // Retourne la fonction de nettoyage pour le useEffect
    return () => {
      listener.remove();
    };
  }
};

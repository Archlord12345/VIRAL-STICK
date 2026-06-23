import React, { useEffect, useRef } from 'react';
import { LogBox, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { shareIntentService } from './src/utils/shareIntent';

LogBox.ignoreLogs(['`new NativeEventEmitter()` was called with a non-null argument']);

export default function App() {
  // Référence pour interagir avec le routeur de navigation
  const navigationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = shareIntentService.listenForSharedContent((sharedData) => {
      const { mimeType, data } = sharedData;

      if (mimeType.startsWith('image/')) {
        Alert.alert(
          "Média Reçu 🖼️", 
          "Image détectée depuis le partage externe ! Envoi vers le Status Remixer...",
          [
            {
              text: "OK",
              onPress: () => {
                // Redirection automatique vers l'écran StatusRemixer avec l'image en paramètre
                if (navigationRef.current) {
                  navigationRef.current.navigate('StatusRemixer', { sharedImageUri: data });
                }
              }
            }
          ]
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      {/* On attache la référence de navigation ici */}
      <AppNavigator navigationRef={navigationRef} />
    </SafeAreaProvider>
  );
}




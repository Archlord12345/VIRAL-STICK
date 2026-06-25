/**
 * Viral Stick — Application Entry Point
 * KERNEL FORGE — 2026
 */

import React, { useState, useEffect } from "react";
import { View, Text, LogBox, Alert } from "react-native";
import { ThemeProvider } from "./src/theme";
import RootNavigator from "./src/navigation/RootNavigator"; 
import SplashScreen from "./src/components/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { shareIntentService } from "./src/utils/shareIntent"; 

LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument',
]);

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Erreur inconnue" };
  }

  componentDidCatch(error) {
    console.error("[Mobile App Crash]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#0D0D0D",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginBottom: 12 }}>
            Erreur au lancement
          </Text>
          <Text style={{ color: "#A0A0B0", textAlign: "center" }}>
            {this.state.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // 📐 États de routage personnalisés partagés pour le Share Intent
  const [sharedImage, setSharedImage] = useState(null);
  const [forceTriggerScreen, setForceTriggerScreen] = useState(null);

  useEffect(() => {
    if (showSplash || showOnboarding) return;

    // Initialisation du capteur de partage du Jour 3
    const unsubscribe = shareIntentService.listenForSharedContent((sharedData) => {
      const { mimeType, data } = sharedData;

      if (mimeType && mimeType.startsWith('image/')) {
        let targetUri = Array.isArray(data) ? data : data;
        
        if (typeof targetUri === 'string' && !targetUri.startsWith('file://') && !targetUri.startsWith('content://')) {
          targetUri = 'file://' + targetUri;
        }

        Alert.alert(
          "Média Reçu 🖼️", 
          "Image détectée depuis le partage externe ! Chargement de l'éditeur...",
          [
            {
              text: "OK",
              onPress: () => {
                // On injecte la photo dans les états globaux de l'application
                setSharedImage(targetUri);
                // On ordonne de basculer immédiatement sur l'écran d'édition
                setForceTriggerScreen("StatusRemixer");
              }
            }
          ]
        );
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showSplash, showOnboarding]);

  return (
    <AppErrorBoundary>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : showOnboarding ? (
        <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
      ) : (
        <ThemeProvider>
          {/* On injecte les variables de partage dans votre RootNavigator */}
          <RootNavigator 
            sharedImageUri={sharedImage} 
            initialScreen={forceTriggerScreen}
            clearSharedImage={() => {
              setSharedImage(null);
              setForceTriggerScreen(null);
            }}
          />
        </ThemeProvider>
      )}
    </AppErrorBoundary>
  );
};

export default App;

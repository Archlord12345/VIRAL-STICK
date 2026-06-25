/**
 * RootNavigator — Application root with screen rendering
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DrawerNavigator from "./DrawerNavigator";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ContextReaderScreen from "../screens/ContextReaderScreen";
import VoiceToMemeScreen from "../screens/VoiceToMemeScreen";
import StatusRemixerScreen from "../screens/StatusRemixerScreen";
import CompanionChatScreen from "../screens/CompanionChatScreen";
import MultiChatScreen from "../screens/MultiChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";

const SCREENS = {
  Home: HomeScreen,
  ContextReader: ContextReaderScreen,
  VoiceToMeme: VoiceToMemeScreen,
  StatusRemixer: StatusRemixerScreen,
  CompanionChat: CompanionChatScreen,
  MultiChat: MultiChatScreen,
  Settings: SettingsScreen,
  About: AboutScreen,
};

// On intercepte les arguments de partage envoyés depuis App.js
const RootNavigator = ({ sharedImageUri, initialScreen, clearSharedImage }) => {
  const [currentScreen, setCurrentScreen] = useState("Home");

  // Si App.js demande un changement d'écran suite à un partage de la galerie
  useEffect(() => {
    if (initialScreen) {
      setCurrentScreen(initialScreen);
    }
  }, [initialScreen]);

  const Screen = SCREENS[currentScreen] || HomeScreen;

  return (
    <DrawerNavigator
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* On passe l'URI de l'image de partage directement aux propriétés de l'écran */}
        <Screen 
          navigate={setCurrentScreen} 
          sharedImageFromIntent={currentScreen === "StatusRemixer" ? sharedImageUri : null}
          clearSharedImage={clearSharedImage}
        />
      </View>
    </DrawerNavigator>
  );
};

export default RootNavigator;

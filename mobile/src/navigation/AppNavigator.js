import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import StatusRemixerScreen from '../screens/StatusRemixerScreen';
import ContextReaderScreen from '../screens/ContextReaderScreen';
import VoiceToMemeScreen from '../screens/VoiceToMemeScreen';
import { theme } from '../theme/theme';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          drawerStyle: { backgroundColor: theme.colors.surface, width: 260 },
          drawerActiveTintColor: theme.colors.accent,
          drawerInactiveTintColor: theme.colors.textMuted,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: '🏠 Accueil' }} />
        <Drawer.Screen name="ContextReader" component={ContextReaderScreen} options={{ title: '📝 Context Reader' }} />
        <Drawer.Screen name="VoiceToMeme" component={VoiceToMemeScreen} options={{ title: '🎙️ Voice-To-Meme' }} />
        <Drawer.Screen name="StatusRemixer" component={StatusRemixerScreen} options={{ title: '🖼️ Status Remixer' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIRAL STICK 🚀</Text>
      <Text style={styles.subtitle}>Générateur de Mèmes Multimodal</Text>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ContextReader')}>
          <Text style={styles.buttonText}>📝 Context Reader</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VoiceToMeme')}>
          <Text style={styles.buttonText}>🎙️ Voice-To-Meme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StatusRemixer')}>
          <Text style={styles.buttonText}>🖼️ Status Remixer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.companionBox}>
        <Text style={styles.companionText}>💬 Archy : "Bienvenue dans la Forge ! Choisis un outil pour commencer."</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.accent, textAlign: 'center' },
  subtitle: { fontSize: 16, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 40 },
  menu: { gap: 15 },
  button: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.primary },
  buttonText: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  companionBox: { marginTop: 40, padding: 15, backgroundColor: '#29292e', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.textMuted },
  companionText: { color: theme.colors.text, fontStyle: 'italic' }
});

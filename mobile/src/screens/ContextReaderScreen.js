import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../theme/theme';

export default function ContextReaderScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMemeText, setGeneratedMemeText] = useState('');

  const handleAnalyzeText = () => {
    if (!inputText.trim()) {
      Alert.alert("Champ vide 📝", "S'il te plaît, colle ou saisis un extrait de discussion.");
      return;
    }

    setIsLoading(true);
    setGeneratedMemeText('');

    // Simulation de l'appel API J3 (En attendant le branchement de Backend Dev 1)
    setTimeout(() => {
      setIsLoading(false);
      // Exemple avec de l'argot et des expressions camerounaises (Localisation culturelle)
      setGeneratedMemeText("POV: Quand on te dit 'On est ensemble' mais que l'argent du taxi est fini 💀");
      Alert.alert("Analyse Terminée ✨", "Vira a extrait le contexte avec succès !");
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>📝 CONTEXT READER</Text>
      <Text style={styles.subtitle}>Colle un extrait de chat pour que l'IA détecte l'ambiance et crée la punchline</Text>

      {/* Zone de saisie textuelle */}
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={6}
        placeholder="Ex: - Tu es où ? \n- Je gère un truc à l'UY1 là, pardon ne me dérange pas..."
        placeholderTextColor={theme.colors.textMuted}
        value={inputText}
        onChangeText={setInputText}
      />

      {/* Bouton d'action */}
      <TouchableOpacity style={styles.actionButton} onPress={handleAnalyzeText} activeOpacity={0.8}>
        <Text style={styles.buttonText}>🔥 Forger le Mème Texte</Text>
      </TouchableOpacity>

      {/* Chargement */}
      {isLoading && <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 20 }} />}

      {/* Résultat de l'IA */}
      {generatedMemeText !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTag}>MÈME TEXTE GÉNÉRÉ :</Text>
          <Text style={styles.resultText}>{generatedMemeText}</Text>
        </View>
      )}

      {/* Compagnon Vira */}
      <View style={styles.companionBox}>
        <Text style={styles.companionText}>
          💬 Vira : "Balance-moi tes screens ou tes discussions croustillantes. Je vais te transformer ce bavardage en un mème ultra-viral !"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.accent, marginVertical: 5 },
  subtitle: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 25 },
  textInput: { width: '100%', backgroundColor: theme.colors.surface, color: '#fff', borderRadius: 14, padding: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: '#2d2d30', fontSize: 14, marginBottom: 20 },
  actionButton: { width: '100%', backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', elevation: 2 },
  buttonText: { color: theme.colors.text, fontWeight: 'bold', fontSize: 15 },
  resultBox: { width: '100%', backgroundColor: '#1a241d', padding: 20, borderRadius: 14, marginTop: 25, borderWidth: 1, borderColor: theme.colors.accent },
  resultTag: { color: theme.colors.accent, fontSize: 11, fontWeight: 'bold', marginBottom: 6 },
  resultText: { color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 22 },
  companionBox: { marginTop: 35, padding: 15, backgroundColor: '#16161a', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: theme.colors.accent, width: '100%' },
  companionText: { color: theme.colors.text, fontStyle: 'italic', fontSize: 13, lineHeight: 18 }
});


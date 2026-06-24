import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../theme/theme';

export default function VoiceToMemeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [memePunchline, setMemePunchline] = useState('');

  const handleRecordToggle = () => {
    if (!isRecording) {
      // Démarrer l'enregistrement simulé
      setIsRecording(true);
      setTranscription('');
      setMemePunchline('');
    } else {
      // Arrêter et lancer l'analyse
      setIsRecording(false);
      setIsLoading(true);

      // Simulation du traitement STT + IA (En attendant Dev Audio et Backend Dev 1)
      setTimeout(() => {
        setIsLoading(false);
        setTranscription("« Masse d'un coup le gars me dit que le serveur est down »");
        setMemePunchline("Quand le projet doit être rendu à 23h59... 😂😭");
      }, 2000);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🎙️ VOICE TO MEME</Text>
      <Text style={styles.subtitle}>Enregistre un vocal en direct pour générer un mème audio sous-titré</Text>

      {/* Zone du Micro de Capture Visuel */}
      <View style={styles.recordContainer}>
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordButtonActive]} 
          onPress={handleRecordToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>
        <Text style={styles.recordStatus}>
          {isRecording ? "Enregistrement en cours... (Clique pour arrêter)" : "Appuie sur le micro pour parler"}
        </Text>
      </View>

      {/* Chargement */}
      {isLoading && <ActivityIndicator size="large" color='#ff9800' style={{ marginTop: 20 }} />}

      {/* Résultats d'Analyse (Transcription + Mème) */}
      {!isLoading && transcription !== '' && (
        <View style={styles.resultsSection}>
          <View style={styles.dataCard}>
            <Text style={[styles.cardTag, { color: '#ff9800' }]}>TRANSCRIPTION (STT) :</Text>
            <Text style={styles.cardText}>{transcription}</Text>
          </View>

          <View style={[styles.dataCard, { borderColor: theme.colors.primary }]}>
            <Text style={[styles.cardTag, { color: theme.colors.primary }]}>SOUS-TITRE HUMOUR IA :</Text>
            <Text style={[styles.cardText, { fontWeight: '900', color: theme.colors.accent }]}>
              {memePunchline.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {/* Compagnon Vox */}
      <View style={styles.companionBox}>
        <Text style={styles.companionText}>
          💬 Vox : "Parle-moi face à face ! Mon moteur audio capte ton émotion, transcrit tes mots et te sort le sous-titre parfait !"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ff9800', marginVertical: 5 },
  subtitle: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 35 },
  recordContainer: { alignItems: 'center', marginVertical: 10, width: '100%' },
  recordButton: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 152, 0, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ff9800', marginBottom: 15, elevation: 4 },
  recordButtonActive: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  micIcon: { fontSize: 36, color: '#fff' },
  recordStatus: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '500' },
  resultsSection: { width: '100%', gap: 15, marginTop: 25 },
  dataCard: { width: '100%', backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#2d2d30' },
  cardTag: { fontSize: 10, fontWeight: 'bold', marginBottom: 6, letterSpacing: 0.5 },
  cardText: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 20 },
  companionBox: { marginTop: 35, padding: 15, backgroundColor: '#16161a', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#ff9800', width: '100%' },
  companionText: { color: theme.colors.text, fontStyle: 'italic', fontSize: 13, lineHeight: 18 }
});



import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { theme } from '../theme/theme';

export default function StatusRemixerScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Simulation des propositions reçues par l'IA pour le Jour 2
  const [aiPunchlines, setAiPunchlines] = useState([
    "Quand le code compile du premier coup à l'UY1 🤯",
    "Tu veux l'argent de quoi ? C'est le mbeng ? 🇨🇲",
    "POV: Quand le prof d'ICT202 prolonge le TP d'une semaine"
  ]);
  const [selectedPunchline, setSelectedPunchline] = useState("");

  const handleSelectFromGallery = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) return;
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const handleLaunchCamera = () => {
    const options = { mediaType: 'photo', quality: 1, saveToPhotos: true };
    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) return;
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedPunchline("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🖼️ STATUS REMIXER</Text>
      <Text style={styles.subtitle}>Importe une image pour que l'IA la transforme en mème viral</Text>

      {/* Zone de prévisualisation avec texte superposé (Calque de mème) */}
      <View style={styles.imagePreviewContainer}>
        {selectedImage ? (
          <View style={styles.memeContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            {selectedPunchline !== "" && (
              <View style={styles.textOverlayContainer}>
                <Text style={styles.memeText}>{selectedPunchline.toUpperCase()}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Aucune image sélectionnée</Text>
          </View>
        )}
      </View>

      {/* Boutons de sélection */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSelectFromGallery}>
          <Text style={styles.buttonText}>📂 Galerie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={handleLaunchCamera}>
          <Text style={styles.buttonText}>📸 Appareil Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Zone des propositions de l'IA (Visible uniquement si une image est chargée) */}
      {selectedImage && (
        <View style={styles.punchlineSection}>
          <Text style={styles.sectionTitle}>✨ Propositions de l'IA (Humour Local) :</Text>
          {aiPunchlines.map((punchline, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.punchlineCard, 
                selectedPunchline === punchline && styles.punchlineCardSelected
              ]}
              onPress={() => setSelectedPunchline(punchline)}
            >
              <Text style={styles.punchlineText}>{punchline}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedImage && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Retirer l'image</Text>
        </TouchableOpacity>
      )}

      {/* Compagnon Mixy */}
      <View style={styles.companionBox}>
        <Text style={styles.companionText}>
          💬 Mixy : "Clique sur une de mes punchlines en bas pour l'incruster sur ton image comme un vrai chef-d'œuvre !"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: theme.colors.accent, marginVertical: 10 },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 25 },
  imagePreviewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  memeContainer: { width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', position: 'absolute', resizeMode: 'cover' },
  textOverlayContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  memeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  placeholderContainer: { padding: 20 },
  placeholderText: { color: theme.colors.textMuted, fontSize: 16, fontStyle: 'italic' },
  buttonGroup: { flexDirection: 'row', gap: 10, width: '100%', justifyContent: 'space-between' },
  actionButton: { flex: 1, backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  cameraButton: { backgroundColor: '#34495e' },
  buttonText: { color: theme.colors.text, fontWeight: 'bold', fontSize: 14 },
  punchlineSection: { width: '100%', marginTop: 25, alignment: 'left' },
  sectionTitle: { color: theme.colors.accent, fontWeight: 'bold', marginBottom: 10, fontSize: 15 },
  punchlineCard: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  punchlineCardSelected: { borderColor: theme.colors.accent, backgroundColor: '#1f2d24' },
  punchlineText: { color: theme.colors.text, fontSize: 14 },
  resetButton: { marginTop: 15, padding: 10 },
  resetButtonText: { color: '#ff5252', fontWeight: 'bold' },
  companionBox: { marginTop: 35, padding: 15, backgroundColor: '#1c1c1e', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: theme.colors.accent, width: '100%' },
  companionText: { color: theme.colors.text, fontStyle: 'italic', fontSize: 13, lineHeight: 18 }
});

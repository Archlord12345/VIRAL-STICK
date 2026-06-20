import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

/**
 * HomeScreen - Point d'entrée de l'application mobile.
 * Permet d'accéder aux 3 modules principaux : Context Reader, Voice-to-Meme, et Status Remixer.
 * 
 * Responsable principal : Mobile Dev 2 (MD2)
 */
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Viral Stick 🚀</Text>
        <Text style={styles.subtitle}>Générateur de Mèmes Multimodal</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('ContextReader')}
        >
          <Text style={styles.cardEmoji}>📝</Text>
          <Text style={styles.cardTitle}>Context Reader</Text>
          <Text style={styles.cardDesc}>Colle une discussion $\rightarrow$ mème généré</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('VoiceToMeme')}
        >
          <Text style={styles.cardEmoji}>🎙️</Text>
          <Text style={styles.cardTitle}>Voice-to-Meme</Text>
          <Text style={styles.cardDesc}>Enregistre une note vocale $\rightarrow$ mème audio/texte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('StatusRemixer')}
        >
          <Text style={styles.cardEmoji}>🖼️</Text>
          <Text style={styles.cardTitle}>Status Remixer</Text>
          <Text style={styles.cardDesc}>Importe une image $\rightarrow$ mème personnalisé</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginTop: 8,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  }
});

export default HomeScreen;

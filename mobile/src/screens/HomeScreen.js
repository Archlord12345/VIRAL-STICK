import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [meme, setMeme] = useState(null);

  const generateMeme = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/memes/generate-from-text', { text });
      setMeme(response.data);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        value={text} 
        onChangeText={setText} 
        placeholder="Entrez un contexte..."
      />
      <Button title="Générer Mème" onPress={generateMeme} />
      {meme && <Text>{JSON.stringify(meme)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 }
});

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

const ForumScreen = ({ navigate }) => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const res = await fetch('https://viral-stick.vercel.app/api/forum/memes');
      const data = await res.json();
      setMemes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await fetch(`https://viral-stick.vercel.app/api/forum/like/${id}`, { method: 'POST' });
      setMemes(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
    } catch (e) {
      console.error(e);
    }
  };

  const renderMeme = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>{item.likes} ❤️</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.btnText}>Liker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.remixBtn}
            onPress={() => navigate('StatusRemixer', { imageUrl: item.imageUrl, text: `${item.topText} ${item.bottomText}` })}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Remixer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.duoGreen} /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aucun mème partagé.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  card: {
    backgroundColor: '#fff', borderRadius: radius.xl, marginBottom: 20,
    borderWidth: 2, borderColor: colors.cloudGray, overflow: 'hidden'
  },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: 16 },
  likesContainer: { marginBottom: 12 },
  likesText: { fontWeight: '900', fontSize: 18, color: colors.duoGreen },
  actions: { flexDirection: 'row', gap: 10 },
  likeBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.cloudGray,
    justifyContent: 'center', alignItems: 'center'
  },
  remixBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    backgroundColor: colors.duoBlue,
    justifyContent: 'center', alignItems: 'center'
  },
  btnText: { fontWeight: '800', color: colors.charcoal },
  empty: { textAlign: 'center', marginTop: 40, color: colors.silver, fontWeight: '700' }
});

export default ForumScreen;

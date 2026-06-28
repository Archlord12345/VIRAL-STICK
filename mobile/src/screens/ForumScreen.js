import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { apiUrl } from '../config/api';
import { shareToWhatsApp, downloadImageToGallery } from '../utils/shareUtils';
import { useTheme } from '../theme';
import authService from '../services/authService';

const TABS = [
  { id: 'createdAt', label: 'Récents', icon: '🕒' },
  { id: 'likes',     label: 'Populaires', icon: '🔥' },
  { id: 'remixes',   label: 'Viraux', icon: '🔄' },
];

const ForumScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [userId, setUserId] = useState(null);

  const fetchMemes = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const id = await authService.getUserId();
      setUserId(id);

      const params = new URLSearchParams({ sortBy });
      if (id) params.append('userId', id);

      const res = await fetch(apiUrl(`/api/forum/memes?${params.toString()}`));
      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[ForumScreen] Error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMemes(true);
  };

  const handleLike = async (id) => {
    if (!userId) {
      Alert.alert('Connexion requise', 'Connecte-toi pour liker !');
      navigate('Auth');
      return;
    }
    try {
      const res = await fetch(apiUrl(`/api/forum/like/${id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const result = await res.json();
        setMemes(prev => prev.map(m => 
          m.id === id 
            ? { ...m, likes: result.liked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 0) - 1), likedByUser: result.liked }
            : m
        ));
      }
    } catch (e) { console.error(e); }
  };

  const renderMeme = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>❤️ {item.likes || 0}</Text>
          <Text style={[styles.statValue, { color: colors.skyBlue }]}>🔄 {item.remixes || 0}</Text>
          <Text style={[styles.author, { color: theme.textMuted }]}>par {item.username || 'IA'}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, { borderColor: theme.border }, item.likedByUser && { backgroundColor: theme.primary }]} onPress={() => handleLike(item.id)}>
            <Text style={{ color: item.likedByUser ? '#fff' : theme.textPrimary, fontWeight: '800' }}>{item.likedByUser ? '❤️ Liké' : '🤍 Liker'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={() => shareToWhatsApp(item.imageUrl)}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>📱 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={async () => {
            try {
              await downloadImageToGallery(item.imageUrl);
              Alert.alert('Succès', 'Image sauvegardée dans votre galerie !');
            } catch (e) {
              Alert.alert('Erreur', "Impossible de télécharger l'image.");
            }
          }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>📥</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.id} onPress={() => setSortBy(tab.id)} style={[styles.tab, sortBy === tab.id && { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.tabText, sortBy === tab.id && { color: theme.primary }]}>{tab.icon} {tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={theme.primary} size="large" /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.textMuted }]}>Le forum attend tes premières créations !</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, gap: 10 },
  tab: { flex: 1, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)' },
  tabText: { fontWeight: '800', fontSize: 12 },
  list: { padding: 15 },
  card: { borderRadius: 20, marginBottom: 20, borderWidth: 1, overflow: 'hidden' },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: 15 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 12, alignItems: 'center' },
  statValue: { fontWeight: '900', fontSize: 16 },
  author: { flex: 1, textAlign: 'right', fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, fontWeight: '700' }
});

export default ForumScreen;

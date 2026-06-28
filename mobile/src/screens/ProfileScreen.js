import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useTheme, spacing, radius } from '../theme';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import CompanionAvatar from '../components/CompanionAvatar';
import { apiUrl } from '../config/api';
import axios from 'axios';
import authService from '../services/authService';

const ProfileScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ memes: 0, likes: 0, remixes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // 1. Récupérer les infos de session réelles
      const session = await authService.getSession();
      const currentUserId = session?.userId || 'guest';
      const currentUserEmail = session?.email || 'invité@viralstick.com';

      // 2. Charger les stats du leaderboard depuis le backend
      const res = await axios.get(apiUrl('/api/forum/leaderboard'));
      const leaderboard = res.data;
      
      // Trouver les stats de l'utilisateur actuel
      const userStats = leaderboard.find(u => u.userId === currentUserId);
      
      if (userStats) {
        setStats({
          memes: userStats.memesPosted || 0,
          likes: userStats.totalLikes || 0,
          remixes: userStats.totalRemixes || 0
        });
      }

      setUser({
        username: userStats?.username || currentUserId.split('_')[1]?.toUpperCase() || 'Utilisateur Viral',
        email: currentUserEmail,
        joinedAt: session?.timestamp ? new Date(session.timestamp).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
        avatar: session?.avatar || 'arch'
      });

    } catch (error) {
      console.error('Erreur chargement profil:', error);
      // Fallback si erreur serveur
      const session = await authService.getSession();
      setUser({
        username: 'Utilisateur',
        email: session?.email || 'non connecté',
        joinedAt: '---',
        avatar: 'arch'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const success = await authService.logout();
    if (success) {
      navigate('Auth');
    } else {
      Alert.alert("Erreur", "Impossible de se déconnecter proprement.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>MON COMPTE VÉRIFIÉ</Text>
          </View>
          <View style={styles.avatarSection}>
            <CompanionAvatar companion={user?.avatar || 'arch'} size={96} floating showRing={true} />
          </View>
          <Text style={[styles.username, { color: theme.textPrimary }]}>{user?.username}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
          <Text style={[styles.joined, { color: theme.textMuted }]}>Propulsé par Kernel Forge • {user?.joinedAt}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>📊 Performances Virales</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{stats.memes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Créations</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.success }]}>{stats.likes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Impact</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.secondary }]}>{stats.remixes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Remixes</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <AnimatedButton
            title="Rafraîchir les stats"
            onPress={loadProfile}
            variant="ghost"
            size="sm"
            style={{ marginBottom: spacing.sm }}
          />
          <AnimatedButton
            title="🚪 Déconnexion sécurisée"
            onPress={handleLogout}
            size="lg"
            style={{ backgroundColor: theme.danger + '22', borderColor: theme.danger }}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.md },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginBottom: spacing.md },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  avatarSection: { marginBottom: spacing.md },
  username: { fontSize: 24, fontWeight: '900', marginBottom: spacing.xs, textAlign: 'center' },
  email: { fontSize: 14, marginBottom: spacing.xs, opacity: 0.7 },
  joined: { fontSize: 12, fontStyle: 'italic' },
  card: { padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: spacing.md, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  actions: { marginTop: spacing.md },
});

export default ProfileScreen;

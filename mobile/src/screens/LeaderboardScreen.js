import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors, radius, spacing } from "../theme/tokens";
import axios from "axios";
import { apiUrl } from "../config/api";

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl("/api/forum/leaderboard"));
      setLeaderboard(response.data);
      setError(null);
    } catch (e) {
      setError("Impossible de charger le classement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankColor = (index) => {
    if (index === 0) return colors.duoGreen;
    if (index === 1) return "#FFD700";
    if (index === 2) return "#CD7F32";
    return colors.cloudGray;
  };

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.duoGreen} />
        <Text style={styles.loadingText}>Calcul des scores...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Le Panthéon des créateurs viraux</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchLeaderboard} style={styles.retryBtn}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.list}>
          {leaderboard.map((user, index) => (
            <View
              key={user.userId}
              style={[
                styles.item,
                { borderLeftWidth: 6, borderLeftColor: getRankColor(index) }
              ]}
            >
              <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) }]}>
                <Text style={[styles.rankText, index < 3 ? { color: "#fff" } : { color: colors.charcoal }]}>
                  {getRankEmoji(index)}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.memesPosted}>{user.memesPosted} mèmes créés</Text>
              </View>

              <View style={styles.statsColumn}>
                <View style={styles.statChip}>
                  <Text style={styles.statValue}>{user.totalLikes}</Text>
                  <Text style={styles.statLabel}>❤️</Text>
                </View>
                <View style={[styles.statChip, { backgroundColor: colors.duoBlueLight }]}>
                  <Text style={[styles.statValue, { color: colors.duoBlueDark }]}>{user.totalRemixes}</Text>
                  <Text style={styles.statLabel}>🔄</Text>
                </View>
              </View>
            </View>
          ))}

          {leaderboard.length === 0 && (
            <Text style={styles.emptyText}>Aucun créateur classé pour le moment.</Text>
          )}
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: "900", color: colors.almostBlack },
  subtitle: { fontSize: 16, color: colors.graphite, marginTop: 4 },
  loadingText: { marginTop: 12, fontWeight: '700', color: colors.silver },
  list: { gap: 12 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.cloudGray,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05
  },
  rankBadge: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center"
  },
  rankText: { fontSize: 20, fontWeight: "900" },
  userInfo: { flex: 1, marginLeft: 16 },
  username: { fontSize: 18, fontWeight: "800", color: colors.almostBlack },
  memesPosted: { fontSize: 12, color: colors.silver, fontWeight: '600' },
  statsColumn: { gap: 4 },
  statChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.duoGreenLight, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.sm, minWidth: 50
  },
  statValue: { fontSize: 14, fontWeight: "900", color: colors.duoGreenDark, marginRight: 4 },
  statLabel: { fontSize: 10 },
  errorBox: { alignItems: 'center', marginTop: 40 },
  errorText: { color: colors.danger, fontWeight: '700' },
  retryBtn: { marginTop: 16, padding: 12, backgroundColor: colors.duoBlue, borderRadius: radius.md },
  retryText: { color: '#fff', fontWeight: '800' },
  emptyText: { textAlign: 'center', color: colors.silver, marginTop: 40, fontWeight: '700' }
});

export default LeaderboardScreen;

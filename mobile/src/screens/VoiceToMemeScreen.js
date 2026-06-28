import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar, Platform } from "react-native";
import Voice from '@react-native-community/voice';
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import { memeDB } from "../services/database";
import authService from "../services/authService";

const WaveBar = ({ index, active }) => {
  const { theme } = useTheme();
  const anim = useRef(new Animated.Value(0.25)).current;
  useEffect(() => {
    if (active) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.55 + (index % 5) * 0.08, duration: 200 + index * 15, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.2, duration: 230, useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    } else {
      Animated.timing(anim, { toValue: 0.25, duration: 160, useNativeDriver: true }).start();
    }
  }, [active, anim, index]);
  return <Animated.View style={[styles.waveBar, { transform: [{ scaleY: anim }], backgroundColor: theme.secondary }]} />;
};

const VoiceToMemeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [recording, setRecording]     = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [duration, setDuration]       = useState(0);
  const [userData, setUserData]       = useState({ userId: null, username: null });
  const timerRef                      = useRef(null);
  const micScale                      = useRef(new Animated.Value(1)).current;
  const resultAnim                    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      const session = await authService.getSession();
      if (session) {
        setUserData({ userId: session.userId, username: session.email?.split('@')[0] || 'User' });
      }
    };
    fetchUser();

    Voice.onSpeechStart = () => {};
    Voice.onSpeechEnd = () => {
      setRecording(false);
      micScale.stopAnimation();
      micScale.setValue(1);
      clearInterval(timerRef.current);
    };
    Voice.onSpeechResults = (e) => { if (e.value?.[0]) setTranscription(e.value[0]); };
    Voice.onSpeechError = () => { setRecording(false); setDuration(0); };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearInterval(timerRef.current);
    };
  }, []);

  const startRec = async () => {
    try {
      setRecording(true); setTranscription(""); setMeme(null); setDuration(0);
      await Voice.start('fr-FR');
      Animated.loop(Animated.sequence([
        Animated.timing(micScale, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(micScale, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (e) { setRecording(false); Alert.alert("Erreur", "Micro inaccessible"); }
  };

  const generate = async () => {
    if (!transcription.trim()) return;
    setLoading(true); setMeme(null);
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), {
        transcription,
        userId: userData.userId,
        username: userData.username
      });
      setMeme(res.data);
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    } catch (e) { Alert.alert("Erreur", "Le studio vocal n'a pas répondu."); }
    finally { setLoading(false); }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 02 · VOICE CAPTURE</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Voice <Text style={{ color: theme.secondary }}>→ Mème</Text></Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="ubu" size={96} floating message="Parle, je m'occupe de la chute." showRing={!!userData.userId} />
          </View>
        </GlassCard>

        <GlassCard style={[styles.card, { alignItems: "center", padding: spacing.xl }]}>
          <View style={styles.wave}>
            {Array.from({ length: 20 }).map((_, i) => <WaveBar key={i} index={i} active={recording} />)}
          </View>
          <Text style={[styles.duration, { color: recording ? theme.danger : theme.textMuted }]}>{fmt(duration)}</Text>
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity onPress={recording ? () => Voice.stop() : startRec} style={[styles.micBtn, { backgroundColor: recording ? theme.danger : theme.secondary }]}>
              {recording ? <View style={styles.stopIcon} /> : <AppIcon name="mic" color="#fff" size={32} />}
            </TouchableOpacity>
          </Animated.View>
        </GlassCard>

        {transcription !== "" && (
          <GlassCard style={styles.card}>
            <Text style={[styles.transcript, { color: theme.textPrimary }]}>"{transcription}"</Text>
            <AnimatedButton title={loading ? "Génération..." : "Générer le mème"} onPress={generate} loading={loading} style={{ marginTop: spacing.md }} />
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }}>
            <GlassCard style={styles.card}>
              <Image source={{ uri: meme.composedImageUrl || meme.imageUrl }} style={styles.memeImg} resizeMode="contain" />
              <View style={styles.actions}>
                <AnimatedButton title="WhatsApp" onPress={() => shareToWhatsApp(meme.composedImageUrl || meme.imageUrl)} style={{ flex: 1, backgroundColor: '#25D366' }} />
                <AnimatedButton title="Galerie" onPress={() => downloadImageToGallery(meme.composedImageUrl || meme.imageUrl)} style={{ flex: 1, backgroundColor: theme.primary }} />
              </View>
              <View style={[styles.autoBadge, { backgroundColor: theme.success + '11' }]}>
                <Text style={{ color: theme.success, fontSize: 11, fontWeight: '800' }}>✓ PUBLIÉ AUTOMATIQUEMENT SUR LE FORUM</Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  hero: { padding: spacing.lg, marginBottom: spacing.md },
  badge: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '900' },
  card: { marginBottom: spacing.md, padding: spacing.md },
  wave: { flexDirection: 'row', gap: 4, height: 40, alignItems: 'center', marginBottom: 10 },
  waveBar: { width: 4, height: 30, borderRadius: 2 },
  duration: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  micBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  stopIcon: { width: 24, height: 24, backgroundColor: '#fff', borderRadius: 4 },
  transcript: { fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  memeImg: { width: '100%', aspectRatio: 1, borderRadius: radius.md, marginBottom: spacing.md, backgroundColor: '#000' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  autoBadge: { marginTop: 12, padding: 10, borderRadius: radius.md, alignItems: 'center' },
});

export default VoiceToMemeScreen;

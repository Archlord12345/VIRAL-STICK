import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";

const DEMOS = [
  "Je voulais juste faire une sieste et je me suis réveillé avec 43 appels manqués.",
  "J'ai dit à tous que j'avais fini le projet alors que j'avais juste renommé le dossier.",
  "Ma connexion coupe toujours quand je commence à avoir raison dans le débat.",
];

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
  const [published, setPublished]     = useState(false);
  const [msg, setMsg]                 = useState("Donne-moi une phrase dite à chaud. Je garde l'énergie.");
  const timerRef                      = useRef(null);
  const micScale                      = useRef(new Animated.Value(1)).current;
  const resultAnim                    = useRef(new Animated.Value(0)).current;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRec = () => {
    setRecording(true); setTranscription(""); setMeme(null); setDuration(0); setPublished(false);
    setMsg("Parle comme tu le sens. Plus c'est spontané, mieux c'est.");
    Animated.loop(Animated.sequence([
      Animated.timing(micScale, { toValue: 1.12, duration: 500, useNativeDriver: true }),
      Animated.timing(micScale, { toValue: 1,    duration: 500, useNativeDriver: true }),
    ])).start();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const stopRec = () => {
    setRecording(false); micScale.stopAnimation(); micScale.setValue(1);
    clearInterval(timerRef.current);
    setMsg("Transcription en cours...");
    setTimeout(() => {
      const s = DEMOS[Math.floor(Math.random() * DEMOS.length)];
      setTranscription(s); setMsg("Transcription prête. Lance la transformation !");
    }, 1200);
  };

  const generate = async () => {
    if (!transcription.trim()) { Alert.alert("Viral Stick", "Enregistre d'abord une prise."); return; }
    setLoading(true); setMeme(null); setMsg("Je construis la chute à partir de ton énergie vocale...");
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), { transcription });
      setMeme(res.data);
      setMsg(res.data?.companionComment || "L'énergie est préservée. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    } catch {
      setMsg("Le module vocal n'a pas répondu. Relance.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally { setLoading(false); }
  };

  const publishToForum = async () => {
    if (!meme || published) return;
    try {
      await axios.post(apiUrl("/api/forum/publish"), {
        shareId: meme.share?.shareId,
        imageUrl: meme.share?.publicUrl || meme.imageUrl,
        topText: meme.topText,
        bottomText: meme.bottomText
      });
      setPublished(true);
      Alert.alert("Succès", "Mème vocal propulsé sur le Forum !");
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message;
      Alert.alert("Erreur publication", errorMsg);
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 02 · VOICE CAPTURE</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Voice <Text style={{ color: theme.secondary }}>→ Mème</Text></Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Transforme une parole spontanée en punchline mémorable.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="ubu" size={96} floating message={msg} />
          </View>
        </GlassCard>

        {/* Recorder */}
        <GlassCard animate delay={80} style={[styles.card, { alignItems: "center", gap: spacing.md }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>RECORDER STUDIO</Text>
          <View style={styles.wave}>
            {Array.from({ length: 26 }).map((_, i) => <WaveBar key={i} index={i} active={recording} />)}
          </View>
          <Text style={[styles.durationText, { color: recording ? theme.danger : theme.textMuted }]}>
            {recording ? `● REC ${fmt(duration)}` : fmt(duration)}
          </Text>
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity
              onPress={recording ? stopRec : startRec}
              style={[styles.micBtn, {
                backgroundColor: recording ? theme.danger : theme.secondary,
                shadowColor: recording ? theme.danger : theme.secondaryLight
              }]}
              activeOpacity={0.85}
            >
              {recording ? (
                <View style={styles.stopIcon} />
              ) : (
                <AppIcon name="mic" color="#ffffff" size={32} />
              )}
            </TouchableOpacity>
          </Animated.View>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {recording ? "Parle naturellement. Le mème naît de la spontanéité." : "Appuie pour démarrer une prise démo, puis transforme en mème."}
          </Text>
        </GlassCard>

        {transcription.length > 0 && (
          <GlassCard style={styles.card}>
            <Text style={[styles.label, { color: theme.textMuted }]}>TRANSCRIPTION</Text>
            <Text style={[styles.transcript, { color: theme.textPrimary }]}>"{transcription}"</Text>
            <AnimatedButton title={loading ? "Transformation..." : "Transformer en mème"} onPress={generate} loading={loading} disabled={loading} size="lg" style={{ marginTop: spacing.md }} />
          </GlassCard>
        )}

        {loading && (
          <GlassCard style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
            <ActivityIndicator color={theme.secondary} size="large" />
            <Text style={[styles.loadTitle, { color: theme.textPrimary }]}>Remix vocal en cours</Text>
            <Text style={[styles.loadSub, { color: theme.textMuted }]}>Préservation de la spontanéité et recherche de la meilleure chute.</Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [24,0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>✅ MÈME VOCAL PRÊT</Text></View>
              <View style={[styles.memePreview, { borderColor: theme.border }]}>
                {meme.imageUrl ? (
                  <Image source={{ uri: meme.imageUrl }} style={styles.fullMeme} resizeMode="contain" />
                ) : (
                  <View style={[styles.memeBox, { backgroundColor: theme.backgroundSecondary }]}>
                    <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.topText}</Text>
                    <View style={styles.memeScene}>
                      <AppIcon name="mic" color={theme.secondary} size={36} />
                      <Text style={[styles.memeSceneText, { color: theme.textSecondary }]}>{meme.descriptionImage}</Text>
                    </View>
                    <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.bottomText}</Text>
                  </View>
                )}
              </View>
              {meme.original_transcript_subtitle ? (
                <View style={[styles.subtitleCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                  <Text style={[styles.gridLabel, { color: theme.textMuted }]}>SOUS-TITRE ORIGINAL</Text>
                  <Text style={[styles.subtitleText, { color: theme.textPrimary }]}>"{meme.original_transcript_subtitle}"</Text>
                </View>
              ) : null}
              <View style={styles.actions}>
                <AnimatedButton title="Partager" onPress={() => Alert.alert("Partage", "Lien: " + meme.share?.publicUrl)} size="lg" style={{ flex: 1 }} />
                {!published ? (
                  <AnimatedButton title="Propulser 🌍" onPress={publishToForum} size="lg" variant="primary" style={{ flex: 1, backgroundColor: theme.secondary }} />
                ) : (
                  <View style={[styles.publishedBadge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.publishedText, { color: theme.secondary }]}>✅ PUBLIÉ</Text></View>
                )}
              </View>
            </GlassCard>
          </Animated.View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  sub:         { fontSize: 14, marginTop: 6, lineHeight: 20 },
  card:        { marginBottom: spacing.md, padding: spacing.md },
  label:       { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  wave:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 60, width: "100%" },
  waveBar:     { width: 5, height: 44, borderRadius: 5 },
  durationText:{ fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  micBtn:      { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 4 },
  stopIcon:    { width: 22, height: 22, borderRadius: 4, backgroundColor: "#ffffff" },
  hint:        { textAlign: "center", fontSize: 13, lineHeight: 19, paddingHorizontal: spacing.sm },
  transcript:  { fontSize: 16, fontStyle: "italic", lineHeight: 24, fontWeight: "600" },
  loadTitle:   { fontSize: 17, fontWeight: "800" },
  loadSub:     { textAlign: "center", fontSize: 13, lineHeight: 18 },
  memePreview: { borderWidth: 1, borderRadius: radius.md, overflow: "hidden", marginBottom: spacing.md, backgroundColor: "#000000" },
  fullMeme:    { width: "100%", aspectRatio: 1 },
  memeBox:     { borderWidth: 1, padding: spacing.md, alignItems: "center" },
  memeText:    { fontSize: 17, fontWeight: "900", textTransform: "uppercase", textAlign: "center", lineHeight: 22 },
  memeScene:   { marginVertical: spacing.md, width: "100%", minHeight: 100, alignItems: "center", justifyContent: "center", padding: spacing.md },
  memeSceneText:{ textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 8 },
  subtitleCard:{ padding: spacing.md, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md },
  gridLabel:   { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 6 },
  subtitleText:{ fontSize: 14, fontStyle: "italic", lineHeight: 19 },
  actions:     { flexDirection: "row", gap: spacing.sm },
  publishedBadge: { flex: 1, height: 54, borderRadius: radius.md, justifyContent: "center", alignItems: "center" },
  publishedText: { fontWeight: "900" },
});

export default VoiceToMemeScreen;

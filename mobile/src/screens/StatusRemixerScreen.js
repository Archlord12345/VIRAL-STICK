import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";

const FILTERS = [
  { id: "none", label: "Original", icon: "refresh-cw" },
  { id: "dramatic", label: "Dramatic", icon: "eye" },
  { id: "neon", label: "Neon", icon: "zap" },
  { id: "vintage", label: "Vintage", icon: "clock" },
  { id: "fire", label: "Fire", icon: "flame" },
];

const POSITIONS = ["top", "center", "bottom"];

const StatusRemixerScreen = ({ navigate, route }) => {
  const { theme, isDark } = useTheme();
  const params = route?.params || {};
  const [filter, setFilter]       = useState("none");
  const [caption, setCaption]     = useState("");
  const [position, setPosition]   = useState("bottom");
  const [imagePicked, setImagePicked] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [remix, setRemix]         = useState(null);
  const [msg, setMsg]             = useState("Envoie un visuel ou une intention. Je m'occupe du reste.");
  const previewAnim               = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (params.imageUrl) {
      setInitialImage(params.imageUrl);
      setImagePicked(true);
      animatePreview();
    }
    if (params.text) {
      setCaption(params.text);
    }
  }, [params]);

  const overlay = useMemo(() => ({
    dramatic: "rgba(0,0,0,0.55)", neon: "rgba(34,211,238,0.22)",
    vintage: "rgba(193,132,79,0.24)", fire: "rgba(239,68,68,0.28)",
  }[filter] || "transparent"), [filter]);

  const pickImage = () => {
    Alert.alert("Image source", "Choisir depuis :", [
      { text: "📷 Caméra", onPress: () => { setImagePicked(true); animatePreview(); } },
      { text: "🖼️ Galerie", onPress: () => { setImagePicked(true); animatePreview(); } },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const animatePreview = () => {
    setMsg("Base visuelle chargée. On va construire une vraie publication.");
    Animated.spring(previewAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
  };

  const askRemix = async () => {
    if (!imagePicked && !caption.trim()) { Alert.alert("Viral Stick", "Charge une image ou décris une idée."); return; }
    setLoading(true); setRemix(null); setMsg("Je cherche une caption social-first...");
    try {
      const res = await axios.post(apiUrl("/api/memes/status-remixer"), {
        text: caption || "Image de réaction expressive à transformer en mème",
        inputImageUrl: initialImage || undefined,
        imageContext: imagePicked ? `Filtre: ${filter}. Position: ${position}.` : undefined,
      });
      setRemix(res.data);
      if (res.data?.meme_text) setCaption(res.data.meme_text);
      setMsg(res.data?.companionComment || "Remix prêt. Caption et édition alignés.");
    } catch {
      setMsg("Le remix IA n'a pas répondu. Réessaie.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 03 · VISUAL REMIX</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Status <Text style={{ color: theme.primary }}>Remixer</Text></Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Passe d'un visuel brut à une publication mieux cadrée et plus lisible.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="bio" size={96} floating message={msg} />
          </View>
        </GlassCard>

        {!imagePicked ? (
          <GlassCard style={styles.card}>
            <Text style={[styles.label, { color: theme.textMuted }]}>SOURCE VISUELLE</Text>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Charge une image à remixer</Text>
            <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>Caméra ou galerie — l'IA analyse le contexte et génère la meilleure caption.</Text>
            <AnimatedButton title="Choisir une image" onPress={pickImage} size="lg" style={{ marginTop: spacing.md }} />
            <AnimatedButton title="Utiliser une image démo" onPress={() => { setImagePicked(true); animatePreview(); }} variant="ghost" size="lg" style={{ marginTop: spacing.sm }} />
          </GlassCard>
        ) : (
          <>
            <Animated.View style={{ opacity: previewAnim, transform: [{ scale: previewAnim.interpolate({ inputRange: [0,1], outputRange: [0.93,1] }) }] }}>
              <GlassCard style={styles.card}>
                <Text style={[styles.label, { color: theme.textMuted }]}>CANVAS</Text>
                <View style={[styles.canvas, { borderColor: theme.border }]}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: overlay, borderRadius: radius.md, zIndex: 2 }]} pointerEvents="none" />
                  {remix?.imageUrl || initialImage ? (
                    <Image source={{ uri: remix?.imageUrl || initialImage }} style={styles.canvasImg} resizeMode="cover" />
                  ) : (
                    <View style={styles.canvasPlaceholder}>
                      <AppIcon name="image" color={theme.textMuted} size={48} />
                      <Text style={[styles.canvasLabel, { color: theme.textMuted }]}>Visuel de démonstration</Text>
                    </View>
                  )}
                  {!!caption && (
                    <Text style={[styles.overlayText, position === "top" ? styles.top : position === "center" ? styles.center : styles.bottom]}>
                      {caption.toUpperCase()}
                    </Text>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            <GlassCard style={styles.card}>
              <Text style={[styles.label, { color: theme.textMuted }]}>ÉDITION</Text>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Caption principale</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
                value={caption} onChangeText={setCaption}
                placeholder="Caption courte et percutante..."
                placeholderTextColor={theme.textMuted} multiline
              />

              <Text style={[styles.sectionTitle, { marginTop: spacing.md, color: theme.textPrimary }]}>Filtre</Text>
              <View style={styles.filterRow}>
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f.id} onPress={() => setFilter(f.id)}
                    style={[styles.filterChip, {
                      backgroundColor: filter === f.id ? theme.secondaryLight : theme.backgroundSecondary,
                      borderColor: filter === f.id ? theme.secondary : theme.border
                    }]}
                  >
                    <AppIcon name={f.icon} color={filter === f.id ? theme.secondary : theme.textSecondary} size={16} />
                    <Text style={[styles.filterLabel, { color: filter === f.id ? theme.secondary : theme.textSecondary }]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: spacing.md, color: theme.textPrimary }]}>Position du texte</Text>
              <View style={styles.posRow}>
                {POSITIONS.map((p) => (
                  <TouchableOpacity
                    key={p} onPress={() => setPosition(p)}
                    style={[styles.posBtn, {
                      backgroundColor: position === p ? theme.primaryLight : theme.backgroundSecondary,
                      borderColor: position === p ? theme.primary : theme.border
                    }]}
                  >
                    <Text style={[styles.posLabel, { color: position === p ? theme.primary : theme.textSecondary }]}>
                      {p === "top" ? "Haut" : p === "center" ? "Centre" : "Bas"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            <View style={styles.actions}>
              <AnimatedButton title={loading ? "Remix IA..." : "Remixer avec l'IA"} onPress={askRemix} loading={loading} disabled={loading} size="lg" style={{ flex: 1 }} />
              <AnimatedButton title="Exporter" onPress={() => Alert.alert("Viral Stick", "Export PNG à finaliser côté pipeline.")} variant="ghost" size="lg" style={{ flex: 1 }} />
            </View>

            {loading && (
              <GlassCard style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
                <ActivityIndicator color={theme.primary} size="large" />
                <Text style={[styles.loadTitle, { color: theme.textPrimary }]}>Direction visuelle en cours</Text>
                <Text style={[styles.loadSub, { color: theme.textMuted }]}>Recherche caption social-first et améliorations de cadrage.</Text>
              </GlassCard>
            )}

            {remix && (
              <GlassCard style={styles.card}>
                <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>✅ RECOMMANDATIONS IA</Text></View>
                <Text style={[styles.sectionTitle, { marginBottom: spacing.md, color: theme.textPrimary }]}>{remix.meme_text || caption || "Caption prête"}</Text>
                {(remix.visual_enhancements || []).map((item, i) => (
                  <View key={i} style={[styles.enhancement, { backgroundColor: theme.backgroundSecondary }]}>
                    <Text style={[styles.enhIdx, { color: theme.primary }]}>{i + 1}</Text>
                    <Text style={[styles.enhText, { color: theme.textPrimary }]}>{item}</Text>
                  </View>
                ))}
              </GlassCard>
            )}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  scroll:       { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:         { padding: spacing.lg, marginBottom: spacing.md },
  badge:        { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:    { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:        { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  sub:          { fontSize: 14, marginTop: 6, lineHeight: 20 },
  card:         { marginBottom: spacing.md },
  label:        { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  sectionSub:   { fontSize: 13, lineHeight: 19, marginBottom: spacing.sm },
  canvas:       { borderWidth: 1, borderRadius: radius.md, minHeight: 280, overflow: "hidden", justifyContent: "center", alignItems: "center", position: "relative" },
  canvasImg:    { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  canvasPlaceholder: { alignItems: "center", justifyContent: "center", gap: 10 },
  canvasLabel:  { fontSize: 13, marginTop: 8 },
  overlayText:  { position: "absolute", left: 16, right: 16, color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center", textTransform: "uppercase", textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6, zIndex: 10 },
  top:          { top: 16 },
  center:       { top: "44%" },
  bottom:       { bottom: 16 },
  input:        { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 15, minHeight: 80, textAlignVertical: "top" },
  filterRow:    { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  filterChip:   { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 9 },
  filterLabel:  { fontSize: 13, fontWeight: "700" },
  posRow:       { flexDirection: "row", gap: spacing.sm },
  posBtn:       { flex: 1, borderWidth: 1, borderRadius: radius.md, paddingVertical: 11, alignItems: "center" },
  posLabel:     { fontSize: 14, fontWeight: "800" },
  actions:      { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  loadTitle:    { fontSize: 17, fontWeight: "800" },
  loadSub:      { textAlign: "center", fontSize: 13, lineHeight: 18 },
  enhancement:  { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm },
  enhIdx:       { fontSize: 15, fontWeight: "900", minWidth: 18 },
  enhText:      { flex: 1, fontSize: 13, lineHeight: 19 },
});

export default StatusRemixerScreen;

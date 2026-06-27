
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, TextInput, Alert, StatusBar, ActivityIndicator } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";

const SettingsScreen = ({ navigate }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [gemini, setGemini]     = useState("");
  const [mistral, setMistral]   = useState("");
  const [deepseek, setDeepseek] = useState("");
  const [show, setShow]         = useState(false);
  const [status, setStatus]     = useState("");
  const [testing, setTesting]   = useState(false);
  const anim                    = useRef(new Animated.Value(0)).current;

  const PROVIDERS = [
    { key: "gemini",   label: "Gemini",   icon: "sparkles", color: "#7C3AED", desc: "Provider principal — texte et image." },
    { key: "mistral",  label: "Mistral",  icon: "wind",     color: "#06B6D4", desc: "Fallback texte — garantit la génération." },
    { key: "deepseek", label: "DeepSeek", icon: "search",   color: theme.secondary, desc: "Deuxième fallback texte." },
  ];

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  }, [anim]);

  const testConnection = async () => {
    setTesting(true);
    setStatus("");
    try {
      const url = apiUrl("/health");
      const res = await axios.get(url, { timeout: 5000 });
      if (res.status === 200) {
        setStatus("✅ Connexion établie avec le backend.");
      } else {
        setStatus("⚠️ Le serveur a répondu avec un statut inattendu.");
      }
    } catch (err) {
      console.log("Error testing connection:", err);
      setStatus("❌ Impossible de joindre le backend. Vérifie ta connexion internet.");
    } finally {
      setTesting(false);
    }
  };

  const save = () => {
    if (!gemini.trim() && !mistral.trim() && !deepseek.trim()) {
      Alert.alert("Viral Stick", "Entre au moins une clé API avant d'enregistrer."); return;
    }
    setStatus("✅ Clés enregistrées pour cette session.");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }] }}>

          {/* Hero */}
          <GlassCard style={styles.hero}>
            <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>PARAMÈTRES IA</Text></View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Configu<Text style={{ color: theme.primary }}>ration</Text></Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>Gère les clés API et configure l'interface du studio.</Text>
            <View style={{ alignItems: "center", marginTop: spacing.md }}>
              <CompanionAvatar companion="para" size={88} floating message="Je garde les réglages clairs et prêts pour l'exploitation." />
            </View>
          </GlassCard>

          {/* Thème */}
          <GlassCard animate delay={50} style={styles.card}>
            <View style={styles.sectionHeader}>
              <AppIcon name="sun" color={theme.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Préférences d'affichage</Text>
            </View>
            <View style={styles.themeRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.themeLabel, { color: theme.textPrimary }]}>Thème Sombre</Text>
                <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>Activer l'ambiance nocturne pour l'application.</Text>
              </View>
              <TouchableOpacity
                onPress={toggleTheme}
                activeOpacity={0.8}
                style={[styles.switchContainer, { backgroundColor: isDark ? theme.primary : theme.border }]}
              >
                <View style={[styles.switchPin, {
                  alignSelf: isDark ? "flex-end" : "flex-start",
                  backgroundColor: "#ffffff"
                }]} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Providers actifs */}
          <GlassCard animate delay={100} style={styles.card}>
            <View style={styles.sectionHeader}>
              <AppIcon name="zap" color={theme.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Providers actifs</Text>
            </View>
            {PROVIDERS.map((p) => (
              <View key={p.key} style={[styles.providerRow, { backgroundColor: `${p.color}10`, borderColor: `${p.color}33` }]}>
                <View style={[styles.providerDot, { backgroundColor: p.color }]} />
                <AppIcon name={p.icon} color={p.color} size={18} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.providerName, { color: theme.textPrimary }]}>{p.label}</Text>
                  <Text style={[styles.providerDesc, { color: theme.textSecondary }]}>{p.desc}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Clés API */}
          <GlassCard animate delay={200} style={styles.card}>
            <View style={styles.keyHeader}>
              <View style={styles.sectionHeader}>
                <AppIcon name="key" color={theme.primary} size={20} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Clés API</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShow((v) => !v)}
                style={[styles.toggleBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
              >
                <Text style={[styles.toggleText, { color: theme.textSecondary }]}>{show ? "Masquer" : "Afficher"}</Text>
              </TouchableOpacity>
            </View>

            {[
              ["Gemini API Key",   gemini,   setGemini,   "AIza..."],
              ["Mistral API Key",  mistral,  setMistral,  "mistral-..."],
              ["DeepSeek API Key", deepseek, setDeepseek, "sk-..."],
            ].map(([label, value, setter, ph]) => (
              <View key={label} style={{ marginBottom: 16 }}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
                  value={value} onChangeText={setter}
                  placeholder={ph} placeholderTextColor={theme.textMuted}
                  secureTextEntry={!show} autoCapitalize="none" autoCorrect={false}
                />
              </View>
            ))}

            <View style={styles.actions}>
              <AnimatedButton title="Enregistrer" onPress={save} size="lg" style={{ flex: 1 }} />
              <TouchableOpacity
                style={[styles.testBtn, { backgroundColor: theme.backgroundSecondary, borderColor: testing ? theme.textMuted : theme.secondary }]}
                onPress={testConnection}
                disabled={testing}
              >
                {testing ? <ActivityIndicator size="small" color={theme.textSecondary} /> : <Text style={[styles.testBtnText, { color: theme.textPrimary }]}>Tester Connexion</Text>}
              </TouchableOpacity>
            </View>

            {!!status && (
              <View style={[styles.statusBox, { backgroundColor: status.startsWith("✅") ? theme.secondaryLight : "#fee2e2", borderColor: status.startsWith("✅") ? `${theme.secondary}44` : "#fecaca" }]}>
                <Text style={[styles.statusText, { color: status.startsWith("✅") ? theme.secondary : "#b91c1c" }]}>{status}</Text>
              </View>
            )}
          </GlassCard>

          {/* Lien à propos */}
          <GlassCard animate delay={300} style={styles.card}>
            <TouchableOpacity onPress={() => navigate?.("About")} activeOpacity={0.8} style={styles.aboutRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <AppIcon name="info" color={theme.primary} size={20} />
                <View>
                  <Text style={[styles.aboutLabel, { color: theme.textPrimary }]}>À propos du produit</Text>
                  <Text style={[styles.aboutDesc, { color: theme.textSecondary }]}>Identité, stack, équipe et vision.</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" color={theme.primary} size={18} />
            </TouchableOpacity>
          </GlassCard>

          <View style={{ height: 100 }} />
        </Animated.View>
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
  card:        { marginBottom: spacing.md },
  sectionHeader:{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.md },
  sectionTitle:{ fontSize: 18, fontWeight: "800" },
  themeRow:    { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  themeLabel:  { fontSize: 15, fontWeight: "800" },
  themeDesc:   { fontSize: 12, marginTop: 2 },
  switchContainer:{ width: 50, height: 28, borderRadius: 14, padding: 3, justifyContent: "center" },
  switchPin:   { width: 22, height: 22, borderRadius: 11 },
  providerRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 8 },
  providerDot: { width: 8, height: 8, borderRadius: 4 },
  providerName:{ fontSize: 15, fontWeight: "800" },
  providerDesc:{ fontSize: 12, marginTop: 2, lineHeight: 16 },
  keyHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  toggleBtn:   { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 7 },
  toggleText:  { fontSize: 13, fontWeight: "700" },
  fieldLabel:  { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  input:       { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 14 },
  actions:     { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  testBtn:     { flex: 1, borderWidth: 1, borderRadius: radius.md, justifyContent: "center", alignItems: "center" },
  testBtnText: { fontSize: 14, fontWeight: "800" },
  statusBox:   { borderWidth: 1, borderRadius: radius.md, padding: 12, marginTop: spacing.md },
  statusText:  { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  aboutRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aboutLabel:  { fontSize: 16, fontWeight: "800" },
  aboutDesc:   { fontSize: 13, marginTop: 4 },
});

export default SettingsScreen;

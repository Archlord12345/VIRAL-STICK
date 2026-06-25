import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView, StatusBar, Image } from "react-native";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";

const COMPANIONS = ["bio", "ubu", "art"];
const MESSAGES   = [
  "Le studio est prêt. On crée quelque chose de viral ?",
  "Un bon angle, une bonne image : voilà la méthode.",
  "Tes mèmes méritent une identité forte.",
];

const HomeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [companionIdx, setCompanionIdx] = useState(0);
  const headerY  = useRef(new Animated.Value(-30)).current;
  const headerOp = useRef(new Animated.Value(0)).current;

  const MODULES = [
    { key: "ContextReader", title: "Context Reader", subtitle: "Texte → mème culturel adapté", icon: "context", color: theme.warning },
    { key: "VoiceToMeme",  title: "Voice → Mème",   subtitle: "Parole spontanée → punchline", icon: "voice", color: theme.secondary },
    { key: "StatusRemixer",title: "Status Remixer",  subtitle: "Visuel ou status → remix viral",icon: "remix", color: theme.primary },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(headerOp, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setInterval(() => setCompanionIdx((i) => (i + 1) % 3), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Animated.View style={{ opacity: headerOp, transform: [{ translateY: headerY }] }}>
          <GlassCard style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}>
                  <Text style={[styles.badgeText, { color: theme.secondary }]}>STUDIO IA MULTIMODAL</Text>
                </View>
                <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                  Viral {"\n"}<Text style={{ color: theme.secondary }}>Stick</Text>
                </Text>
                <Text style={[styles.heroSub, { color: theme.textSecondary }]}>Crée du contenu viral avec tes compagnons IA.</Text>
              </View>
              <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.heroBottom}>
              <CompanionAvatar companion={COMPANIONS[companionIdx]} size={96} floating message={MESSAGES[companionIdx]} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Modules */}
        <Text style={[styles.section, { color: theme.textMuted }]}>MODULES</Text>
        {MODULES.map((m, i) => (
          <GlassCard key={m.key} animate delay={100 + i * 80} style={styles.moduleCard}>
            <TouchableOpacity onPress={() => navigate?.(m.key)} activeOpacity={0.8} style={styles.moduleInner}>
              <View style={[styles.iconBadge, { backgroundColor: `${m.color}18`, borderColor: `${m.color}44` }]}>
                <AppIcon name={m.icon} color={m.color} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.moduleName, { color: theme.textPrimary }]}>{m.title}</Text>
                <Text style={[styles.moduleSub, { color: theme.textSecondary }]}>{m.subtitle}</Text>
              </View>
              <AppIcon name="chevron-right" color={m.color} size={18} />
            </TouchableOpacity>
          </GlassCard>
        ))}

        {/* CTA */}
        <GlassCard animate delay={400} style={[styles.cta, { backgroundColor: theme.secondaryLight, borderColor: `${theme.secondary}44` }]}>
          <Text style={[styles.ctaTitle, { color: theme.textPrimary }]}>Prêt à créer du contenu viral ? </Text>
          <AnimatedButton title="Commencer avec Context Reader" onPress={() => navigate?.("ContextReader")} size="lg" style={{ marginTop: spacing.md }} />
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  scroll:     { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:       { padding: spacing.lg, marginBottom: spacing.lg },
  heroTop:    { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  badge:      { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 8 },
  badgeText:  { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  heroTitle:  { fontSize: 36, fontWeight: "900", letterSpacing: -1, lineHeight: 40 },
  heroSub:    { fontSize: 14, marginTop: 6, lineHeight: 20 },
  logo:       { width: 90, height: 90 },
  section:    { fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: spacing.sm },
  moduleCard: { marginBottom: spacing.sm, padding: 0 },
  moduleInner:{ flexDirection: "row", alignItems: "center", padding: spacing.md, gap: spacing.md },
  iconBadge:  { width: 52, height: 52, borderRadius: radius.md, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  moduleName: { fontSize: 16, fontWeight: "800" },
  moduleSub:  { fontSize: 13, marginTop: 3 },
  cta:        { padding: spacing.lg, marginTop: spacing.md },
  ctaTitle:   { fontSize: 18, fontWeight: "800", textAlign: "center" },
});

export default HomeScreen;

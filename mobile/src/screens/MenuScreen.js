import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { colors, spacing, borderRadius } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import CompanionAvatar from "../components/CompanionAvatar";

const MENU_OPTIONS = [
  { key: "CompanionChat", label: "Chat Compagnons", icon: "💬", desc: "Discute avec tes experts IA", color: colors.data },
  { key: "MultiChat",     label: "Multi-Chat",      icon: "👥", desc: "Le board complet de l'IA", color: colors.para },
  { key: "Settings",      label: "Paramètres",      icon: "⚙️", desc: "Clés API et préférences", color: colors.silver },
  { key: "About",         label: "À propos",        icon: "ℹ️", desc: "L'équipe et le manifeste", color: colors.skyBlue },
];

const MenuScreen = ({ navigate }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard animate style={styles.banner}>
          <View style={styles.bannerInner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Studio Viral</Text>
              <Text style={styles.bannerSub}>Génère. Partage. Viralise.</Text>
            </View>
            <CompanionAvatar companion="arch" size={70} floating />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>AUTRES OUTILS & RÉGLAGES</Text>

        <View style={styles.grid}>
          {MENU_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => navigate?.(item.key)}
              activeOpacity={0.8}
              style={styles.menuItem}
            >
              <GlassCard style={{ padding: spacing.md, width: "100%", height: "100%" }}>
                <View style={[styles.iconBox, { backgroundColor: `${item.color}18`, borderColor: item.color }]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.version}>VIRAL STICK v1.0.0</Text>
          <Text style={styles.copyright}>KERNEL FORGE — 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { padding: spacing.md },
  banner: { marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.duoGreenLight, borderColor: `${colors.duoGreen}44` },
  bannerInner: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  bannerTitle: { fontSize: 24, fontWeight: "900", color: colors.almostBlack },
  bannerSub: { fontSize: 13, color: colors.duoGreenDark, fontWeight: "700" },
  sectionTitle: { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1.5, marginBottom: spacing.md, marginLeft: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  menuItem: { width: "47.5%", height: 160 },
  iconBox: { width: 44, height: 44, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  icon: { fontSize: 22 },
  label: { fontSize: 15, fontWeight: "800", color: colors.almostBlack, marginBottom: 4 },
  desc: { fontSize: 11, color: colors.graphite, lineHeight: 14, fontWeight: "600" },
  footer: { marginTop: spacing.xxl, alignItems: "center", paddingBottom: 40 },
  logo: { width: 50, height: 50, opacity: 0.5, marginBottom: 10 },
  version: { fontSize: 12, fontWeight: "800", color: colors.silver },
  copyright: { fontSize: 10, color: colors.silver, marginTop: 4 },
});

export default MenuScreen;

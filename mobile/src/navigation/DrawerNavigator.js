import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView, Image } from "react-native";
import { spacing, radius } from "../theme";
import CompanionAvatar from "../components/CompanionAvatar";
import { useTheme } from "../theme";
import AppIcon from "../components/AppIcon";

const { width: SW } = Dimensions.get("window");
const DW = SW * 0.78;

const DrawerNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;
  const borderR    = useRef(new Animated.Value(0)).current;

  const NAV_ITEMS = [
    { key: "Home",           label: "Accueil",         icon: "home",      accent: theme.secondary },
    { key: "ContextReader",  label: "Context Reader",  icon: "context",   accent: theme.warning },
    { key: "VoiceToMeme",    label: "Voice → Mème",    icon: "voice",     accent: theme.secondary },
    { key: "StatusRemixer",  label: "Status Remixer",  icon: "remix",     accent: theme.primary },
    { key: "CompanionChat",  label: "Compagnons",      icon: "chat",      accent: theme.primary },
    { key: "MultiChat",      label: "Multi-Chat",      icon: "multichat", accent: theme.warning },
    { key: "Settings",       label: "Paramètres",      icon: "settings",  accent: theme.textSecondary },
    { key: "About",          label: "À propos",        icon: "about",     accent: theme.primary },
  ];

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, { toValue: DW,  duration: 300, useNativeDriver: false }),
      Animated.timing(scale,      { toValue: 0.92, duration: 300, useNativeDriver: false }),
    ]).start();
    Animated.timing(borderR, { toValue: 20, duration: 300, useNativeDriver: false }).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 0, duration: 280, useNativeDriver: false }),
      Animated.timing(scale,      { toValue: 1, duration: 280, useNativeDriver: false }),
    ]).start(() => setIsOpen(false));
    Animated.timing(borderR, { toValue: 0, duration: 280, useNativeDriver: false }).start();
  };

  const handleNav = (key) => {
    closeDrawer();
    setTimeout(() => onNavigate(key), 280);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundSecondary }]}>
      {/* Drawer fond */}
      <View style={[styles.drawer, { width: DW, backgroundColor: theme.backgroundCard, borderRightColor: theme.border }]}>
        <SafeAreaView style={styles.drawerInner}>
          {/* Brand */}
          <View style={[styles.brand, { borderBottomColor: theme.border }]}>
            <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.brandLogo} resizeMode="contain" />
            <Text style={[styles.brandTitle, { color: theme.primary }]}>Viral Stick</Text>
            <Text style={[styles.brandSub, { color: theme.textMuted }]}>Studio IA de mèmes</Text>
          </View>

          {/* Nav items */}
          <View style={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const active = currentScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => handleNav(item.key)}
                  activeOpacity={0.7}
                  style={[styles.navItem, {
                    backgroundColor: active ? `${item.accent}18` : "transparent",
                    borderColor:     active ? `${item.accent}44` : theme.border,
                  }]}
                >
                  <AppIcon name={item.icon} color={active ? item.accent : theme.textSecondary} size={18} />
                  <Text style={[styles.navLabel, { color: active ? item.accent : theme.textSecondary, fontWeight: active ? "800" : "700" }]}>
                    {item.label}
                  </Text>
                  {active && <View style={[styles.activeDot, { backgroundColor: item.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer compagnon */}
          <View style={styles.drawerFooter}>
            <CompanionAvatar companion="arch" size={80} floating message="Le studio veille sur ton contenu." />
          </View>
        </SafeAreaView>
      </View>

      {/* Panneau principal */}
      <Animated.View style={[styles.screenPanel, { transform: [{ translateX }, { scale }], borderRadius: borderR, overflow: "hidden", backgroundColor: theme.background }]}>
        {/* Bouton menu */}
        <TouchableOpacity
          onPress={isOpen ? closeDrawer : openDrawer}
          style={[styles.menuBtn, { backgroundColor: theme.backgroundCard, borderColor: theme.border, shadowColor: "#000" }]}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <View style={[styles.bar, { width: isOpen ? 22 : 26, backgroundColor: theme.textPrimary }]} />
          <View style={[styles.bar, { width: 18, backgroundColor: theme.textPrimary }]} />
          <View style={[styles.bar, { width: isOpen ? 22 : 24, backgroundColor: theme.textPrimary }]} />
        </TouchableOpacity>

        {isOpen && (
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeDrawer} activeOpacity={1} />
        )}

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:        { flex: 1 },
  drawer:      { position: "absolute", top: 0, left: 0, bottom: 0, paddingTop: 16, borderRightWidth: 2 },
  drawerInner: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  brand:       { alignItems: "center", paddingVertical: spacing.lg, marginBottom: spacing.md, borderBottomWidth: 2 },
  brandLogo:   { width: 60, height: 60, marginBottom: 8 },
  brandTitle:  { fontSize: 22, fontWeight: "900", letterSpacing: 0.5 },
  brandSub:    { fontSize: 11, fontWeight: "700", marginTop: 2 },
  navList:     { flex: 1, gap: 6 },
  navItem:     { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 2, gap: 10 },
  navLabel:    { flex: 1, fontSize: 15 },
  activeDot:   { width: 8, height: 8, borderRadius: 4 },
  drawerFooter:{ alignItems: "center", paddingTop: spacing.md },
  screenPanel: { flex: 1, ...StyleSheet.absoluteFillObject },
  menuBtn:     { position: "absolute", top: 52, left: spacing.md, zIndex: 100, width: 44, height: 44, borderRadius: radius.md, borderWidth: 2, justifyContent: "center", paddingHorizontal: 10, gap: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  bar:         { height: 2.5, borderRadius: 2 },
});

export default DrawerNavigator;

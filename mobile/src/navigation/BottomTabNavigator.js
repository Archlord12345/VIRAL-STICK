import React from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { useTheme } from "../theme";
import AppIcon from "../components/AppIcon";

const TAB_ITEMS = [
  { key: "Home",           icon: "home",           accentKey: "primary" },
  { key: "ContextReader",  icon: "book",           accentKey: "warning" },
  { key: "VoiceToMeme",    icon: "mic",            accentKey: "secondary" },
  { key: "StatusRemixer",  icon: "image",          accentKey: "danger" },
  { key: "Menu",           icon: "settings",       accentKey: "textPrimary" },
];

const BottomTabNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Contenu de l'écran */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Barre de navigation basse (Pill flottant) */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[
          styles.tabBar, 
          { 
            backgroundColor: theme.backgroundCard, 
            borderColor: theme.border,
            shadowColor: theme.cardShadow.shadowColor,
            shadowOffset: theme.cardShadow.shadowOffset,
            shadowOpacity: theme.cardShadow.shadowOpacity,
            shadowRadius: theme.cardShadow.shadowRadius,
            elevation: theme.cardShadow.elevation,
          }
        ]}>
          {TAB_ITEMS.map((item) => {
            const active = currentScreen === item.key;
            const accentColor = theme[item.accentKey] || theme.primary;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => onNavigate(item.key)}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <AppIcon
                  name={item.icon}
                  color={active ? accentColor : theme.textMuted}
                  size={24}
                />
                {/* Active indicator dot */}
                {active && <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  safeArea: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    height: 64,
    width: "90%",
    maxWidth: 400,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default BottomTabNavigator;

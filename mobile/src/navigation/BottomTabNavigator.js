import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { useTheme } from "../theme";
import AppIcon from "../components/AppIcon";

const TAB_ITEMS = [
  { key: "Home",           label: "Accueil",   icon: "home",           accentKey: "secondary" },
  { key: "ContextReader",  label: "Context",   icon: "context",        accentKey: "warning" },
  { key: "VoiceToMeme",    label: "Voice",     icon: "voice",          accentKey: "secondary" },
  { key: "StatusRemixer",  label: "Remix",     icon: "remix",          accentKey: "primary" },
  { key: "Menu",           label: "Menu",      icon: "settings",       accentKey: "textSecondary" },
];

const BottomTabNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Contenu de l'écran */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Barre de navigation basse */}
      <SafeAreaView style={[styles.tabBarContainer, { backgroundColor: theme.backgroundSecondary, borderTopColor: theme.border }]}>
        <View style={styles.tabBar}>
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
                <View style={[
                  styles.iconBox,
                  active && { backgroundColor: `${accentColor}18`, borderColor: accentColor, borderWidth: 2 }
                ]}>
                  <AppIcon
                    name={item.icon}
                    color={active ? accentColor : theme.textSecondary}
                    size={20}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  { color: active ? accentColor : theme.textSecondary, fontWeight: active ? "900" : "700" }
                ]}>
                  {item.label}
                </Text>
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
  tabBarContainer: {
    borderTopWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBar: {
    flexDirection: "row",
    height: 65,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
    paddingTop: 8,
  },
  iconBox: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tabLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});

export default BottomTabNavigator;

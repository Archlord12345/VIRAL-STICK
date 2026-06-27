import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { spacing } from "../theme";
import { useTheme } from "../theme";
import AppIcon from "./AppIcon";

const Header = ({ title, subtitle, rightElement, onBack, onProfile }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <AppIcon name="arrow-left" color={theme.textPrimary} size={18} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        {rightElement}
        {onProfile && (
          <TouchableOpacity onPress={onProfile} style={[styles.profileBtn, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <AppIcon name="user" color={theme.textSecondary} size={18} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default Header;

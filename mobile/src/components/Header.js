import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { spacing, radius } from "../theme";
import { useTheme } from "../theme";
import AppIcon from "./AppIcon";

const Header = ({ title, subtitle, rightElement, onBack }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <AppIcon name="arrow-left" color={theme.textPrimary} size={16} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderBottomWidth: 2,
    paddingTop: 10,
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
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header;

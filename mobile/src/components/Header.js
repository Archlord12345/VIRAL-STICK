import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius } from "../theme/tokens";

const Header = ({ title, subtitle, rightElement, onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
    backgroundColor: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: colors.cloudGray,
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
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cloudGray,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.almostBlack,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.almostBlack,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: colors.silver,
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

import React, { useRef, useEffect } from "react";
import { StyleSheet, Animated } from "react-native";
import { useTheme } from "../theme";

const GlassCard = ({ children, style, animate = false, delay = 0 }) => {
  const { theme } = useTheme();
  const fade = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const ty   = useRef(new Animated.Value(animate ? 16 : 0)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.spring(ty,   { toValue: 0, delay, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, [animate, delay, fade, ty]);

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: theme.backgroundCard,
        borderColor: theme.border,
        shadowColor: theme.cardShadow.shadowColor,
        shadowOffset: theme.cardShadow.shadowOffset,
        shadowOpacity: theme.cardShadow.shadowOpacity,
        shadowRadius: theme.cardShadow.shadowRadius,
        elevation: theme.cardShadow.elevation,
      },
      style,
      { opacity: fade, transform: [{ translateY: ty }] }
    ]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
});

export default GlassCard;

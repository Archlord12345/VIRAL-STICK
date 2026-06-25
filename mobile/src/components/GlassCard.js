import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const GlassCard = ({ children, style, animate = false, delay = 0 }) => {
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
    <Animated.View style={[styles.card, style, { opacity: fade, transform: [{ translateY: ty }] }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default GlassCard;

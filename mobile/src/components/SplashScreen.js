/**
 * SplashScreen — Modern loading screen
 * Viral Stick | Design System — 2026
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
} from "react-native";
import { colors, spacing, borderRadius } from "../theme/tokens";

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 400,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={[styles.glow, { backgroundColor: colors.arch }]} />
        <View style={styles.logoPlaceholder} />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: logoOpacity }]}>
        Viral Stick
      </Animated.Text>
      
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.tagline}>Générateur IA Multimodal</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
        <Text style={styles.footerText}>KERNEL FORGE — 2026</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    opacity: 0.3,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tagline: {
    color: colors.arch,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: spacing.xxl,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});

export default SplashScreen;

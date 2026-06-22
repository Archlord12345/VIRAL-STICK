/**
 * GlassCard — Glassmorphism container component
 * General Intelligence Company Style — 2026
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme, radius, getShadow, glassStyle } from '../theme';

const GlassCard = ({
  children,
  style,
  animate = false,
  delay = 0,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      translateY.setValue(0);
    }
  }, [animate, delay]);

  const containerStyle = [
    styles.card,
    glassStyle(theme), // Uses theme-aware glassStyle
    getShadow('sm'),   // Updated shadow token
    style,
  ];

  return (
    <Animated.View
      style={[
        containerStyle,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    // borderRadius and borderWidth are handled by glassStyle
    padding: 20, // Adjusted padding to align with GIC
    overflow: 'hidden',
  },
});

export default GlassCard;

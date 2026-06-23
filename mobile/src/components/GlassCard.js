/**
 * GlassCard — Glassmorphism container component
 * Viral Stick Style — 2026
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme/tokens';

const GlassCard = ({
  children,
  style,
  animate = false,
  delay = 0,
}) => {
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

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect base
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
    padding: spacing.md,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Android elevation
    elevation: 5,
  };

  return (
    <Animated.View
      style={[
        cardStyle,
        style,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default GlassCard;

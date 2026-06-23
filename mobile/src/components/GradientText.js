/**
 * GradientText — Text component aligned with Viral Stick Design System
 * Viral Stick | Design System — 2026
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/tokens';

const GradientText = ({ 
  children, 
  style, 
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  bold = true,
  color = 'arch' // token color key
}) => {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 18 : 24,
          fontWeight: bold ? '800' : '400',
          color: colors[color] || colors.arch,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.5,
  },
});

export default GradientText;

/**
 * AnimatedButton — Premium tap button with micro-animations
 * Viral Stick | Design System — 2026
 */

import React, { useRef } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme/tokens';

const AnimatedButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',          // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 200,
      friction: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 5,
    }).start();
  };

  const getBackground = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'secondary': return colors.data;
      case 'ghost':     return 'transparent';
      case 'danger':    return colors.para;
      default:          return colors.arch; // Primary
    }
  };

  const getBorderColor = () => {
    if (variant === 'ghost') return colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    return '#FFFFFF'; // Text always white on colored buttons
  };

  const sizeStyles = {
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, fontSize: 12 },
    md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, fontSize: 14 },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: 16 },
  }[size];

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: getBackground(),
            borderColor: getBorderColor(),
            borderRadius: borderRadius.md,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            transform: [{ scale }],
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.label,
                {
                  color: getTextColor(),
                  fontSize: sizeStyles.fontSize,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
});

export default AnimatedButton;

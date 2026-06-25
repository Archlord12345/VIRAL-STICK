import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme, radius } from "../theme";

const AnimatedButton = ({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, style }) => {
  const { theme } = useTheme();
  const pressed = useRef(new Animated.Value(0)).current;

  const VARIANTS = {
    primary: { bg: theme.primary,   shadow: theme.primaryDark,  text: "#ffffff", border: theme.primary },
    green:   { bg: theme.secondary, shadow: theme.secondaryLight, text: "#ffffff", border: theme.secondary },
    ghost:   { bg: theme.backgroundCard, shadow: theme.border,  text: theme.primary, border: theme.border },
    danger:  { bg: theme.danger,    shadow: "#aa1d1d",           text: "#ffffff", border: theme.danger },
  };

  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = { sm: { v: 10, h: 16, fs: 13 }, md: { v: 14, h: 20, fs: 15 }, lg: { v: 16, h: 24, fs: 16 } }[size];

  const onIn  = () => Animated.spring(pressed, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onOut = () => Animated.spring(pressed, { toValue: 0, useNativeDriver: true, tension: 300, friction: 10 }).start();

  const translateY = pressed.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onIn} onPressOut={onOut}
    >
      <Animated.View style={[
        styles.btn,
        {
          backgroundColor: disabled ? theme.border : v.bg,
          borderColor: disabled ? theme.border : v.border,
          paddingVertical: pad.v, paddingHorizontal: pad.h,
          borderRadius: radius.md,
          shadowColor: disabled ? "#555" : v.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.9,
          shadowRadius: 0,
          elevation: 4,
          transform: [{ translateY }],
        },
        style,
      ]}>
        {loading
          ? <ActivityIndicator color={v.text} size="small" />
          : <Text style={[styles.label, { color: disabled ? theme.textMuted : v.text, fontSize: pad.fs }]}>{title}</Text>
        }
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  btn:   { alignItems: "center", justifyContent: "center", borderWidth: 2, overflow: "hidden" },
  label: { fontWeight: "800", letterSpacing: 0.4 },
});

export default AnimatedButton;

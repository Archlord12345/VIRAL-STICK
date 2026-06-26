import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme, radius } from "../theme";

const AnimatedButton = ({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, style }) => {
  const { theme } = useTheme();
  const pressed = useRef(new Animated.Value(0)).current;

  const VARIANTS = {
    primary: { bg: theme.primary,   shadow: theme.primary,  text: "#ffffff", border: theme.primaryDark },
    green:   { bg: theme.secondary, shadow: theme.secondary, text: "#ffffff", border: theme.secondaryLight },
    ghost:   { bg: "transparent", shadow: "transparent",  text: theme.textPrimary, border: theme.border },
    danger:  { bg: theme.danger,    shadow: theme.danger,           text: "#ffffff", border: theme.danger },
  };

  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = { sm: { v: 10, h: 16, fs: 13 }, md: { v: 14, h: 20, fs: 15 }, lg: { v: 16, h: 24, fs: 16 } }[size];

  const onIn  = () => Animated.spring(pressed, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onOut = () => Animated.spring(pressed, { toValue: 0, useNativeDriver: true, tension: 300, friction: 10 }).start();

  const scale = pressed.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onIn} onPressOut={onOut}
    >
      <Animated.View style={[
        styles.btn,
        {
          backgroundColor: disabled ? theme.backgroundSecondary : v.bg,
          borderColor: disabled ? theme.border : v.border,
          paddingVertical: pad.v, paddingHorizontal: pad.h,
          borderRadius: radius.pill,
          shadowColor: disabled ? "transparent" : v.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variant === 'ghost' ? 0 : 0.3,
          shadowRadius: 8,
          elevation: variant === 'ghost' ? 0 : 4,
          transform: [{ scale }],
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
  btn:   { alignItems: "center", justifyContent: "center", borderWidth: 1, overflow: "hidden" },
  label: { fontWeight: "700", letterSpacing: 0.2 }, // Plus subtil que 800
});

export default AnimatedButton;

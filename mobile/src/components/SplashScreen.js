import React, { useRef, useEffect, useState } from "react";
import { View, Animated, StatusBar, StyleSheet, Image, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Flame = ({ style, delay }) => {
  const flameAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          delay: delay,
        }),
        Animated.timing(flameAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [delay]);

  const flameScale = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.3],
  });

  const flameOpacity = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.flame, 
        style,
        { 
          transform: [{ scaleY: flameScale }],
          opacity: flameOpacity
        }
      ]} 
    />
  );
};

const SplashScreen = ({ onFinish }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    // Progress animation for 5 seconds total
    const duration = 5000;
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        clearInterval(progressInterval);
        onFinish?.();
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Animated flames */}
      <View style={styles.flameContainer}>
        {[...Array(20)].map((_, i) => (
          <Flame 
            key={i} 
            delay={i * 100}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 80}px`,
              bottom: `${Math.random() * 100}px`
            }} 
          />
        ))}
      </View>
      
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Image 
          source={require("../../assets/logo/logo_sans_fond.png")} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </Animated.View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  
  flameContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 300,
  },
  
  flame: {
    position: "absolute",
    borderRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: "transparent",
    background: "linear-gradient(to top, #ff6b35, #f7c531, transparent)",
    transformOrigin: "bottom center",
  },
  
  logoWrap: {
    marginBottom: 60,
    zIndex: 10,
  },
  
  logo: {
    width: 200,
    height: 200,
  },
  
  progressContainer: {
    width: "60%",
    maxWidth: 400,
    height: 8,
    backgroundColor: "#333333",
    borderRadius: 4,
    overflow: "hidden",
    zIndex: 10,
  },
  
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #ff6b35, #f7c531, #58cc02, #1cb0f6)",
    borderRadius: 4,
  },
});

export default SplashScreen;

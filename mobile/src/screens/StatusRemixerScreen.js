import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, StatusBar } from "react-native";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import { memeDB, statsDB } from "../services/database";
import authService from "../services/authService";

const StatusRemixerScreen = ({ navigate, route }) => {
  const { theme, isDark } = useTheme();
  const params = route?.params || {};
  const [imagePicked, setImagePicked] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [remix, setRemix]         = useState(null);
  const [msg, setMsg]             = useState("Envoie un visuel ou une intention. Je m'occupe du reste.");
  const [userData, setUserData]   = useState({ userId: null, username: null });
  const previewAnim               = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      const session = await authService.getSession();
      if (session) {
        setUserData({
          userId: session.userId,
          username: session.email ? session.email.split('@')[0] : 'User'
        });
      }
    };
    fetchUser();

    if (params.imageUrl) {
      setInitialImage(params.imageUrl);
      setImagePicked(true);
      Animated.spring(previewAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    }
  }, [params]);

  const pickImage = async (source) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true,
    };

    try {
      let result;
      if (source === 'camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Erreur', result.errorMessage || 'Impossible de sélectionner l\'image');
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setInitialImage(asset.uri);
        setImagePicked(true);
        Animated.spring(previewAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const askRemix = async () => {
    if (!imagePicked) { Alert.alert("Viral Stick", "Charge d'abord une image."); return; }
    setLoading(true); setRemix(null); setMsg("Je cherche une caption social-first...");

    try {
      const res = await axios.post(apiUrl("/api/memes/status-remixer"), {
        inputImageUrl: initialImage,
        userId: userData.userId,
        username: userData.username
      });
      setRemix(res.data);
      setMsg(res.data?.companionComment || "Remix prêt. Caption et édition alignés.");
      await saveMemeToDB(res.data);
    } catch (error) {
      console.error('[StatusRemixer] Erreur API:', error);
      setMsg("Le remix IA n'a pas répondu. Réessaie.");
    } finally { setLoading(false); }
  };

  const saveMemeToDB = async (memeData) => {
    try {
      const memeRecord = {
        id: memeData.id || `meme_${Date.now()}`,
        userId: userData.userId || 'guest',
        imageUrl: memeData.composedImageUrl || memeData.imageUrl || initialImage,
        topText: memeData.meme_text || "",
        bottomText: "",
        sourceType: 'remix',
        shareId: memeData.share?.shareId,
        publicUrl: memeData.share?.publicUrl,
        published: true,
        likes: 0,
      };
      await memeDB.saveMeme(memeRecord);
      if (userData.userId) {
        await statsDB.incrementMemesCreated(userData.userId);
        await statsDB.incrementRemixes(userData.userId);
      }
    } catch (error) {
      console.error('Erreur sauvegarde mème:', error);
    }
  };

  const handleShareWhatsApp = async () => {
    const imageUrl = remix?.composedImageUrl || remix?.share?.publicUrl || remix?.imageUrl || initialImage;
    if (imageUrl) await shareToWhatsApp(imageUrl, '');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 03 · VISUAL REMIX</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Status <Text style={{ color: theme.primary }}>Remixer</Text></Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="bio" size={96} floating message={msg} showRing={!!userData.userId} />
          </View>
        </GlassCard>

        {!imagePicked ? (
          <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Charge une image à remixer</Text>
            <View style={styles.imageSourceButtons}>
              <AnimatedButton title="📷 Caméra" onPress={() => pickImage('camera')} size="lg" style={{ flex: 1, backgroundColor: theme.primary }} />
              <AnimatedButton title="🖼️ Galerie" onPress={() => pickImage('gallery')} size="lg" style={{ flex: 1, backgroundColor: theme.secondary }} />
            </View>
          </GlassCard>
        ) : (
          <>
            <Animated.View style={{ opacity: previewAnim, transform: [{ scale: previewAnim.interpolate({ inputRange: [0,1], outputRange: [0.93,1] }) }] }}>
              <GlassCard style={styles.card}>
                <Image source={{ uri: remix?.composedImageUrl || initialImage }} style={styles.canvasImg} resizeMode="contain" />
              </GlassCard>
            </Animated.View>

            <View style={styles.actions}>
              <AnimatedButton title={loading ? "..." : "Remixer IA"} onPress={askRemix} loading={loading} disabled={loading} size="lg" style={{ flex: 1 }} />
              <AnimatedButton title="WhatsApp" onPress={handleShareWhatsApp} size="lg" style={{ flex: 1, backgroundColor: '#25D366' }} />
              <AnimatedButton title="Galerie" onPress={() => downloadImageToGallery(remix?.composedImageUrl || initialImage)} size="lg" style={{ flex: 1, backgroundColor: theme.primary }} />
            </View>

            {remix && (
              <View style={[styles.autoBadge, { backgroundColor: theme.success + '11' }]}>
                <Text style={{ color: theme.success, fontSize: 11, fontWeight: '800', textAlign: 'center' }}>✓ REMIX PUBLIÉ AUTOMATIQUEMENT SUR LE FORUM</Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  scroll:       { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:         { padding: spacing.lg, marginBottom: spacing.md },
  badge:        { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:    { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:        { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  card:         { marginBottom: spacing.md, padding: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 12, textAlign: "center" },
  canvasImg:    { width: "100%", height: 350, borderRadius: radius.md, backgroundColor: '#000' },
  imageSourceButtons: { flexDirection: "row", gap: spacing.sm },
  actions:      { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  autoBadge:    { padding: 12, borderRadius: radius.md, marginBottom: 20 },
});

export default StatusRemixerScreen;

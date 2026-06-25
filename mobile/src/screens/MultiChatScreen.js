import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import AppIcon from "../components/AppIcon";
import { COMPANIONS, COMPANION_NAMES } from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const ALL = [
  { id: "arch", name: "Archlord", role: "Cap produit" },
  { id: "data", name: "Data",     role: "Analyse" },
  { id: "para", name: "Para",     role: "Clarté UX" },
  { id: "secu", name: "Secu",     role: "Risque" },
  { id: "bio",  name: "Bio",      role: "Énergie" },
  { id: "ubu",  name: "Ubu",      role: "Humour" },
  { id: "art",  name: "Art",      role: "Visuel" },
];

const fmt = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const MultiChatScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [statuses, setStatuses]     = useState({});
  const flatRef                     = useRef(null);

  useEffect(() => { loadGreetings(); }, []);

  const loadGreetings = async () => {
    setLoading(true);
    const greets = []; const st = {};
    await Promise.all(ALL.map(async (c) => {
      st[c.id] = "loading"; setStatuses({ ...st });
      try {
        const r = await axios.post(apiUrl("/api/memes/chat/greeting"), { companionId: c.id });
        greets.push({ id: `g-${c.id}`, text: r.data.reply, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "done";
      } catch {
        greets.push({ id: `g-${c.id}`, text: `${c.name} est prêt à intervenir.`, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "done";
      }
      setStatuses({ ...st });
    }));
    greets.sort((a, b) => ALL.findIndex((c) => c.id === a.companion) - ALL.findIndex((c) => c.id === b.companion));
    setMessages(greets); setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    const now = fmt();
    setInput("");
    setMessages((p) => [...p, { id: Date.now().toString(), text: txt, sender: "user", companion: "user", time: now }]);
    setLoading(true);
    const st = {}; const replies = [];
    await Promise.all(ALL.map(async (c) => {
      st[c.id] = "loading"; setStatuses({ ...st });
      try {
        const r = await axios.post(apiUrl("/api/memes/chat"), { companionId: c.id, message: txt });
        replies.push({ id: `${Date.now()}-${c.id}`, text: r.data.reply, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "done";
      } catch {
        replies.push({ id: `${Date.now()}-${c.id}`, text: `${c.name} n'a pas pu répondre.`, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "error";
      }
      setStatuses({ ...st });
    }));
    replies.sort((a, b) => ALL.findIndex((c) => c.id === a.companion) - ALL.findIndex((c) => c.id === b.companion));
    setMessages((p) => [...p, ...replies]);
    setLoading(false);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <View style={styles.page}>
        {/* Status grid */}
        <View style={[styles.grid, { borderBottomColor: theme.border }]}>
          {ALL.map((c) => {
            const st  = statuses[c.id] || "idle";
            const col = theme.primary;
            const stColor = st === "done" ? theme.secondary : st === "loading" ? theme.warning : st === "error" ? theme.danger : theme.textMuted;
            return (
              <View key={c.id} style={[styles.statusCard, { borderColor: theme.border, backgroundColor: theme.backgroundCard }]}>
                <Image source={COMPANIONS[c.id]} style={[styles.statusAvatar, { borderColor: col }]} resizeMode="contain" />
                <Text style={[styles.statusName, { color: theme.textPrimary }]}>{COMPANION_NAMES[c.id]}</Text>
                <View style={[styles.statusDot, { backgroundColor: stColor }]} />
              </View>
            );
          })}
        </View>

        {/* Messages */}
        <FlatList
          ref={flatRef} data={messages} keyExtractor={(m) => m.id}
          renderItem={({ item }) => {
            const isUser = item.sender === "user";
            const meta   = ALL.find((c) => c.id === item.companion);
            const col    = theme.primary;
            return (
              <View style={[styles.msgRow, isUser ? styles.msgRight : styles.msgLeft]}>
                {!isUser && meta && (
                  <Image source={COMPANIONS[meta.id]} style={[styles.msgAvatar, { borderColor: col }]} resizeMode="contain" />
                )}
                <View style={[styles.msgBubble, {
                  backgroundColor: isUser ? theme.secondary : theme.backgroundCard,
                  borderColor: isUser ? theme.secondary : theme.border,
                  shadowColor: isUser ? theme.secondaryLight : "#000",
                  shadowOffset: { width: 0, height: isUser ? 3 : 2 },
                  shadowOpacity: 0.2, shadowRadius: 0, elevation: 3,
                }]}>
                  {!isUser && meta && <Text style={[styles.msgCompName, { color: col }]}>{COMPANION_NAMES[meta.id]}</Text>}
                  <Text style={[styles.msgText, { color: isUser ? "#ffffff" : theme.textPrimary }]}>{item.text}</Text>
                  <Text style={[styles.msgTime, { color: isUser ? "rgba(255,255,255,0.7)" : theme.textMuted }]}>{item.time}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ padding: spacing.md, gap: 10 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={loading ? (
            <View style={styles.loadWrap}>
              <ActivityIndicator color={theme.secondary} size="small" />
              <Text style={[styles.loadText, { color: theme.secondary }]}>Le board consolide les réponses…</Text>
            </View>
          ) : null}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
        <View style={[styles.inputBar, { backgroundColor: theme.backgroundCard, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
            value={input} onChangeText={setInput}
            placeholder="Pose une question au board..." placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendToAll} returnKeyType="send" editable={!loading}
          />
          <TouchableOpacity
            onPress={sendToAll} disabled={loading}
            style={[styles.sendBtn, {
              backgroundColor: loading ? theme.border : theme.secondary,
              shadowColor: theme.secondaryLight,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.35,
              shadowRadius: 0,
              elevation: 3
            }]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <AppIcon name="rocket" color="#ffffff" size={18} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1 },
  page:      { flex: 1, paddingTop: 0 },
  grid:      { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: spacing.md, borderBottomWidth: 2 },
  statusCard:{ width: "12.5%", minWidth: 70, alignItems: "center", gap: 5, padding: 8, borderRadius: radius.md, borderWidth: 2 },
  statusAvatar:{ width: 36, height: 36, borderRadius: 18, borderWidth: 2 },
  statusName:  { fontSize: 10, fontWeight: "900" },
  statusDot:   { width: 8, height: 8, borderRadius: 4 },
  msgRow:    { flexDirection: "row", alignItems: "flex-end", marginBottom: 2 },
  msgLeft:   { justifyContent: "flex-start" },
  msgRight:  { justifyContent: "flex-end" },
  msgAvatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, marginRight: 8 },
  msgBubble: { maxWidth: "82%", borderRadius: 14, padding: 11, borderWidth: 2 },
  msgCompName:{ fontSize: 10, fontWeight: "900", marginBottom: 4, letterSpacing: 0.4 },
  msgText:   { fontSize: 14, lineHeight: 19, fontWeight: "600" },
  msgTime:   { fontSize: 10, fontWeight: "700", marginTop: 5 },
  loadWrap:  { flexDirection: "row", alignItems: "center", gap: 8, padding: spacing.sm },
  loadText:  { fontSize: 12, fontWeight: "700" },
  inputBar:  { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: 10, borderTopWidth: 2, gap: 10 },
  input:     { flex: 1, borderWidth: 2, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14 },
  sendBtn:   { width: 46, height: 46, borderRadius: 23, justifyContent: "center", alignItems: "center" },
});

export default MultiChatScreen;

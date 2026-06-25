import React, { useEffect, useRef, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const COMPANIONS = [
  { id: "arch", name: "Archlord", role: "Cap produit" },
  { id: "data", name: "Data",     role: "Analyse" },
  { id: "para", name: "Para",     role: "Clarté UX" },
  { id: "secu", name: "Secu",     role: "Risque" },
  { id: "bio",  name: "Bio",      role: "Énergie" },
  { id: "ubu",  name: "Ubu",      role: "Humour" },
  { id: "art",  name: "Art",      role: "Visuel" },
];

const fmt = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const STATUS_STYLE = {
  idle:  { bg: colors.cloudGray,    text: colors.silver,      label: "Idle" },
  sync:  { bg: colors.sunshineYellow + "33", text: "#b38a00", label: "Sync..." },
  ready: { bg: colors.duoGreenLight, text: colors.duoGreenDark, label: "Prêt" },
  fail:  { bg: "#ffe0e0",            text: colors.danger,      label: "Erreur" },
};

const MultiChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [statuses, setStatuses] = useState({});
  const scrollRef               = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => { loadGreetings(); }, []);

  const loadGreetings = async () => {
    setLoading(true);
    const greets = [];
    const st     = {};
    await Promise.all(COMPANIONS.map(async (c) => {
      st[c.id] = "sync"; setStatuses({ ...st });
      try {
        const res = await fetch("/api/memes/chat/greeting", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companionId: c.id }),
        });
        const d = await res.json();
        greets.push({ id: `g-${c.id}`, text: d.reply, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "ready";
      } catch {
        greets.push({ id: `g-${c.id}`, text: `${c.name} est prêt à intervenir.`, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "ready";
      }
      setStatuses({ ...st });
    }));
    greets.sort((a, b) => COMPANIONS.findIndex((c) => c.id === a.companion) - COMPANIONS.findIndex((c) => c.id === b.companion));
    setMessages(greets);
    setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    setMessages((p) => [...p, { id: Date.now().toString(), text: txt, sender: "user", time: fmt() }]);
    setLoading(true);
    const st = {}; const replies = [];
    await Promise.all(COMPANIONS.map(async (c) => {
      st[c.id] = "sync"; setStatuses({ ...st });
      try {
        const res = await fetch("/api/memes/chat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companionId: c.id, message: txt }),
        });
        const d = await res.json();
        replies.push({ id: `${Date.now()}-${c.id}`, text: d.reply, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "ready";
      } catch {
        replies.push({ id: `${Date.now()}-${c.id}`, text: `${c.name} n'a pas pu répondre.`, sender: c.id, companion: c.id, time: fmt() });
        st[c.id] = "fail";
      }
      setStatuses({ ...st });
    }));
    replies.sort((a, b) => COMPANIONS.findIndex((c) => c.id === a.companion) - COMPANIONS.findIndex((c) => c.id === b.companion));
    setMessages((p) => [...p, ...replies]);
    setLoading(false);
  };

  return (
    <WebShell companion="arch" title="Multi-Hub">
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: colors.duoGreenLight, color: colors.duoGreenDark,
          padding: "5px 14px", borderRadius: radius.pill, fontSize: 13, fontWeight: 800, marginBottom: 12,
        }}>
          MULTI COMPANION BOARD
        </div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: colors.almostBlack, margin: "0 0 8px" }}>
          Les <span style={{ color: colors.duoGreen }}>7 compagnons</span> à la fois
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.graphite, margin: 0 }}>
          Une seule question, sept angles différents.
        </p>
      </div>

      {/* Status board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12, marginBottom: 24 }}>
        {COMPANIONS.map((c) => {
          const st  = statuses[c.id] || "idle";
          const sty = STATUS_STYLE[st] || STATUS_STYLE.idle;
          const col = colors[c.id] || colors.duoGreen;
          return (
            <div key={c.id} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: 16, borderRadius: radius.lg,
              border: `2px solid ${col}44`, background: `${col}0d`,
              boxShadow: "0 2px 0 #e5e5e5",
            }}>
              <CompanionAvatarWeb companion={c.id} size={48} />
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: colors.almostBlack }}>{c.name}</div>
              <div style={{
                padding: "2px 8px", borderRadius: radius.pill,
                background: sty.bg, color: sty.text,
                fontSize: 11, fontWeight: 800,
              }}>
                {sty.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone chat */}
      <div className="duo-card" style={{ display: "flex", flexDirection: "column", height: "54vh", minHeight: 400, padding: 0, overflow: "hidden" }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => {
            const isUser = m.sender === "user";
            const meta   = COMPANIONS.find((c) => c.id === m.companion);
            const col    = meta ? (colors[meta.id] || colors.duoGreen) : colors.silver;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                {!isUser && meta && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <CompanionAvatarWeb companion={meta.id} size={24} />
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, color: col }}>
                      {meta.name}
                    </span>
                  </div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "10px 16px",
                  borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: isUser ? colors.duoGreen : colors.bgSecondary,
                  border: `2px solid ${isUser ? colors.duoGreen : colors.cloudGray}`,
                  boxShadow: isUser ? `0 3px 0 ${colors.duoGreenDark}` : "0 2px 0 #e5e5e5",
                }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0,
                    color: isUser ? "#ffffff" : colors.almostBlack, fontWeight: 600,
                  }}>
                    {m.text}
                  </p>
                </div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: colors.silver, fontWeight: 600, marginTop: 3 }}>
                  {m.time}
                </span>
              </div>
            );
          })}
          {loading && (
            <div style={{ animation: "pulse 1.5s infinite", fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.silver, fontWeight: 700 }}>
              Les compagnons réfléchissent...
            </div>
          )}
        </div>

        {/* Input broadcast */}
        <div style={{ padding: "14px 20px", borderTop: `2px solid ${colors.cloudGray}`, display: "flex", gap: 10, background: colors.snowWhite }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendToAll()}
            placeholder="Pose une question à tout le board..."
            className="duo-input"
            style={{ flex: 1, borderRadius: radius.pill, padding: "10px 20px" }}
          />
          <PremiumButton onClick={sendToAll} disabled={loading || !input.trim()} variant="primary">
            Broadcast
          </PremiumButton>
        </div>
      </div>
    </WebShell>
  );
};

export default MultiChatPage;

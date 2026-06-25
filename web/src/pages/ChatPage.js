import React, { useEffect, useMemo, useRef, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const COMPANIONS = [
  { id: "arch", name: "Archlord", role: "Direction produit" },
  { id: "data", name: "Data",     role: "Support & structure" },
  { id: "para", name: "Para",     role: "Réglages & onboarding" },
  { id: "secu", name: "Secu",     role: "Sécurité & vigilance" },
  { id: "bio",  name: "Bio",      role: "Énergie visuelle" },
  { id: "ubu",  name: "Ubu",      role: "Humour & imprévu" },
  { id: "art",  name: "Art",      role: "Direction artistique" },
];

const fmt = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const ChatPage = () => {
  const [active, setActive] = useState("arch");
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef             = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    setMessages([]); setLoading(true);
    fetch("/api/memes/chat/greeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companionId: active }),
    })
      .then((r) => r.json())
      .then((d) => setMessages([{ id: 1, text: d.reply, sender: "companion", time: fmt() }]))
      .catch(()  => setMessages([{ id: 1, text: "Bonjour ! Je suis prêt.", sender: "companion", time: fmt() }]))
      .finally(() => setLoading(false));
  }, [active]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setMessages((p) => [...p, { id: Date.now(), text: txt, sender: "user", time: fmt() }]);
    setInput(""); setLoading(true);
    try {
      const res  = await fetch("/api/memes/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companionId: active, message: txt }),
      });
      const d = await res.json();
      setMessages((p) => [...p, { id: Date.now() + 1, text: d.reply, sender: "companion", time: fmt() }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + 1, text: "Je n'ai pas pu répondre pour l'instant.", sender: "companion", time: fmt() }]);
    } finally { setLoading(false); }
  };

  const activeInfo = useMemo(() => COMPANIONS.find((c) => c.id === active) || COMPANIONS[0], [active]);
  const accent     = colors[active] || colors.duoGreen;

  return (
    <WebShell companion={active} title="Companion Chat">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: colors.almostBlack, margin: "0 0 8px" }}>
          Chat <span style={{ color: accent }}>compagnons</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.graphite, margin: 0 }}>
          Choisis un compagnon et commence à discuter.
        </p>
      </div>

      {/* Sélecteur compagnons */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
        {COMPANIONS.map((c) => {
          const isActive = c.id === active;
          const col = colors[c.id] || colors.duoGreen;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: "12px 16px", borderRadius: radius.lg, cursor: "pointer",
                border: `2px solid ${isActive ? col : colors.cloudGray}`,
                background: isActive ? `${col}18` : colors.snowWhite,
                boxShadow: isActive ? `0 4px 0 ${col}44` : "0 2px 0 #e5e5e5",
                transition: "all 0.15s ease", flexShrink: 0,
                fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              }}
            >
              <CompanionAvatarWeb companion={c.id} size={44} />
              <span style={{ fontSize: 13, color: isActive ? col : colors.charcoal }}>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Zone chat */}
      <div className="duo-card" style={{ display: "flex", flexDirection: "column", height: "62vh", minHeight: 480, padding: 0, overflow: "hidden" }}>
        {/* Header compagnon actif */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 24px", borderBottom: `2px solid ${colors.cloudGray}`,
          background: `${accent}10`,
        }}>
          <CompanionAvatarWeb companion={active} size={48} />
          <div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: accent }}>{activeInfo.name}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.silver, fontWeight: 600 }}>{activeInfo.role}</div>
          </div>
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: radius.pill,
            background: colors.duoGreenLight, fontSize: 12, fontWeight: 800, color: colors.duoGreenDark,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.duoGreen, display: "inline-block" }} />
            En ligne
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                {!isUser && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <CompanionAvatarWeb companion={active} size={28} />
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: accent }}>
                      {activeInfo.name}
                    </span>
                  </div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "12px 16px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isUser ? accent : colors.bgSecondary,
                  border: `2px solid ${isUser ? accent : colors.cloudGray}`,
                  boxShadow: isUser ? `0 3px 0 ${accent}66` : "0 2px 0 #e5e5e5",
                }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: 15, lineHeight: 1.5, margin: 0,
                    color: isUser ? "#ffffff" : colors.almostBlack, fontWeight: 600,
                  }}>
                    {m.text}
                  </p>
                </div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: colors.silver, fontWeight: 600, marginTop: 4 }}>
                  {m.time}
                </span>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "pulse 1.5s infinite" }}>
              <CompanionAvatarWeb companion={active} size={28} />
              <div style={{
                background: colors.bgSecondary, border: `2px solid ${colors.cloudGray}`,
                borderRadius: "16px 16px 16px 4px", padding: "12px 20px",
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: accent, opacity: 0.5 + i * 0.2,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 20px", borderTop: `2px solid ${colors.cloudGray}`,
          display: "flex", gap: 10, alignItems: "center", background: colors.snowWhite,
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Écrire à ${activeInfo.name}…`}
            className="duo-input"
            style={{ flex: 1, borderRadius: radius.pill, padding: "10px 20px" }}
          />
          <PremiumButton onClick={sendMessage} disabled={loading || !input.trim()} variant="primary">
            Envoyer
          </PremiumButton>
        </div>
      </div>
    </WebShell>
  );
};

export default ChatPage;

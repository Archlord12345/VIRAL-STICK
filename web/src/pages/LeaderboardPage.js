import React, { useState, useEffect } from "react";
import WebShell from "../components/WebShell";
import { colors, radius } from "../theme/tokens";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/forum/leaderboard");
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const data = await res.json();
        setLeaderboard(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankColor = (index) => {
    if (index === 0) return colors.duoGreen;
    if (index === 1) return "#FFD700";
    if (index === 2) return "#CD7F32";
    return colors.cloudGray;
  };

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <WebShell companion="arch" title="Leaderboard">
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 48, color: colors.almostBlack, margin: "0 0 12px" }}>
          🏆 Top <span style={{ color: colors.duoGreen }}>Créateurs</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: colors.graphite, margin: 0 }}>
          Les légendes de Viral Stick qui dominent le game.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="loader" style={{ margin: "0 auto 20px" }}></div>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: colors.silver, fontWeight: 700 }}>Calcul des scores en cours...</p>
        </div>
      ) : (
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {leaderboard.map((user, index) => (
            <div
              key={user.userId}
              className="duo-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "16px 24px",
                borderLeft: `8px solid ${getRankColor(index)}`,
                transition: "transform 0.2s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(8px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{
                width: 56, height: 56, borderRadius: radius.full,
                background: getRankColor(index),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 900,
                color: index < 3 ? "#fff" : colors.charcoal,
                boxShadow: "0 4px 0 rgba(0,0,0,0.1)"
              }}>
                {getRankEmoji(index)}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, margin: 0, color: colors.almostBlack }}>
                  {user.username}
                </h3>
                <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: colors.silver, fontWeight: 800 }}>🖼️ {user.memesPosted} MÈMES</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ textAlign: "center", background: colors.duoGreenLight, padding: "8px 12px", borderRadius: radius.md, minWidth: 80 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: colors.duoGreenDark }}>{user.totalLikes}</div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: colors.duoGreenDark }}>LIKES</div>
                </div>
                <div style={{ textAlign: "center", background: colors.duoBlueLight, padding: "8px 12px", borderRadius: radius.md, minWidth: 80 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: colors.duoBlueDark }}>{user.totalRemixes}</div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: colors.duoBlueDark }}>REMIXES</div>
                </div>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, background: colors.bgSecondary, borderRadius: radius.xl }}>
              <p style={{ color: colors.silver, fontWeight: 700 }}>Aucune donnée pour le moment. Sois le premier à entrer dans l'histoire !</p>
            </div>
          )}
        </div>
      )}
    </WebShell>
  );
};

export default LeaderboardPage;

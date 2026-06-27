import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const AuthPage = ({ mode = "login" }) => {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
      }
      navigate("/");
    } catch (err) {
      console.error("Auth error", err);
      setError(err.message.includes("auth/user-not-found")
        ? "Utilisateur non trouvé"
        : "Erreur d'authentification. Vérifie tes identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebShell title={isLogin ? "Connexion" : "Inscription"} companion="para">
      <div style={{ maxWidth: 480, margin: "40px auto", textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ animation: "floatSoft 3s ease-in-out infinite", display: "inline-block" }}>
            <CompanionAvatarWeb companion="para" size={100} />
          </div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: colors.almostBlack, margin: "16px 0 8px" }}>
            {isLogin ? "Bon retour !" : "Rejoins l'aventure"}
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite }}>
            {isLogin ? "Connecte-toi pour retrouver tes mèmes." : "Crée un compte pour partager tes créations."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="duo-card" style={{ padding: 32, textAlign: "left" }}>
          {!isLogin && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 800, fontSize: 14, marginBottom: 8, color: colors.charcoal }}>
                NOM D'UTILISATEUR
              </label>
              <input
                type="text"
                className="duo-input"
                placeholder="Ex: Archlord"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: 14, marginBottom: 8, color: colors.charcoal }}>
              E-MAIL
            </label>
            <input
              type="email"
              className="duo-input"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: 14, marginBottom: 8, color: colors.charcoal }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              className="duo-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: colors.danger, fontWeight: 700, fontSize: 14, marginBottom: 20, textAlign: "center" }}>
              ⚠️ {error}
            </div>
          )}

          <PremiumButton
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Chargement..." : (isLogin ? "SE CONNECTER" : "CRÉER MON COMPTE")}
          </PremiumButton>

          <div style={{ marginTop: 24, textAlign: "center", borderTop: `2px solid ${colors.cloudGray}`, paddingTop: 20 }}>
            <span style={{ fontSize: 14, color: colors.silver, fontWeight: 600 }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: "none", border: "none", color: colors.duoBlue,
                fontWeight: 800, fontSize: 14, marginLeft: 8, cursor: "pointer"
              }}
            >
              {isLogin ? "CRÉER UN COMPTE" : "SE CONNECTER"}
            </button>
          </div>
        </form>
      </div>
    </WebShell>
  );
};

export default AuthPage;

import React, { useMemo, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import AppIcon from "../components/AppIcon";
import { colors } from "../theme/tokens";

const RemixPage = () => {
  const [remixText, setRemixText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [inputImageBase64, setInputImageBase64] = useState("");

  const shareText = useMemo(() => {
    if (!result) return remixText;
    const caption =
      result.meme_text ||
      [result.topText, result.bottomText].filter(Boolean).join("\n");
    return [caption, result.descriptionImage, result.companionComment]
      .filter(Boolean)
      .join("\n\n");
  }, [result, remixText]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setInputImageBase64(
        typeof reader.result === "string" ? reader.result : "",
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemix = async () => {
    if (!remixText.trim() && !inputImageBase64) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/memes/status-remixer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: remixText,
          inputImageBase64: inputImageBase64 || undefined,
          imageContext: inputImageBase64
            ? "Image uploadée depuis l'interface web"
            : undefined,
        }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          response.status === 413
            ? "Image trop lourde pour le serveur. Réduis sa taille puis réessaie."
            : "Réponse serveur invalide.",
        );
      }

      if (!response.ok) {
        throw new Error(
          response.status === 413
            ? "Image trop lourde pour le serveur. Réduis sa taille puis réessaie."
            : data?.error || "La génération du remix a échoué.",
        );
      }

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Impossible de générer le remix.");
    }
    setLoading(false);
  };

  return (
    <WebShell title="Status Remixer" companion="bio">
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 24,
        }}
      >
        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <CompanionAvatarWeb companion="bio" size={110} />
            <div>
              <h1 style={{ margin: 0, fontSize: 34 }}>Status Remixer</h1>
              <p style={{ color: colors.textSecondary }}>
                Bio transforme une scène, un status ou un visuel décrit en
                caption plus vivant, plus stylé et plus viral.
              </p>
            </div>
          </div>

          <textarea
            value={remixText}
            onChange={(e) => setRemixText(e.target.value)}
            placeholder="Décris l'image, le mood, le texte voulu ou l'énergie du sticker..."
            style={{ ...pageStyles.textarea, minHeight: 240 }}
          />

          <div style={{ marginTop: 16 }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div
            style={{
              ...pageStyles.softPanel,
              marginTop: 16,
              padding: 18,
              color: colors.textSecondary,
            }}
          >
            Le remix passe maintenant par le pipeline final `status-remixer` :
            texte, image d'entrée optionnelle, recommandations visuelles et
            image Hugging Face si disponible.
          </div>

          {error ? (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 14,
                border: `1px solid rgba(231,76,60,0.45)`,
                background: "rgba(231,76,60,0.12)",
                color: colors.danger,
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <PremiumButton
              onClick={handleRemix}
              disabled={loading || (!remixText.trim() && !inputImageBase64)}
              icon={<AppIcon name="remix" size={18} color="#fff" />}
            >
              {loading ? "Remix..." : "Créer le remix"}
            </PremiumButton>
          </div>
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <h2 style={{ marginTop: 0 }}>Aperçu du rendu</h2>
          <div style={{ ...pageStyles.softPanel, padding: 20 }}>
            <div
              style={{
                minHeight: 420,
                borderRadius: 18,
                border: `1px solid ${colors.border}`,
                background:
                  "linear-gradient(180deg, rgba(22,33,62,0.96), rgba(13,13,13,0.98))",
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {result?.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt="Remix généré"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.72,
                  }}
                />
              ) : result?.sourceImageUrl ? (
                <img
                  src={result.sourceImageUrl}
                  alt="Image source"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.45,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(13,13,13,0.1), rgba(13,13,13,0.7))",
                }}
              />
              <div style={{ fontSize: 24, fontWeight: 900, zIndex: 1 }}>
                {result?.meme_text || "TA CAPTION PRINCIPALE"}
              </div>
              <CompanionAvatarWeb companion="bio" size={180} />
              <div style={{ fontSize: 20, fontWeight: 800, zIndex: 1 }}>
                {result?.companionComment ||
                  "UN RENDU PLUS VISUEL, PLUS POSTABLE"}
              </div>
            </div>
            <p style={{ color: colors.textMuted, marginTop: 14 }}>
              {result?.descriptionImage ||
                "Le moteur produit une caption, des recommandations visuelles et une image cohérente avec le remix demandé."}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <WhatsAppShareButton
                text={shareText}
                url={window.location.href}
                label="Partager le remix sur WhatsApp"
              />
              <PremiumButton
                variant="ghost"
                icon={
                  <AppIcon
                    name="global"
                    size={18}
                    color={colors.textSecondary}
                  />
                }
              >
                Bientôt : partager au statut WhatsApp
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default RemixPage;

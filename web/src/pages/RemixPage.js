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

  const shareText = useMemo(() => {
    if (!result) return remixText;
    const caption =
      result.meme_text ||
      [result.topText, result.bottomText].filter(Boolean).join("\n");
    return [caption, result.description].filter(Boolean).join("\n\n");
  }, [result, remixText]);

  const handleRemix = async () => {
    if (!remixText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const [captionResponse, imageResponse] = await Promise.all([
        fetch("/api/memes/generate-from-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: remixText }),
        }),
        fetch("/api/memes/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: remixText }),
        }),
      ]);

      const captionData = await captionResponse.json();
      const imageData = await imageResponse.json();

      if (!captionResponse.ok && !imageResponse.ok) {
        throw new Error("La génération du remix et de l'image a échoué.");
      }

      setResult({
        ...captionData,
        ...imageData,
        meme_text:
          captionData?.meme_text ||
          [captionData?.topText, captionData?.bottomText]
            .filter(Boolean)
            .join(" · "),
      });
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

          <div
            style={{
              ...pageStyles.softPanel,
              marginTop: 16,
              padding: 18,
              color: colors.textSecondary,
            }}
          >
            Le remix combine maintenant une caption IA et une tentative de
            génération d'image via le backend.
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
              disabled={loading || !remixText.trim()}
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
                {result?.topText ||
                  result?.meme_text ||
                  "TA CAPTION PRINCIPALE"}
              </div>
              <CompanionAvatarWeb companion="bio" size={180} />
              <div style={{ fontSize: 20, fontWeight: 800, zIndex: 1 }}>
                {result?.bottomText || "UN RENDU PLUS VISUEL, PLUS POSTABLE"}
              </div>
            </div>
            <p style={{ color: colors.textMuted, marginTop: 14 }}>
              {result?.descriptionImage ||
                result?.description ||
                "Le moteur produit une caption et tente une image cohérente avec le remix demandé."}
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

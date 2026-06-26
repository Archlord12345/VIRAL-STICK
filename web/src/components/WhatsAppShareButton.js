import React from "react";
import PremiumButton from "./PremiumButton";
import AppIcon from "./AppIcon";

<<<<<<< HEAD
async function dataUrlToFile(dataUrl, filename = "viral-stick-meme.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.includes("png") ? "png" : "jpg";
  return new File([blob], filename.replace(/\.(jpg|png)$/, `.${ext}`), { type: blob.type || "image/jpeg" });
}

const WhatsAppShareButton = ({
  text,
  url,
  imageDataUrl,
  label = "Partager sur WhatsApp",
  variant = "secondary",
  style,
}) => {
  const handleShare = async () => {
    const shareText =
      url && text && !text.includes(url)
        ? [text, url].filter(Boolean).join("\n\n")
        : (text || url || "");

    if (imageDataUrl && navigator.share) {
      try {
        const file = await dataUrlToFile(imageDataUrl);
        const shareData = { title: "Viral Stick", text: text || "", files: [file] };
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
      }
    }

    const encoded = encodeURIComponent(shareText || text || url || "");
=======
const WhatsAppShareButton = ({ text, url, label = "Partager sur WhatsApp", variant = "secondary", style }) => {
  const handleShare = () => {
    const payload = [text, url].filter(Boolean).join("\n\n");
    const encoded = encodeURIComponent(payload);
>>>>>>> 9a71b9ba62fd2eb4616a0c864cc0b21c7a0ed075
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <PremiumButton
      onClick={handleShare}
      variant={variant}
      icon={<AppIcon name="chat" size={18} color="#ffffff" />}
      style={style}
    >
      {label}
    </PremiumButton>
  );
};

export default WhatsAppShareButton;

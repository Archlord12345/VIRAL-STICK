const fs = require("fs");
const path = require("path");
const os = require("os");
const { v4: uuid } = require("uuid");
const { applyMemeText } = require("./providers/sticker");
const { db } = require("../firebase");
const cloudinary = require("../cloudinary");

/**
 * Téléverse une image sur Cloudinary
 */
async function uploadToCloudinary(buffer, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "viral-stick/memes",
        public_id: fileName.split(".")[0],
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload Error:", error.message);
          return resolve(null);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function composeMemeImage({ imageUrl, imageBase64, topText = "", bottomText = "" }) {
  let buffer;
  if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  } else if (imageUrl && imageUrl.startsWith("data:")) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/s);
    if (match) {
      buffer = Buffer.from(match[2], "base64");
    }
  }

  if (!buffer) return null;

  try {
    const result = await applyMemeText(buffer, { topText, bottomText });
    return {
      buffer: result.buffer,
      dataUrl: result.dataUrl,
      mimeType: "image/jpeg"
    };
  } catch (e) {
    console.error("[composeMemeImage] Error:", e.message);
    return null;
  }
}

async function buildShareBundle({ topText, bottomText, caption, imageUrl, imageBase64, baseUrl }) {
  const composed = await composeMemeImage({
    imageUrl,
    imageBase64,
    topText,
    bottomText: bottomText || caption,
  });

  let shareId = uuid().replace(/-/g, "").slice(0, 12);
  let publicUrl = null;

  if (composed) {
    // 1. Upload sur Cloudinary (plus robuste que Firebase Storage pour les images publiques)
    const fileName = `${shareId}.jpg`;
    publicUrl = await uploadToCloudinary(composed.buffer, fileName);

    // 2. Enregistrement dans Firestore pour le Forum (toujours utilisé pour les métadonnées et likes)
    if (db) {
      try {
        await db.collection("memes").doc(shareId).set({
          shareId,
          imageUrl: publicUrl || composed.dataUrl, // Fallback dataUrl si Cloudinary échoue
          topText: topText || "",
          bottomText: bottomText || caption || "",
          likes: 0,
          createdAt: Date.now(),
        });
        console.log(`[Firestore] Mème ${shareId} enregistré avec URL Cloudinary`);
      } catch (e) {
        console.error("[Firestore] Save error:", e.message);
      }
    }
  }

  return {
    text: `${topText}\n${bottomText || caption}\n\nCréé avec Viral Stick`,
    publicUrl,
    shareId,
    imageDataUrl: composed?.dataUrl || null,
    hasImage: !!composed,
  };
}

module.exports = { buildShareBundle };

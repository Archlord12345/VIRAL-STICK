# Contrat API — Viral Stick

Ce document définit les endpoints du backend. Toutes les routes "métier" sont montées sous `/api/memes/...` dans `backend/server.js` / `backend/routes/memeRoutes.js`. Des alias historiques sans le préfixe `/memes` existent pour rester compatibles avec le contrat initial (ex: `/api/context-reader`).

## Endpoints

| Endpoint | Méthode | Entrée (body) | Sortie attendue |
| --- | --- | --- | --- |
| `/api/context-reader` (alias de `/api/memes/generate-from-text`) | POST | `{ "text": string, "location"?: string }` | `{ topText, bottomText, descriptionImage, imageUrl, imageProvider, imageFallback, companionComment, location }` |
| `/api/memes/voice-to-meme` | POST | `multipart/form-data` (champ `audio`) **ou** JSON `{ "transcription": string }` | `{ transcription, topText, bottomText, descriptionImage, imageUrl, imageProvider, imageFallback, original_transcript_subtitle, companionComment }` |
| `/api/memes/status-remixer` | POST | `{ text?, location?, imageContext?, inputImageUrl?, inputImageBase64? }` | `{ meme_text, visual_enhancements[], descriptionImage, sourceImageUrl, imageUrl, imageProvider, fallback, companionComment, location }` |
| `/api/memes/chat` | POST | `{ companionId: string, message: string, history?: array }` | `{ reply: string }` |
| `/api/memes/chat/greeting` | POST | `{ companionId: string }` | `{ reply: string }` |
| `/api/memes/generate-image` | POST | `{ prompt: string }` | `{ imageUrl, description, provider, fallback }` |
| `/api/debug/keys-status` | GET | — | `{ updatable: boolean }` — toujours disponible, indique si `/api/debug/update-keys` est actif (dev uniquement) |

> ⚠️ Note sur les champs : le format réel utilise `topText` / `bottomText` (pas `memeTexte`). Les clients (mobile, web) doivent se baser sur ces noms de champs.

> ⚠️ Note sur `/api/context-reader` : c'est un alias historique conservé pour la compatibilité du contrat ; mobile et web appellent en pratique `/api/memes/generate-from-text`, qui pointe vers le même contrôleur.

> ⚠️ Note sur `/api/memes/voice-to-meme` : la transcription réelle (Whisper via Puter) n'est utilisée que si un fichier audio est envoyé en `multipart/form-data`. Si le client envoie directement un champ JSON `transcription` (comme le fait actuellement l'écran mobile, qui n'enregistre pas encore de vrai audio), ce texte est utilisé tel quel.

## Clés API (environnement "I_AM_ELON_MUSK")

Les services IA utilisent les clés suivantes, injectées via GitHub Actions :

| Clé | Service | Fallback |
| --- | --- | --- |
| `PUTER_KEY` | Puter | Primaire (texte, chat, image, audio) |
| `MISTRAL_API_KEY` | Mistral AI | Fallback 1 |
| `DEEPSEEK_API_KEY` | DeepSeek AI | Fallback 2 |
| `GEMINI_API_KEY` | Google Gemini AI (modèle `gemini-2.5-flash`) | Fallback 3 |
| `OPENROUTER_API_KEY` | OpenRouter | Fallback 4 |

La mise à jour de ces clés via l'UI Réglages (`/api/debug/update-keys`) n'est active qu'en environnement de développement local (`NODE_ENV=development`). En production, configure-les via les variables d'environnement du serveur (Vercel / GitHub Actions).

## CI/CD

Le build Android est automatisé via `.github/workflows/android-build.yml` :

1. Vérification des clés API (Gemini, DeepSeek, Mistral)
2. Décode le keystore depuis les secrets GitHub
3. Compile APK (debug ou release) + AAB (release)
4. Upload des artefacts dans GitHub Actions

---

## Endpoints sticker (nouveaux)

| Endpoint | Méthode | Entrée | Sortie |
| --- | --- | --- | --- |
| `/api/sticker/export` | POST | `multipart/form-data` champ `sticker` (image) | `{ dataUrl, base64, width, height, provider }` |
| `/api/sticker/composite` | POST | champs `photo` + `sticker` + body `{ position, scale, offsetX, offsetY }` | `{ dataUrl, base64, width, height, stickerPosition }` |
| `/api/sticker/face` | POST | champs `sticker` + `face` + body `{ outputSize, faceRegionX/Y/W/H }` | `{ dataUrl, base64, width, height, faceRegion }` |
| `/api/sticker/meme-text` | POST | champ `image` + body `{ topText, bottomText }` | `{ dataUrl, base64, provider }` |

**Positions disponibles pour composite** : `center`, `face`, `top-left`, `top-right`, `bottom-left`, `bottom-right`

---

## Pipelines IA mis à jour

| Tâche | Provider 1 (primaire) | Provider 2 | Provider 3 | Provider 4 | Provider 5 |
| --- | --- | --- | --- | --- | --- |
| Texte / mème / chat | Gemini 2.5 Flash | Mistral | Puter | DeepSeek | OpenRouter |
| Image | Pollinations.ai (gratuit) | Pollinations Flux | Puter | — | — |
| Audio / transcription | Groq Whisper large-v3 (gratuit) | Puter Whisper | — | — | — |
| Sticker / face-swap | Sharp local (pas d'API) | — | — | — | — |

**Pollinations.ai** ne nécessite aucune clé API : `https://image.pollinations.ai/prompt/{prompt}`
**Groq** tier gratuit : 7200 sec audio/jour. Inscription : https://console.groq.com

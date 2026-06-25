/**
 * Viral Stick — API Configuration
 * Gère automatiquement l'URL selon l'environnement :
 *   - Production Vercel : https://viral-stick.vercel.app
 *   - Dev local        : http://10.0.2.2:3000  (Android emulator)
 *                        http://localhost:3000  (iOS simulator)
 */

import { Platform } from "react-native";

// ──────────────────────────────────────────────
<<<<<<< HEAD
// Mets à true si tu veux forcer le backend local
// même quand l'app est buildée en mode release.
// ──────────────────────────────────────────────
const FORCE_LOCAL = false;
=======
// Mets à true pour forcer le backend de production
// même en mode développement local.
// ──────────────────────────────────────────────
const USE_PROD_IN_DEV = true;
>>>>>>> 9a71b9ba62fd2eb4616a0c864cc0b21c7a0ed075

const PRODUCTION_URL = "https://viral-stick.vercel.app";

// Sur Android l'emulateur mappe 10.0.2.2 → localhost machine hôte
const LOCAL_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";

/**
 * Retourne l'URL complète d'un endpoint.
 * @param {string} path  - ex: "/api/memes/generate-from-text"
 * @returns {string}
 */
export function apiUrl(path = "") {
<<<<<<< HEAD
  const base = __DEV__ || FORCE_LOCAL ? LOCAL_URL : PRODUCTION_URL;
=======
  const isDev = __DEV__;
  const base = (isDev && !USE_PROD_IN_DEV) ? LOCAL_URL : PRODUCTION_URL;

>>>>>>> 9a71b9ba62fd2eb4616a0c864cc0b21c7a0ed075
  // Évite les doubles slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export default apiUrl;

/**
 * Viral Stick — Metro Configuration
 * React Native 0.75 · Hermes · DevTools intégré
 *
 * Optimisations actives :
 *  - Cache disque persistant (builds incrémentaux rapides)
 *  - React DevTools automatiquement connecté sur le port 8097
 *  - Source maps Hermes précises
 *  - Assets étendus (svg, webp, lottie…)
 *  - Resolver watchFolders pour les assets partagés
 */

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");
const os = require("os");

// ── React DevTools — connexion automatique au démarrage de Metro ──────────
// Lance le serveur devtools sur le port 8097.
// Ouvre Chrome sur http://localhost:8097 pour l'interface.
if (process.env.NODE_ENV !== "production") {
  try {
    const { connectToDevTools } = require("react-devtools-core");
    connectToDevTools({ host: "localhost", port: 8097 });
  } catch {
    // react-devtools-core absent → pas bloquant
  }
}

// ── Config personnalisée ──────────────────────────────────────────────────
const customConfig = {
  // Dossiers additionnels surveill\u00e9s (assets partagés, workspace mono-repo)
  watchFolders: [
    path.resolve(__dirname, "assets"),
    path.resolve(__dirname, "src"),
  ],

  resolver: {
    // Extensions g\u00e9r\u00e9es par Metro (ordre = priorité de résolution)
    sourceExts: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "cjs",
      "mjs",
    ],
    // Assets binaires reconnus
    assetExts: [
      // Images
      "png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "ico",
      // Vectoriel & animation
      "svg", "json",        // json couvre les fichiers Lottie
      // Polices
      "ttf", "otf", "woff", "woff2",
      // Audio / Video
      "mp3", "mp4", "wav", "aac", "m4v", "mov",
      // Divers
      "pdf", "zip",
    ],
    // Alias utiles
    extraNodeModules: {
      "@screens": path.resolve(__dirname, "src/screens"),
      "@components": path.resolve(__dirname, "src/components"),
      "@theme": path.resolve(__dirname, "src/theme"),
      "@config": path.resolve(__dirname, "src/config"),
      "@navigation": path.resolve(__dirname, "src/navigation"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },

  transformer: {
    // Source maps précises pour Hermes (améliore les stack traces)
    hermesParser: true,
    // Minification désactivée en dev pour des rebuilds plus rapides
    minifierConfig: {
      keep_fnames: true,
      mangle: { keep_fnames: true },
    },
    // Inline requires → accélère le cold start
    inlineRequires: true,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },

  server: {
    // Port Metro standard
    port: 8081,
    // Timeouts généreux pour les gros projets
    enhanceMiddleware: (middleware) => middleware,
  },

  // Cache disque persistant — évite de tout retranspiler entre deux sessions
  cacheStores: (() => {
    try {
      const { FileStore } = require("metro-cache");
      return [
        new FileStore({
          root: path.join(os.tmpdir(), "viral-stick-metro-cache"),
        }),
      ];
    } catch {
      return [];   // fallback silencieux si metro-cache absent
    }
  })(),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);

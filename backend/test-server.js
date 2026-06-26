
console.log("=== Testing modules ===");

try {
  console.log("Loading loadEnv...");
  require("./loadEnv")();
  console.log("✓ loadEnv loaded");
} catch (e) {
  console.error("✗ loadEnv failed:", e);
}

try {
  console.log("Loading firebase...");
  const firebase = require("./firebase");
  console.log("✓ firebase loaded, db available:", !!firebase.db);
} catch (e) {
  console.error("✗ firebase failed:", e);
}

try {
  console.log("Loading memeRoutes...");
  require("./routes/memeRoutes");
  console.log("✓ memeRoutes loaded");
} catch (e) {
  console.error("✗ memeRoutes failed:", e);
}

try {
  console.log("Loading stickerRoutes...");
  require("./routes/stickerRoutes");
  console.log("✓ stickerRoutes loaded");
} catch (e) {
  console.error("✗ stickerRoutes failed:", e);
}

try {
  console.log("Loading shareRoutes...");
  require("./routes/shareRoutes");
  console.log("✓ shareRoutes loaded");
} catch (e) {
  console.error("✗ shareRoutes failed:", e);
}

try {
  console.log("Loading forumRoutes...");
  require("./routes/forumRoutes");
  console.log("✓ forumRoutes loaded");
} catch (e) {
  console.error("✗ forumRoutes failed:", e);
}

console.log("=== All modules tested ===");

const express = require("express");
const app = express();
const PORT = 3000;
app.use((req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`);
});

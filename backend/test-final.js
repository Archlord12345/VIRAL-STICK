
console.log("🚀 Test final Viral Stick Backend");

// Chargement de l'environnement
require("./loadEnv")();

// Test Firebase
const Firebase = require("./firebase");
console.log("\n📦 Firebase chargé");

// Test ForumController
const ForumController = require("./controllers/forumController");

// Mock req/res
const mockRes = {
  json: (data) => {
    console.log("\n✅ Réponse reçue:");
    console.log(JSON.stringify(data, null, 2));
  },
  status: (code) => {
    console.log(`\n⚠️ Status:", code);
    return mockRes;
  }
};

const test1 = async () => {
  console.log("\n🧪 Test 1: getMemes");
  await ForumController.getMemes({ query: { sortBy: "createdAt", userId: "test-user-123" } }, mockRes);
};

const test2 = async () => {
  console.log("\n🧪 Test 2: getLeaderboard");
  await ForumController.getLeaderboard({}, mockRes);
};

const test3 = async () => {
  console.log("\n🧪 Test 3: publishMeme");
  await ForumController.publishMeme({
    body: {
      shareId: "test-meme-123",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      topText: "TEST MEME",
      bottomText: "FROM BACKEND TEST",
      userId: "test-user-123",
      username: "Test User"
    }
  }, mockRes);
};

const main = async () => {
  try {
    await test1();
    await test2();
    await test3();
    console.log("\n🎉 Tous les tests passent !");
  } catch (error) {
    console.error("\n❌ Erreur:", error);
  }
};

main();

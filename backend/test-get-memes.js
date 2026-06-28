
require("./loadEnv")();
const ForumController = require("./controllers/forumController");

console.log("\n🧪 Test getMemes()");
const mockReq = { query: { sortBy: "createdAt", userId: "test123" } };
const mockRes = {
  json: (data) => {
    console.log("\n✅ Résultat:");
    console.log("Nombre de memes:", data.length);
    console.log("Données:", JSON.stringify(data, null, 2));
  },
  status: (c) => { console.log("Status code:", c); return mockRes; }
};

ForumController.getMemes(mockReq, mockRes).then(() => {
  console.log("\n✅ Test terminé !");
}).catch((e) => {
  console.error("\n❌ Erreur:", e);
});

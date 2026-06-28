
const express = require("express");
const app = express();
require("./loadEnv")();
app.use(express.json());
app.use("/api/forum", require("./routes/forumRoutes"));
app.get("/health", (req, res) => res.send("OK"));
app.listen(3000, async () => {
  console.log("✅ Server running on http://localhost:3000");
  const ForumController = require("./controllers/forumController");
  console.log("\n🧪 Testing /api/forum/memes:");
  const mockReq = { query: { sortBy: "createdAt", userId: "test123" } };
  const mockRes = {
    json: (data) => {
      console.log("\n✅ getMemes() response:");
      console.log(data);
      process.exit(0);
    }
  };
  await ForumController.getMemes(mockReq, mockRes);
});

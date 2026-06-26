const express = require("express");
const router = express.Router();
const ForumController = require("../controllers/forumController");

router.get("/memes", ForumController.getMemes);
router.post("/like/:id", ForumController.likeMeme);

module.exports = router;

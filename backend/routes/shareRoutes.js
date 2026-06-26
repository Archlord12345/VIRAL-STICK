const express = require("express");
const router = express.Router();
const ShareController = require("../controllers/shareController");

router.post("/create", ShareController.createFromBody);
router.get("/:shareId", ShareController.getAsset);

module.exports = router;

const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const {
  sendMessage,
  getMessages
} = require("./message.controller");

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);

module.exports = router;

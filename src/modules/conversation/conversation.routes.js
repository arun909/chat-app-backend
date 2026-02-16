const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const {
  createConversation,
  getUserConversations
} = require("./conversation.controller");

router.post("/", protect, createConversation);
router.get("/", protect, getUserConversations);

module.exports = router;

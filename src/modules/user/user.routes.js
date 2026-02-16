const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const { searchUsers } = require("./user.controller");

// Get logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Search users
router.get("/search", protect, searchUsers);

module.exports = router;

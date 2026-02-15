const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware");

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;

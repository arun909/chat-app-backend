const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const {
  searchUsers,
  getProfile,
  updateProfile,
  changePassword,
  deleteProfilePic
} = require("./user.controller");
const upload = require("../../middleware/upload.middleware");

// Get logged-in user's profile
router.get("/me", protect, getProfile);

// Search users
router.get("/search", protect, searchUsers);

// Update profile (username, email, bio, profilePic)
router.patch("/profile", protect, upload.single("profilePic"), updateProfile);

// Change password (requires current password verification)
router.patch("/profile/password", protect, changePassword);

// Delete profile picture
router.delete("/profile/profile-pic", protect, deleteProfilePic);

module.exports = router;

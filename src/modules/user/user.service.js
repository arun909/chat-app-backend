const User = require("./user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const updateProfileService = async (userId, updateData) => {
  const { username, email } = updateData;

  // Only allow safe fields to be updated (no password through this endpoint)
  const allowedFields = ["username", "email", "bio", "profilePic"];
  const sanitizedData = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      sanitizedData[key] = updateData[key];
    }
  }

  // If username or email is changing, check if they are already taken
  if (username || email) {
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ username }, { email }] }
      ]
    });
    if (existingUser) {
      throw new Error("Username or Email already exists");
    }
  }

  // Find user and update with new data
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedData },
    { new: true, runValidators: true }
  ).select("-password");

  return updatedUser;
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  // Fetch user WITH password for comparison
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash and save new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  return { message: "Password changed successfully" };
};

const deleteProfilePicService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Delete the file from disk if it exists
  if (user.profilePic) {
    const filePath = path.join(__dirname, "../../../", user.profilePic);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete profile pic file:", err.message);
      }
    });
  }

  // Clear the profilePic field
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { profilePic: "" } },
    { new: true }
  ).select("-password");

  return updatedUser;
};

const searchUsersService = async (query, currentUserId) => {
  if (!query) {
    throw new Error("Search query is required");
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" },
    _id: { $ne: currentUserId }
  }).select("_id username email profilePic bio");

  return users;
};

module.exports = {
  updateProfileService,
  changePasswordService,
  deleteProfilePicService,
  searchUsersService
};

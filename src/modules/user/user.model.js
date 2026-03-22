const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    profilePic: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      maxlength: 200,
      default: ""
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster search - Redundant as unique: true already creates indexes
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;

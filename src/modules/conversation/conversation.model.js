const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    lastMessage: {
      type: String,
      default: ""
    },

    lastMessageAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate conversations between same users
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;

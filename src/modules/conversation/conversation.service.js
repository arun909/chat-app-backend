const Conversation = require("./conversation.model");

const createConversationService = async (currentUserId, otherUserId) => {
  if (!otherUserId) {
    throw new Error("Other user ID is required");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId] }
  });

  if (conversation) {
    return conversation;
  }

  // Create new conversation
  conversation = await Conversation.create({
    participants: [currentUserId, otherUserId]
  });

  return conversation;
};

const getUserConversationsService = async (currentUserId) => {
  const conversations = await Conversation.find({
    participants: currentUserId
  })
    .populate("participants", "username email profilePic")
    .sort({ updatedAt: -1 });

  return conversations;
};


module.exports = { createConversationService, getUserConversationsService };
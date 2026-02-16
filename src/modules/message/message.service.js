const Message = require("./message.model");
const Conversation = require("../conversation/conversation.model");
const { getIO } = require("../../socket");

const sendMessageService = async (senderId, conversationId, text) => {
  if (!conversationId || !text) {
    throw new Error("Conversation ID and message text are required");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text
  });

  // Update conversation
  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // Emit real-time event
  const io = getIO();
  console.log("Emitting to room:", conversationId.toString());
  io.to(conversationId.toString()).emit("receive_message", message);

  return message;
};


const getMessagesService = async (conversationId) => {
  const messages = await Message.find({
    conversation: conversationId
  })
    .populate("sender", "username email profilePic")
    .sort({ createdAt: 1 });

  return messages;
};

module.exports = {
  sendMessageService,
  getMessagesService
};

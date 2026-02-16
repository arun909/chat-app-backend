const { createConversationService } = require("./conversation.service");

const createConversation = async (req, res) => {
  try {
    const conversation = await createConversationService(
      req.user._id,
      req.body.otherUserId
    );

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const { getUserConversationsService } = require("./conversation.service");

const getUserConversations = async (req, res) => {
  try {
    const conversations = await getUserConversationsService(req.user._id);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = { createConversation, getUserConversations };
const {
  sendMessageService,
  getMessagesService
} = require("./message.service");

const sendMessage = async (req, res) => {
  try {
    const message = await sendMessageService(
      req.user._id,
      req.body.conversationId,
      req.body.text
    );

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesService(req.params.conversationId);

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages
};

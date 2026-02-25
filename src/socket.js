const jwt = require("jsonwebtoken");
const User = require("./modules/user/user.model");
const Message = require("./modules/message/message.model");

let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", // In production, restrict this to your frontend URL
    },
  });

  // JWT Middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`User connected: ${userId} (${socket.id})`);

    // Mark user as online
    await User.findByIdAndUpdate(userId, { isOnline: true });
    socket.broadcast.emit("user_status", { userId, isOnline: true });

    socket.on("join_conversation", (conversationId) => {
      console.log(`User ${userId} joining room: ${conversationId}`);
      socket.join(conversationId);
    });

    // Typing Indicators
    socket.on("typing", (conversationId) => {
      socket.to(conversationId).emit("user_typing", { conversationId, userId });
    });

    socket.on("stop_typing", (conversationId) => {
      socket.to(conversationId).emit("user_stop_typing", { conversationId, userId });
    });

    // Read Receipts
    socket.on("mark_as_read", async ({ conversationId, messageIds }) => {
      if (messageIds && messageIds.length > 0) {
        await Message.updateMany(
          { _id: { $in: messageIds }, conversation: conversationId },
          { isRead: true }
        );
        socket.to(conversationId).emit("messages_read", { conversationId, messageIds });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${userId}`);
      // Mark user as offline
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      socket.broadcast.emit("user_status", { userId, isOnline: false, lastSeen: new Date() });
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };

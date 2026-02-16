const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const conversationRoutes = require("./modules/conversation/conversation.routes");
const messageRoutes = require("./modules/message/message.routes");

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);  
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);
// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

module.exports = app;

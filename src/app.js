const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const conversationRoutes = require("./modules/conversation/conversation.routes");
const messageRoutes = require("./modules/message/message.routes");
const errorHandler = require("./middleware/error.middleware");

// Middlewares
app.use(express.json());
app.use(cors());

// Serve uploaded files (profile pictures)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
app.get("/test", (req, res) => {
  res.json({ message: "Backend working properly 🚀" });
});

// Error Handler
app.use(errorHandler);

module.exports = app;

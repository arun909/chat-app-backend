const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

module.exports = app;

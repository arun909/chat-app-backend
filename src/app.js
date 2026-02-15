const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./modules/auth/auth.routes");
// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

module.exports = app;

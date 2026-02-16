const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

const conversationId = "699301c38a7eb01965978931";

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Delay join slightly
  setTimeout(() => {
    console.log("Emitting join...");
    socket.emit("join_conversation", conversationId);
  }, 500);
});

socket.on("receive_message", (data) => {
  console.log("Message received:", data);
});

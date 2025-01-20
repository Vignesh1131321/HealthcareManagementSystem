const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000/doctor_chat", // Replace with your frontend's URL in production
    methods: ["GET", "POST"],
  },
});

// Store active users (for demonstration purposes)
const activeUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining the chat
  socket.on("join_chat", (userName) => {
    activeUsers[socket.id] = userName;
    console.log(`${userName} joined the chat.`);
    socket.broadcast.emit("user_joined", `${userName} has joined the chat.`);
  });

  // Handle receiving and broadcasting messages
  socket.on("send_message", (message) => {
    console.log("Message received:", message);
    io.emit("receive_message", message); // Broadcast message to all clients
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const userName = activeUsers[socket.id];
    if (userName) {
      console.log(`${userName} disconnected.`);
      socket.broadcast.emit("user_left", `${userName} has left the chat.`);
      delete activeUsers[socket.id];
    }
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Doctor Chat Server is running.");
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

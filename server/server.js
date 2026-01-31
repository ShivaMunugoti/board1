const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("begin", (data) => {
    console.log("Begin:", data);
    socket.broadcast.emit("begin", data);
  });

  socket.on("draw", (data) => {
    console.log("Draw:", data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear", () => {
    console.log("Clear");
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    if (!username || !room) {
      socket.emit("error", "Username and room are required");
      return;
    }

    if (!users[room]) {
      users[room] = [];
    }

    users[room].push({ id: socket.id, username });
    socket.join(room);
    console.log(`${username} has joined room: ${room}`);
    io.to(room).emit("roomMembers", {
      message: `${username} has joined the room!`,
      members: getUsersInRoom(room),
    });
  });
  socket.on("sendMessage", (sender, room, message) => {
    socket.to(room).emit("receivedMessage", {
      sender,
      room,
      message,
    });
  });

  socket.on("isTyping", ({ typer, room, typing }) => {
    io.to(room).emit("isTyping", {
      typer,
      room,
      typing,
    });
  });
  const getUsersInRoom = (room) => {
    return users[room]?.map((user) => user.username) || [];
  };

  socket.on("disconnect", () => {
    let roomName, username;

    // Find the room and user
    for (const room in users) {
      const userIndex = users[room].findIndex((user) => user.id === socket.id);
      if (userIndex !== -1) {
        username = users[room][userIndex].username;
        roomName = room;
        users[room].splice(userIndex, 1); // Remove the user from the room
        break;
      }
    }

    if (!username || !roomName) return; // If user was not registered, exit

    console.log(`${username} disconnected`);

    io.to(roomName).emit("roomMembers", {
      message: `${username} has left the room.`,
      members: getUsersInRoom(roomName),
    });

    if (users[roomName].length === 0) {
      delete users[roomName];
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

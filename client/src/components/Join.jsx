import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/context";

const Join = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const { members, setMembers } = useMyContext();
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("roomMembers", (data) => {
      if (data.members) {
        setMembers(data.members);
      }
    });
  });

  const joinRoom = () => {
    if (username && room) {
      socket.emit("joinRoom", { username, room });
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);
      setUsername("");
      setRoom("");
      navigate("/game");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Join a Room
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username} // Controlled input
            onChange={(e) => setUsername(e.target.value)} // Updates the username state
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room} // Controlled input
            onChange={(e) => setRoom(e.target.value)} // Updates the room state
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="text-center">
          <button
            onClick={joinRoom}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;

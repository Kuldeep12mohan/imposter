import { useEffect, useState, useRef } from "react";
import { useMyContext } from "../context/context";
import { socket } from "../socket/socket";

function Discussion() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [room, setRoom] = useState(localStorage.getItem("room"));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { members, setMembers } = useMyContext();
  const [isTyping, setIsTyping] = useState(false); // Use state properly
  const [typingMember, setTypingMember] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("roomMembers", (data) => {
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.members) {
        setMembers(data.members);
      }
    });

    socket.on("receivedMessage", (data) => {
      setMessages((prev) => [...prev, `${data.sender}: ${data.message}`]);
    });

    socket.on("isTyping", (data) => {
      if (data.typing && data.typer !== username) {
        setTypingMember(`${data.typer} is typing...`);
      } else {
        setTypingMember("");
      }
    });

    return () => {
      socket.off("roomMembers");
      socket.off("receivedMessage");
      socket.off("isTyping");
    };
  }, [username, setMembers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message && room) {
      socket.emit("sendMessage", { sender: username, room, message });
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
      socket.emit("isTyping", { typer: username, room, typing: false });
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0) {
      socket.emit("isTyping", { typer: username, room, typing: true });
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("isTyping", { typer: username, room, typing: false });
        setIsTyping(false);
      }, 1000);
    } else {
      socket.emit("isTyping", { typer: username, room, typing: false });
      setIsTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 w-full">
      <h1 className="text-3xl font-bold mt-6">Chat Room</h1>

      <div className="mt-6 w-full max-w-md px-4">
        <h3 className="text-xl font-semibold">Messages:</h3>
        <div className="bg-white border border-gray-300 rounded-lg p-4 h-64 overflow-y-scroll">
          {messages.map((msg, idx) => (
            <p key={idx} className="text-gray-700">
              {msg}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={handleTyping}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white p-2 rounded-r-lg hover:bg-indigo-600"
          >
            Send
          </button>
        </div>
        {typingMember && (
          <p className="mt-2 text-gray-600 italic">{typingMember}</p>
        )}
      </div>

      <div className="mt-6 w-full max-w-md px-4">
        <h3 className="text-xl font-semibold">Room Members:</h3>
        <ul className="list-disc pl-6">
          {members.map((member, idx) => (
            <li key={idx} className="text-gray-700">
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Discussion;

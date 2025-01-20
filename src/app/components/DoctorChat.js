"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Socket.IO client initialization
const socket = io("/api/doctor-chat", {
  path: "/api/doctor-chat/socket.io",
});

const DoctorChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (userName.trim()) {
      setIsLoggedIn(true);
      socket.emit("join_chat", userName);
    } else {
      alert("Please enter a username.");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: userName,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!isLoggedIn ? (
        <div>
          <h1>Welcome to Doctor Chat</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              padding: "10px",
              width: "80%",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <h1>Chat with Doctor</h1>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.map((message, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>{message.sender}</strong> <small>{message.timestamp}</small>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flexGrow: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChat;

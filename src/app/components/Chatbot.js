
"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserMd, FaMicrophone, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa"; // Add icons
import { GoogleGenerativeAI } from "@google/generative-ai";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add state for loading
  const chatBodyRef = useRef(null); // Reference for the chat body

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_CHATBOT_API_KEY);

  const fetchGeminiResponse = async (userInput) => {
    try {
/*       const recentHistory = messages
        .slice(-5)
        .map((msg) => (msg.sender === "user" ? `User: ${msg.text}` : `Bot: ${msg.text}`))
        .join("\n"); */

/*       const fullInput = `${recentHistory}`; */

      const model = genAI.getGenerativeModel({ model: "tunedModels/newtrainingdata-ewlskxr09m5j", });
      const result = await model.generateContent(userInput);

      const botResponse = result.response.text().trim().replace(/^(User:|Bot:)/g, "").trim();
      return botResponse;
    } catch (error) {
      console.error("Error fetching response from Gemini API:", error);
      return "I'm sorry, I couldn't process your request at the moment.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputText, time: timestamp },
    ]);

    setInputText("");
    setIsLoading(true); // Show typing indicator

    const botResponse = await fetchGeminiResponse(inputText);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: botResponse, time: timestamp },
    ]);
    setIsLoading(false); // Hide typing indicator after response

    // Play audio for bot response with female voice
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(botResponse);
    const voices = synth.getVoices();
    const femaleVoice = voices.find((voice) => voice.name.includes("female") && voice.lang === "en-US");
    utterThis.voice = femaleVoice || voices[0];
    synth.speak(utterThis);
  };

  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setInputText(transcript);
    };

    recognition.start();
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-body">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <FaUserMd className="header-icon" />
            <div className="header-text">
              <h3>Medical Assistant</h3>
              <p>Ask me anything about your health</p>
            </div>
          </div>
        </div>

        <div className="messages-container" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                <div className="message-icon">
                  {msg.sender === "user" ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-bubble">
                <div className="message-icon">
                  <FaRobot />
                </div>
                <div className="message-content typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer">
          <form onSubmit={handleSendMessage}>
            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
              />
              <button 
                type="button" 
                className="voice-btn"
                onClick={handleSpeechInput}
              >
                <FaMicrophone />
              </button>
              <button 
                type="submit" 
                className="send-btn"
                disabled={!inputText.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

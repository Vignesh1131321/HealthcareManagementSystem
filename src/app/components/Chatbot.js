"use client"
import React, { useState } from "react";
import "./Chatbot.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
/* import Submit from "../icons/submit.png";
import Microphone from "../icons/voice.png";
import Nurse from "../icons/nurse.png"; */
import User from "../icons/profile.png";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Chatbot(){
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const genAI = new GoogleGenerativeAI("AIzaSyCyuYOuA0RMoZBsDivYMjdJEGbPQLvWAvQ");

  const fetchGeminiResponse = async (userInput) => {
    try {
      // Extract the last few messages for context (if required)
      const recentHistory = messages
        .slice(-5) // Consider only the last 5 exchanges
        .map((msg) => (msg.sender === "user" ? `User: ${msg.text}` : `Bot: ${msg.text}`))
        .join("\n");
  
      const fullInput = `${recentHistory}\nUser: ${userInput}\nBot:` + " This is the chat history between a medical chatbot and a patient. Give the next chatbot response accordingly. Dont give the future responses or the response of the patient, just the single response of the chatbot."; // Concise input for the model
  
      const model = genAI.getGenerativeModel({ model: "tunedModels/fine-tuning-gs7z9b4bhxz9" });
      const result = await model.generateContent(fullInput);
  
      // Extract and clean the bot's response
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

    // Add user message to history
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputText, time: timestamp },
    ]);

    // Clear input
    setInputText("");

    // Fetch and add bot response
    const botResponse = await fetchGeminiResponse(inputText);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: botResponse, time: timestamp },
    ]);

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

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-md-8 col-xl-6 chat">
          <div className="card">
            <div className="card-header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img src="../icons/nurse.png" alt="Error" className="nurse-icons" />
                  <span className="online_icon"></span>
                </div>
                <div className="user_info">
                  <span>Medical Chatbot</span>
                  <p>Ask me anything!</p>
                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-${
                    msg.sender === "user" ? "end" : "start"
                  } mb-4`}
                >
                  {msg.sender === "bot" && (
                    <div className="img_cont_msg">
                      <img src="../icons/nurse.png" alt="Error" className="nurse-icons" />
                    </div>
                  )}
                  <div className={msg.sender === "user" ? "msg_cotainer_send" : "msg_cotainer"}>
                    {msg.text}
                    <span className={msg.sender === "user" ? "msg_time_send" : "msg_time"}>{msg.time}</span>
                  </div>
                  {msg.sender === "user" && (
                    <div className="img_cont_msg">
                      <img src= {"../icons/profile.png"} className="user" alt="Error" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="card-footer">
              <form onSubmit={handleSendMessage} className="input-group">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="form-control type_msg"
                  required
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    onClick={handleSpeechInput}
                    className="input-group-text send_btn"
                  >
                    <img className="icons" src="../icons/voice.png" alt="Voice Input" />
                  </button>
                  <button type="submit" className="input-group-text send_btn">
                    <img className="icons" src="../icons/submit.png" alt="Send" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

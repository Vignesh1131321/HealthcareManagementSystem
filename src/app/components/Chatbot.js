// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import "./Chatbot.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaUserMd, FaMicrophone, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa"; // Add icons
// import { GoogleGenerativeAI } from "@google/generative-ai";

// function Chatbot() {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");

//   const chatBodyRef = useRef(null); // Reference for the chat body

//   const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_CHATBOT_API_KEY);

//   const fetchGeminiResponse = async (userInput) => {
//     try {
//       const recentHistory = messages
//         .slice(-5)
//         .map((msg) => (msg.sender === "user" ? `User: ${msg.text}` : `Bot: ${msg.text}`))
//         .join("\n");

//       const fullInput = `${recentHistory}\nUser: ${userInput}\nBot: This is the chat history between a medical chatbot and a patient. Respond as the chatbot.`;

//       const model = genAI.getGenerativeModel({ model: "tunedModels/fine-tuning-gs7z9b4bhxz9" });
//       const result = await model.generateContent(fullInput);

//       const botResponse = result.response.text().trim().replace(/^(User:|Bot:)/g, "").trim();
//       return botResponse;
//     } catch (error) {
//       console.error("Error fetching response from Gemini API:", error);
//       return "I'm sorry, I couldn't process your request at the moment.";
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (inputText.trim() === "") return;

//     const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//     setMessages((prev) => [
//       ...prev,
//       { sender: "user", text: inputText, time: timestamp },
//     ]);

//     setInputText("");

//     const botResponse = await fetchGeminiResponse(inputText);
//     setMessages((prev) => [
//       ...prev,
//       { sender: "bot", text: botResponse, time: timestamp },
//     ]);
//     // Play audio for bot response with female voice
//     const synth = window.speechSynthesis;
//     const utterThis = new SpeechSynthesisUtterance(botResponse);
//     const voices = synth.getVoices();
//     const femaleVoice = voices.find((voice) => voice.name.includes("female") && voice.lang === "en-US");
//     utterThis.voice = femaleVoice || voices[0];
//     synth.speak(utterThis);
//   };


//   const handleSpeechInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.interimResults = true;
//     recognition.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0])
//         .map((result) => result.transcript)
//         .join("");
//       setInputText(transcript);
//     };

//     recognition.start();
//   };

//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     if (chatBodyRef.current) {
//       chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="chat-body">
//       <div className="chat-container">
//         <div className="chat-header">
//           <FaUserMd className="header-icon" />
//           <h3>Medical Chatbot</h3>
//           <p>How can I assist you today?</p>
//         </div>
//         <div className="chat-body" ref={chatBodyRef}> {/* Attach the ref */}
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               <div className="message-icon">
//                 {msg.sender === "user" ? <FaUser /> : <FaRobot />}
//               </div>
//               <div className="message-content">
//                 <div className="message-text">{msg.text}</div>
//                 <span className={`message-time ${msg.sender}`}>{msg.time}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="chat-footer">
//           <form onSubmit={handleSendMessage}>
//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               placeholder="Type your message..."
//             />
//             <button type="button" onClick={handleSpeechInput}>
//               <FaMicrophone />
//             </button>
//             <button type="submit">
//               <FaPaperPlane />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;



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
          <FaUserMd className="header-icon" />
          <h3>Medical Chatbot</h3>
          <p>How can I assist you today?</p>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-icon">
                {msg.sender === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <span className={`message-time ${msg.sender}`}>{msg.time}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot typing-indicator">
              <div className="message-icon">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-text">
                  <span className="dots">...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="chat-footer">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="button" onClick={handleSpeechInput}>
              <FaMicrophone />
            </button>
            <button type="submit">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

// import React, { useState } from 'react';
// import { MessageSquare, X, Send } from 'lucide-react';
// import "./pharmacychatbot.css"
// export const PharmacyChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I help you today?", isBot: true }
//   ]);
//   const [input, setInput] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, isBot: false }]);
//       // Simulate bot response
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           text: "Thanks for your message! Our AI is currently in demo mode.", 
//           isBot: true 
//         }]);
//       }, 1000);
//       setInput('');
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <button 
//         className={`chatbot-button ${isOpen ? 'active' : ''}`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
//       </button>
      
//       <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
//         <div className="chatbot-header">
//           <h3 className="text-lg font-semibold">AI Assistant</h3>
//           <button 
//             className="close-button"
//             onClick={() => setIsOpen(false)}
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <div className="chatbot-messages">
//           {messages.map((msg, idx) => (
//             <div 
//               key={idx} 
//               className={`message ${msg.isBot ? 'bot' : 'user'}`}
//             >
//               {msg.text}
//             </div>
//           ))}
//         </div>
        
//         <form onSubmit={handleSubmit} className="chatbot-input">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="message-input"
//           />
//           <button type="submit" className="send-button">
//             <Send size={20} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };


import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { FaUser, FaRobot } from 'react-icons/fa';
import "./pharmacychatbot.css"
interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const PharmacyChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: Date.now(),
    sender: 'bot',
    text: "Hello! How can I help you today?",
    time: new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    let modifiedInput;

    if (userMessage.text.toLowerCase() === 'hi' || userMessage.text.toLowerCase() === 'hello') {
      modifiedInput = userMessage.text;
    } else {
      modifiedInput = `${userMessage.text} Always answer very briefly in 2 or 3 lines along with dosage.`;
    }
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: modifiedInput }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.ok ? data.response : (data.error || "Something went wrong."),
        time: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chat:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "An unexpected error occurred.",
        time: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3 className="text-lg font-semibold">Pharmacy Assistant</h3>
          <button 
            className="close-button"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                <div className="message-icon">
                  {message.sender === "user" ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
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
          <div ref={messageEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={loading}
          />
          <button type="submit" className="send-button" disabled={!input.trim() || loading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmacyChatBot;

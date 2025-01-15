// "use client";
// import { useState,useEffect,FormEvent,useRef } from "react";
//  type Message={
//     id:number;
//     sender: "user" | "bot";
//     text: string;
//  };

//  const ChatPage=()=>{
//   const [messages,setMessages]=useState<Message[]>([]);
//   const [input,setInput]=useState("");
//   const [loading,setLoading]=useState(false);
//   const messageEndRef=useRef<HTMLDivElement>(null);

//   const scrollToBootom=()=>{
//     messageEndRef.current?.scrollIntoView({behavior:"smooth"});
//   };
//   useEffect(()=>{
//     scrollToBootom();
//   },[messages]);

//   const handleSubmit=async (e: FormEvent)=> {
//     e.preventDefault();
//     if(!input.trim()) return;
    
//     const userMessage: Message = {
//         id: Date.now(),
//         sender:"user",
//         text:input.trim(),
//     };
//     setMessages((prev)=>[...prev,userMessage]);
//     setInput("");
//     setLoading(true);
//     try {
//       const response=await fetch("/api/chat",{
//         method:"POST",
//         headers:{
//           "Content-Type":"application/json",
//         },
//         body: JSON.stringify({ message: userMessage.text}),
//       });
//       const data=await response.json();
//       if(response.ok){
//         const botMessage:Message={
//           id:Date.now()+1,
//           sender:"bot",
//           text:data.response,
//         };
//         setMessages((prev)=>[...prev,botMessage]);
//       }else{
//         const errorMessage: Meesage ={
//           id: Date.now()+1,
//           sender:"bot",
//           text: data.error||"Something went wrong.",
//         };
//         setMessages((prev)=> [...prev,errorMessage]);
//       }
      
//     } catch (error) {
//       console.error("Error fetching chat:",error);
//       const errorMessage:Message={
//         id:Date.now()+1,
//         sender:"bot",
//         text: "An unexpected error occured.",
//       };
//       setMessages((prev)=> [...prev,errorMessage]);
      
//     }finally{
//       setLoading(false);
//     }
//   };
//   return(

//   )

//  }
"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.error || "Something went wrong.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "An unexpected error occurred.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <span>{message.text}</span>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
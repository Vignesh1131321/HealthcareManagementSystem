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




// "use client";
// import { useState, useEffect, FormEvent, useRef } from "react";
// type Message = {
//   id: number;
//   sender: "user" | "bot";
//   text: string;
// };

// const ChatPage = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       sender: "user",
//       text: input.trim(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage.text }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const botMessage: Message = {
//           id: Date.now() + 1,
//           sender: "bot",
//           text: data.response,
//         };
//         setMessages((prev) => [...prev, botMessage]);
//       } else {
//         const errorMessage: Message = {
//           id: Date.now() + 1,
//           sender: "bot",
//           text: data.error || "Something went wrong.",
//         };
//         setMessages((prev) => [...prev, errorMessage]);
//       }
//     } catch (error) {
//       console.error("Error fetching chat:", error);
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: "An unexpected error occurred.",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((message) => (
//           <div key={message.id} className={`message ${message.sender}`}>
//             <span>{message.text}</span>
//           </div>
//         ))}
//         <div ref={messageEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className="input-form">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading || !input.trim()}>
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;



// "use client";

// import { useState, useEffect, FormEvent, useRef } from "react";
// import { FaUserMd, FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaTrash } from "react-icons/fa";
// import "./chat.css";
// import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
// // Define TypeScript interfaces
// interface Message {
//   id: number;
//   sender: "user" | "bot";
//   text: string;
//   time: string;
// }

// const ChatPage = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const getCurrentTime = () => {
//     return new Date().toLocaleTimeString([], { 
//       hour: "2-digit", 
//       minute: "2-digit" 
//     });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       sender: "user",
//       text: input.trim(),
//       time: getCurrentTime()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);
//     const modifiedInput = `${userMessage.text} Always answer very briefly in 2 or 3 lines.`;

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: modifiedInput }),
//       });

//       const data = await response.json();

//       const botMessage: Message = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: response.ok ? data.response : (data.error || "Something went wrong."),
//         time: getCurrentTime()
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Error fetching chat:", error);
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: "An unexpected error occurred.",
//         time: getCurrentTime()
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearHistory = () => {
//     setMessages([]);
//   };

//   return (
//     <>
//     <NavbarWrapper/>
//     <div className="chat-body">
//       <div className="chat-container">
//         <div className="chat-header">
//           <div className="header-content">
//             <FaUserMd className="header-icon" />
//             <div className="header-text">
//               <h3>Medical Assistant</h3>
//               <p>Ask me anything about your health</p>
//             </div>
//           </div>
//           <button 
//             className="clear-history-btn"
//             onClick={handleClearHistory}
//             title="Clear chat history"
//           >
//             <FaTrash />
//           </button>
//         </div>

//         <div className="messages-container">
//           {messages.map((message) => (
//             <div key={message.id} className={`message ${message.sender}`}>
//               <div className="message-bubble">
//                 <div className="message-icon">
//                   {message.sender === "user" ? <FaUser /> : <FaRobot />}
//                 </div>
//                 <div className="message-content">
//                   <p>{message.text}</p>
//                   <span className="message-time">{message.time}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {loading && (
//             <div className="message bot">
//               <div className="message-bubble">
//                 <div className="message-icon">
//                   <FaRobot />
//                 </div>
//                 <div className="message-content typing">
//                   <span className="typing-dot"></span>
//                   <span className="typing-dot"></span>
//                   <span className="typing-dot"></span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messageEndRef} />
//         </div>

//         <div className="chat-footer">
//           <form onSubmit={handleSubmit}>
//             <div className="input-container">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 disabled={loading}
//               />
//               <button 
//                 type="button" 
//                 className="voice-btn"
//                 onClick={() => {}}
//               >
//                 <FaMicrophone />
//               </button>
//               <button 
//                 type="submit" 
//                 className="send-btn"
//                 disabled={!input.trim() || loading}
//               >
//                 <FaPaperPlane />
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default ChatPage;


"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { FaUserMd, FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaTrash, FaAmbulance } from "react-icons/fa";
import "./chat.css";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { useJsApiLoader } from "@react-google-maps/api";
import Emergency from "../components/Emergency";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface UserDetails {
  _id: string;
  // Add other user properties as needed
}

interface Hospital {
  place_id: string;
  name: string;
  // Add other hospital properties as needed
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [showEmergencyPrompt, setShowEmergencyPrompt] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
  const time = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  // Emergency keywords
  const emergencyKeywords = {
    severe: [
      // Cardiac and Circulatory Emergencies
      "chest pain", "heart attack", "cardiac arrest", "stroke", 
      "severe bleeding", "profuse bleeding", "uncontrolled bleeding", 
      "internal bleeding", "high blood pressure", "hypertensive crisis",
    
      // Respiratory Emergencies
      "difficulty breathing", "shortness of breath", "can't breathe", 
      "severe asthma", "respiratory arrest", "collapsed lung",
      "choking", "anaphylaxis", "allergic reaction", "severe allergic reaction",
    
      // Neurological Emergencies
      "seizure", "unconscious", "loss of consciousness", "fainting", 
      "convulsions", "head injury", "brain injury", "traumatic brain injury", 
      "confusion", "disorientation", "slurred speech", "weakness on one side", 
      "numbness", "severe headache", "migraine with aura", 
      "sudden vision loss", "dizziness",
    
      // Trauma and Injuries
      "broken bone", "fracture", "spinal injury", "severe burn", 
      "third-degree burn", "electric shock", "amputation", 
      "penetrating wound", "stab wound", "gunshot wound",
      "fall from height", "severe pain", "trauma",
    
      // Poisoning and Overdose
      "overdose", "poisoning", "toxic ingestion", "chemical exposure", 
      "drug overdose", "alcohol poisoning", 
    
      // Mental Health Emergencies
      "suicide", "suicidal thoughts", "self-harm", "psychotic episode", 
      "violent behavior", "harming others", "mental breakdown",
    
      // Obstetric and Gynecological Emergencies
      "labor pain", "severe abdominal pain", "pregnancy complications", 
      "miscarriage", "preterm labor", "severe vaginal bleeding", 
      "eclampsia", "preeclampsia",
    
      // Pediatric Emergencies
      "child not breathing", "infant unresponsive", "blue lips", 
      "high fever in baby", "baby not feeding", "child seizure",
    
      // Infection and Sepsis
      "sepsis", "septic shock", "infection spreading", "fever not reducing", 
      "severe fever", "rash with fever", "stiff neck", "confusion with fever",
    
      // Abdominal and Digestive Emergencies
      "severe abdominal pain", "appendicitis", "intestinal blockage", 
      "vomiting blood", "blood in stool", "unable to eat or drink", 
      "jaundice", "pancreatitis",
    
      // Other Emergencies
      "severe dehydration", "heatstroke", "hypothermia", 
      "severe allergic reaction", "anaphylactic shock", 
      "loss of limb function", "paralysis", "exposure to hazardous material",
      "shot","stabbed"
    ],
    moderate: [
      // General Symptoms
      "fever", "high fever", "persistent fever", "mild fever", 
      "chills", "fatigue", "weakness", "lethargy", "low energy",
    
      // Pain and Discomfort
      "broken bone", "fracture", "severe pain", "moderate pain", 
      "persistent pain", "localized pain", "joint pain", 
      "back pain", "neck pain", "muscle pain", "abdominal pain", 
      "pelvic pain", "cramps",
    
      // Digestive Symptoms
      "continuous vomiting", "vomiting", "nausea", "diarrhea", 
      "constipation", "indigestion", "bloating", "stomach ache", 
      "loss of appetite", "acid reflux",
    
      // Head and Neurological Symptoms
      "severe headache", "headache", "migraine", "dizziness", 
      "lightheadedness", "blurred vision", "double vision", 
      "sensitivity to light",
    
      // Respiratory Symptoms
      "asthma attack", "wheezing", "coughing", "persistent cough", 
      "dry cough", "productive cough", "sore throat", "runny nose", 
      "nasal congestion", "shortness of breath after activity",
    
      // Skin Symptoms
      "rash", "hives", "itching", "swelling", "skin redness", 
      "minor burns", "cuts", "abrasions", "bruises", 
      "dry skin", "peeling skin", "blisters",
    
      // Infections and Swelling
      "infection", "swollen glands", "swelling", "redness", 
      "pus", "discharge", "earache", "sinus pain",
    
      // Minor Trauma
      "sprain", "strain", "twisted ankle", "minor injury", 
      "minor bleeding", "superficial wound",
    
      // Urinary Symptoms
      "burning sensation during urination", "frequent urination", 
      "urinary urgency", "urinary pain",
    
      // Mild Allergic Reactions
      "mild allergic reaction", "itchy eyes", "sneezing", 
      "mild swelling", "runny nose",
    
      // Pregnancy and Reproductive Symptoms
      "morning sickness", "mild cramps during pregnancy", 
      "spotting", "irregular periods", "menstrual cramps",
    
      // Emotional and Psychological Symptoms
      "anxiety", "stress", "trouble sleeping", "irritability", 
      "low mood", "feeling overwhelmed",
    
      // Other Symptoms
      "moderate dehydration", "heat exhaustion", "cold sweat", 
      "shaking", "tingling sensation", "minor chest discomfort",
      "slow healing wound"
    ]
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save to localStorage when messages update
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const checkForEmergency = (text: string) => {
    const lowercaseText = text.toLowerCase();
    
    const hasSevereSymptoms = emergencyKeywords.severe.some(keyword => 
      lowercaseText.includes(keyword)
    );
    
    const hasModerateSymptoms = emergencyKeywords.moderate.some(keyword => 
      lowercaseText.includes(keyword)
    );

    if (hasSevereSymptoms) {
      setShowEmergencyPrompt(true);
      return "emergency";
    } else if (hasModerateSymptoms) {
      return "concerning";
    }
    return "normal";
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/../api/users/me");
      if (response.ok) {
        const resData = await response.json();
        if (resData && resData.data) {
          setUserDetails(resData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Google Maps API integration
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4",
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = new google.maps.LatLng(latitude, longitude);
          fetchHospitals(currentLocation);
        },
        () => {
          console.error("Unable to fetch location");
        }
      );
    }
  };

  const fetchHospitals = (location: google.maps.LatLng) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 5000,
      keyword: "Nearest Hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const mappedHospitals: Hospital[] = results.map(result => ({
          place_id: result.place_id || '',
          name: result.name || '',
        }));
        setHospitals(mappedHospitals);
      }
    });
  };

  const handleConfirmEmergency = async () => {
    await handleAppointmentSubmit();
    setShowEmergencyPopup(true);
  };

  const handleAppointmentSubmit = async () => {
    if (!hospitals.length || !userDetails) {
      alert("No hospitals found nearby or user details not available.");
      return;
    }

    const appointmentDetails = {
      userId: userDetails._id,
      identity: "1",
      doctorId: hospitals[0].place_id,
      doctorName: hospitals[0].name,
      specialty: "",
      date: date,
      time: time,
    };

    try {
      const response = await fetch("/api/users/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }
      setShowEmergencyPopup(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const EmergencyPrompt = () => (
    <div className="emergency-prompt">
      <div className="emergency-content">
        <FaAmbulance className="emergency-icon" />
        <h3>Emergency Situation Detected</h3>
        <p>Based on your symptoms, immediate medical attention may be required.
           An ambulance will be dispatched to your location immediately.
        </p>
        <div className="emergency-buttons">
          <button 
            onClick={() => {
              handleAppointmentSubmit();
              setShowEmergencyPrompt(false); // Close immediately on booking
            }}
            className="emergency-button book"
          >
            Book Emergency Appointment
          </button>
          <button 
            onClick={() => setShowEmergencyPrompt(false)} // Close on continue chat
            className="emergency-button cancel"
          >
            Continue Chat
          </button>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: FormEvent) => {
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
    checkForEmergency(input.trim());
    const modifiedInput = `${userMessage.text} Always answer very briefly in 2 or 3 lines.`;

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
    <div className="hospital-page">
      <NavbarWrapper/>
      <div className="chat-body">
        <div className="chat-container">
          {showEmergencyPrompt && <EmergencyPrompt />}
          <div className="chat-header">
            <div className="header-content">
              <FaUserMd className="header-icon" />
              <div className="header-text">
                <h3>Medical Assistant</h3>
                <p>Ask me anything about your health</p>
              </div>
            </div>
            <button 
              className="clear-history-btn"
              onClick={handleClearHistory}
              title="Clear chat history"
            >
              <FaTrash />
            </button>
          </div>

          <div className="messages-container">
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

          <div className="chat-footer">
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>
        {showEmergencyPopup && (
          <div className="modalOverlay">
            <div className="modalContent">
              <Emergency num="2"/>
              <button
                className="closeButton"
                onClick={() => setShowEmergencyPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
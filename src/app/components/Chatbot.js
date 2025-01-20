"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import "bootstrap/dist/css/bootstrap.min.css";
import  Emergency  from "./Emergency";
import { FaUserMd, FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaTrash, FaAmbulance } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from 'next/navigation';
import { useJsApiLoader } from "@react-google-maps/api";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";


function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyPrompt, setShowEmergencyPrompt] = useState(false);

  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');  // Format: "MM/DD/YYYY" or based on locale
  const time = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  const chatBodyRef = useRef(null);
  const router = useRouter();
  
  const [contextMemory, setContextMemory] = useState({
    userPreferences: {},
    previousTopics: [], // Changed from Set to Array
    lastInteractionTime: null,
    emergencyLevel: "normal"
  });

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_CHATBOT_API_KEY);

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
      "loss of limb function", "paralysis", "exposure to hazardous material"
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

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedContext = localStorage.getItem('chatContext');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedContext) {
      const parsedContext = JSON.parse(savedContext);
      // Ensure previousTopics is always an array
      parsedContext.previousTopics = Array.isArray(parsedContext.previousTopics) 
        ? parsedContext.previousTopics 
        : [];
      setContextMemory(parsedContext);
    }
  }, []);

  // Save to localStorage whenever context or messages update
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    localStorage.setItem('chatContext', JSON.stringify(contextMemory));
  }, [messages, contextMemory]);

  const checkForEmergency = (text) => {
    const lowercaseText = text.toLowerCase();
    
    const hasSevereSymptoms = emergencyKeywords.severe.some(keyword => 
      lowercaseText.includes(keyword)
    );
    
    const hasModerateSymptoms = emergencyKeywords.moderate.some(keyword => 
      lowercaseText.includes(keyword)
    );

    if (hasSevereSymptoms) {
      return "emergency";
    } else if (hasModerateSymptoms) {
      return "concerning";
    }
    return "normal";
  };

  const updateContext = (userMessage, botResponse) => {
    const emergencyLevel = checkForEmergency(userMessage + " " + botResponse);
    setContextMemory(prevContext => {
      const newContext = { ...prevContext };
      newContext.lastInteractionTime = new Date().toISOString();
      
      // Extract and add new topics without duplicates
      const newTopics = extractTopics(userMessage);
      newContext.previousTopics = [...new Set([...prevContext.previousTopics, ...newTopics])];
      
      const preferences = extractPreferences(userMessage);
      newContext.userPreferences = {
        ...newContext.userPreferences,
        ...preferences
      };
      
      newContext.emergencyLevel = emergencyLevel;
      
      return newContext;
    });

    if (emergencyLevel === "emergency") {
      handleEmergencyPrompt();
    }
  };

  const extractTopics = (message) => {
    const topics = [];
    const commonHealthTopics = ['pain', 'symptoms', 'medication', 'diet', 'exercise'];
    
    commonHealthTopics.forEach(topic => {
      if (message.toLowerCase().includes(topic)) {
        topics.push(topic);
      }
    });
    
    return topics;
  };

  const extractPreferences = (message) => {
    const preferences = {};
    if (message.toLowerCase().includes('prefer')) {
      preferences.hasStatedPreference = true;
    }
    return preferences;
  };

  const getConversationContext = () => {
    const recentHistory = messages
      .slice(-5)
      .map((msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n");

    const contextInfo = `
Previous topics discussed: ${contextMemory.previousTopics.join(", ")}
Time since last interaction: ${
      contextMemory.lastInteractionTime 
      ? `${Math.round((new Date() - new Date(contextMemory.lastInteractionTime)) / 1000 / 60)} minutes`
      : "First interaction"
    }
Emergency Level: ${contextMemory.emergencyLevel}
    `;

    return `${contextInfo}\n\nRecent conversation:\n${recentHistory}`;
  };

  const handleEmergencyPrompt = () => {
    setShowEmergencyPrompt(true);
  };

  const handleEmergencyAction = (action) => {
    if (action === 'book') {
      /* router.push('/emergency-appointment'); */
      {/* <Emergency num = "2"/> */}
    } else if (action === 'call') {
      window.location.href = 'tel:911';
    }
    setShowEmergencyPrompt(false);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setContextMemory({
      userPreferences: {},
      previousTopics: [], // Reset to empty array
      lastInteractionTime: null,
      emergencyLevel: "normal"
    });
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatContext');
  };

  const fetchGeminiResponse = async (userInput) => {
    try {
      const conversationContext = getConversationContext();
      const fullInput = `Context: ${conversationContext}\n\nCurrent user message: ${userInput}`;

      const model = genAI.getGenerativeModel({ 
        model: "tunedModels/newtrainingdata-ewlskxr09m5j",
      });
      const result = await model.generateContent(fullInput);

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

    const timestamp = new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    const userMessage = {
      sender: "user",
      text: inputText,
      time: timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const botResponse = await fetchGeminiResponse(inputText);
    
    const botMessage = {
      sender: "bot",
      text: botResponse,
      time: timestamp
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    updateContext(inputText, botResponse);

    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(botResponse);
    const voices = synth.getVoices();
    const femaleVoice = voices.find(
      (voice) => voice.name.includes("female") && voice.lang === "en-US"
    );
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

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details... from appointment");
      
      const response = await fetch("/../api/users/me");
      
      if (response.ok) {
        const resData = await response.json();
        
        if (resData && resData.data) {
          setUserDetails(resData.data);
  
        } else {
          console.log("Failed to get user details");
        }
      } else {
        console.log("Failed to fetch user details. Server returned an error.");
      }
    } 
    catch (error) {
      console.error("Error fetching user details or health records:", error);
    }
    
  };
  useEffect(() => {
      fetchUserDetails();
    }, []);

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
            /* setMapCenter(currentLocation); */
            fetchHospitals(currentLocation);
            console.log(currentLocation);
          },
          () => {
            /* setErrorMessage("Unable to fetch your location. Please enter manually."); */
          }
        );
      } else {
        /* setErrorMessage("Geolocation is not supported by this browser."); */
      }
    };

        const fetchHospitals = (location) => {
          const service = new window.google.maps.places.PlacesService(document.createElement("div"));
      
          const request = {
            location,
            radius: 5000,
            keyword:  "Nearest Hospital", // Search by specialty
          };
      
          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setHospitals(results ?? []);
              /* setErrorMessage(""); */
            } else {
              setHospitals([]);
/*               setErrorMessage("No specialists found near the selected location.");
 */            }
          });
        };
        
      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleFindDoctorClick = () => {
        setIsModalOpen(true);
      };

      const handleConfirmEmergency = async () => {
        await handleAppointmentSubmit(); // Book appointment
        setShowEmergencyPopup(true); // Show Emergency popup
      };

      const handleAppointmentSubmit = async () => {
        if (!hospitals.length) {
          alert("No hospitals found nearby.");
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
            const error = await response.json();
            console.error("Error booking appointment:", error.message);
            alert("Failed to book appointment.");
          }
        } catch (error) {
          console.error("Error booking appointment:", error);
          alert("An error occurred while booking the appointment.");
        }
      };

  const EmergencyPrompt = () => (
    <div className="emergency-prompt">
      <div className="emergency-content">
        <FaAmbulance className="emergency-icon" />
        <h3>Emergency Situation Detected</h3>
        
        <p>Based on your symptoms, immediate medical attention may be required.</p>
        <div className="emergency-buttons">
          <button 
            onClick={() => {
              handleEmergencyAction('book'); // Call the first function
              handleConfirmEmergency(); // Call the second function
            }}
            className="emergency-button book"
          >
            Book Emergency Appointment
          </button>
          <button 
            onClick={() => {
              setShowEmergencyPrompt(false);
            }
            }
            className="emergency-button cancel"
          >
            Continue Chat
          </button>
        </div>
      </div>
      
    </div>
  );
    
  

  return (
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
      {showEmergencyPopup && (
        <div className="modalOverlay">
          <div className="modalContent">
            <Emergency num = "2"/>
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
  );
}

export default Chatbot;
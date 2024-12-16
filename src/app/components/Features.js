"use client"
import React from "react";
//import { FaRobot, FaMapMarkerAlt, FaFileMedical, FaCalendarAlt, FaAmbulance } from "react-icons/fa";
import "./Features.css";
import Image from "../icons/robot.png";
import Hospital from "../icons/hospital.png";
import Report from "../icons/medical-report.png";
import Calendar from "../icons/calendar.png"
import Ambulance from "../icons/ambulance.png"
function Features() {
  return (
    <section className="features-section">
      <h2 className="features-title">Explore Our Services</h2>
      <div className="features-grid">
        {/* Feature 1 */}
        <div className="feature-card">
          <img class = "icons" src={Image} alt="Error" />
          <h3>ManasMythri - Medical AI Chatbot</h3>
          <p>
            Chat with ManasMythri for a preliminary diagnosis of your symptoms and gain
            valuable insights into potential health concerns.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="feature-card">
          <img class = "icons" src = {Hospital} alt="Error" />
          <h3>Nearby Hospital Locator</h3>
          <p>
            Find nearby hospitals on an interactive map. Get details like names, addresses,
            and contact info based on your location.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="feature-card">
          <img src={Report} class = "icons" alt="Error" />
          <h3>Access Health Records</h3>
          <p>
            Securely access your health records, including medical history, prescriptions,
            and lab results, all in one place.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="feature-card">
          <img src={Calendar} class = "icons" alt="Error" />
          <h3>Appointment Scheduling</h3>
          <p>
            Easily book, reschedule, or cancel appointments with healthcare providers using
            our integrated scheduling system.
          </p>
        </div>
        {/* Feature 5 */}
        <div className="feature-card">
          <img src={Ambulance} class = "icons" alt="Error" />
          <h3>Emergency Services</h3>
          <p>
            Locate the nearest hospital during emergencies and notify them via AI-powered
            ambulance calling for immediate assistance.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;

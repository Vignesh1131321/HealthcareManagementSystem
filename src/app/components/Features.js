"use client";
import React from "react";
import "./Features.css";

function Features() {
  return (
    <section className="features-section">
      <h2 className="features-title">Explore Our Services</h2>
      <div className="features-grid">
        <div className="feature-card">
          <img src="/icons/robot.png" className="icons" alt="ManasMythri" />
          <h3>ManasMythri - Medical AI Chatbot</h3>
          <p>
            Chat with ManasMythri for a preliminary diagnosis of your symptoms and gain
            valuable insights into potential health concerns.
          </p>
        </div>
        <div className="feature-card">
          <img src="/icons/hospital.png" className="icons" alt="Hospital" />
          <h3>Nearby Hospital Locator</h3>
          <p>
            Find nearby hospitals on an interactive map. Get details like names, addresses,
            and contact info based on your location.
          </p>
        </div>
        <div className="feature-card">
          <img src="/icons/medical-report.png" className="icons" alt="Report" />
          <h3>Access Health Records</h3>
          <p>
            Securely access your health records, including medical history, prescriptions,
            and lab results, all in one place.
          </p>
        </div>
        <div className="feature-card">
          <img src="/icons/calendar.png" className="icons" alt="Calendar" />
          <h3>Appointment Scheduling</h3>
          <p>
            Easily book, reschedule, or cancel appointments with healthcare providers using
            our integrated scheduling system.
          </p>
        </div>
        <div className="feature-card">
          <img src="/icons/ambulance.png" className="icons" alt="Ambulance" />
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

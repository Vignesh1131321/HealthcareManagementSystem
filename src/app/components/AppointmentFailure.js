import React from "react";
import { MdClose } from "react-icons/md"; // Import the close icon
import "./AppointmentFailure.module.css";

const AppointmentFailure = ({ onClose }) => {
  return (
    <div className="modal-content">
      <div className="icon-container">
        <MdClose className="failure-icon" />
      </div>
      <h2>Appointment Failed</h2>
      <p>Unfortunately, we could not book your appointment. Please try again.</p>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default AppointmentFailure;

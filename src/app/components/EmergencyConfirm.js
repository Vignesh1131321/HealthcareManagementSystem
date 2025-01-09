import React from "react";
import styles from "./EmergencyConfirm.module.css";

const EmergencyConfirm = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  // Close modal when clicking overlay (optional)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Emergency Appointment</h2>
        <p className={styles.message}>
          Are you sure you want to book an emergency appointment at the nearest hospital? 
          An ambulance will be dispatched to your location immediately.
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            aria-label="Cancel emergency appointment"
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
            aria-label="Confirm emergency appointment"
          >
            Confirm Emergency
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyConfirm;
import React, { useEffect } from 'react';
import { X, Calendar, AlertCircle, Clock } from 'lucide-react';
import './NoMeetingModal.css';

interface NoMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoMeetingModal: React.FC<NoMeetingModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="modal-close-button"
          type="button"
          aria-label="Close modal"
        >
          <X className="close-icon" />
        </button>

        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <AlertCircle className="alert-icon" />
            <h2>No Active Meeting</h2>
          </div>

          {/* Main content */}
          <div className="modal-body">
            <p className="main-message">
              The appointment time hasn't started yet or has already ended.
            </p>

            <div className="info-box schedule-box">
              <Calendar className="info-icon" />
              <p>Please join during your scheduled appointment time</p>
            </div>

            <div className="info-box time-box">
              <Clock className="info-icon" />
              <p>Video calls are only available during scheduled appointment times</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions">
            <button 
              onClick={onClose} 
              className="action-button cancel-button"
              type="button"
            >
              Close
            </button>
            <button 
              onClick={() => {
                onClose();
                // Add navigation to appointments if needed
              }} 
              className="action-button confirm-button"
              type="button"
            >
              View Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoMeetingModal;
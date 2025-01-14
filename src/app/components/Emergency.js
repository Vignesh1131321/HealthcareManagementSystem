"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Emergency.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const AppointmentSuccessful = (num) => {
  const router = useRouter();
  const handleBackToDashboard = () => {
    router.push('/'); // Redirects to the home page
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FaCheckCircle className={styles.icon} />
        <h1 className={styles.title}>Appointment Confirmed!</h1>
        <p className={styles.message}>
          Your emergency care appointment has been successfully booked at the nearest hospital, and an ambulance will be arriving at your location shortly.
        </p>
        {num.num === "1" && (
          <button className={styles.button} onClick={handleBackToDashboard}>
            Back to Home
          </button>
        )}
        
      </div>
    </div>
  );
};

export default AppointmentSuccessful;

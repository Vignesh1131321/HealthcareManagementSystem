"use client"
import React from 'react';
import styles from './Emergency.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const AppointmentSuccessful = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FaCheckCircle className={styles.icon} />
        <h1 className={styles.title}>Appointment Confirmed!</h1>
        <p className={styles.message}>
        Your emergency care appointment has been successfully booked at the nearest hospital, and an ambulance will be arriving at your location shortly.
        </p>
        <button className={styles.button} onClick={() => window.location.href = '/dashboard'}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccessful;

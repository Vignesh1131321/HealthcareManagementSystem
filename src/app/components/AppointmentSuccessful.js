"use client"
import React from 'react';
import styles from './AppointmentSuccessful.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const AppointmentSuccessful = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FaCheckCircle className={styles.icon} />
        <h1 className={styles.title}>Appointment Confirmed!</h1>
        <p className={styles.message}>
          Your appointment has been successfully booked. Thank you for choosing our healthcare services.
        </p>
        <button className={styles.button} onClick={() => window.location.href = '/dashboard'}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccessful;

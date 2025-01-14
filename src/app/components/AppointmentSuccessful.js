"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AppointmentSuccessful.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const AppointmentSuccessful = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/');
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FaCheckCircle className={styles.icon} />
        <h1 className={styles.title}>Appointment Confirmed!</h1>
        <p className={styles.message}>
          Your appointment has been successfully booked. Thank you for choosing our healthcare services.
        </p>
        <button 
          className={styles.button} 
          onClick={handleBackToDashboard()}
          aria-label="Return to dashboard"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccessful;
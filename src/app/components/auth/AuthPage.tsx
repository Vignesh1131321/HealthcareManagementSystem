import React, { useState } from "react";
import styles from "./AuthStyles.module.css";
import { SignUpForm } from "./SignUpForm";
import { DoctorSignUp } from "./DoctorSignUp";

export const AuthPage: React.FC = () => {
  const [userType, setUserType] = useState<'user' | 'doctor'>('user');

  const handleEmailSignUp = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("An error occurred during email sign-up:", error);
    }
  };

  const handleDoctorSignUp = async (doctorData: any) => {
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Doctor registration failed.");
      }
    } catch (error) {
      console.error("An error occurred during doctor sign-up:", error);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftContent}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.headline}>Empowering Your Health Journey</h1>
            <p className={styles.subheadline}>
              Join our healthcare platform to connect, manage, and improve your well-being with expert guidance.
            </p>
          </div>

          <div className={styles.toggleContainer}>
            <div className={styles.toggleWrapper}>
              <button
                onClick={() => setUserType('user')}
                className={`${styles.toggleButton} ${
                  userType === 'user' ? styles.toggleButtonActive : ''
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className={`${styles.toggleButton} ${
                  userType === 'doctor' ? styles.toggleButtonActive : ''
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Doctor
              </button>
            </div>
          </div>

          <div className={styles.formContainer}>
            {userType === 'user' ? (
              <SignUpForm onEmailSignUp={handleEmailSignUp} />
            ) : (
              <DoctorSignUp onSubmit={handleDoctorSignUp} />
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
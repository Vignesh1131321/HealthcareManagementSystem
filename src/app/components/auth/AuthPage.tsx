import React from "react";
import styles from "./AuthStyles.module.css";
import { SignUpForm } from "./SignUpForm";

export const AuthPage: React.FC = () => {
  const handleGoogleSignUp = () => {
    // Handle Google sign up
  };

  const handleEmailSignUp = (email: string) => {
    // Handle email sign up
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftContent}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.headline}>
            Empowering Your Health Journey
            </h1>
            <p className={styles.subheadline}>
            Simplify your healthcare journey with tools to track, manage, and improve your well-being.
            </p>
          </div>
          <SignUpForm
            onGoogleSignUp={handleGoogleSignUp}
            onEmailSignUp={handleEmailSignUp}
          />
        </div>
        <img
          loading="lazy"
          src="/images/5230819.jpg"
          className={styles.heroImage}
          alt="Design creativity illustration"
        />
      </div>
    </div>
  );
};

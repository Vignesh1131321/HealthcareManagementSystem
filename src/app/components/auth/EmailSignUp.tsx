
import React, { useState } from "react";
import styles from "./AuthStyles.module.css";
import { EmailSignUpProps } from "./types";

export const EmailSignUp: React.FC<EmailSignUpProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit(username, email, password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.emailForm}>
      <div className={styles.inputWrapper}>
        <label htmlFor="username" className={styles.visuallyHidden}>
          Username
        </label>
        <input
          id="username"
          type="text"
          className={styles.emailInput}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="email" className={styles.visuallyHidden}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          className={styles.emailInput}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="password" className={styles.visuallyHidden}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.emailInput}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="confirmPassword" className={styles.visuallyHidden}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={styles.emailInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={styles.signupButton}>
        Sign up
      </button>
    </form>
  );
};

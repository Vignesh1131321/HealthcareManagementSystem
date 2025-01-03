import React from "react";
import styles from "./AuthStyles.module.css";
import { GoogleSignUpProps } from "./types";

export const GoogleSignUp: React.FC<GoogleSignUpProps> = ({ onSignUp }) => {
  return (
    <button
      className={styles.socialSignup}
      onClick={onSignUp}
      aria-label="Sign up with Google"
    >
      <div className={styles.socialSignupContent}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d9db2c249ee63c3bb536d1c87122771cfa623b5911c4c83594978d738168ecd4?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
          className={styles.socialIcon}
          alt="Google logo"
        />
        <span className={styles.socialText}>
          Sign up with your Google account
        </span>
      </div>
    </button>
  );
};

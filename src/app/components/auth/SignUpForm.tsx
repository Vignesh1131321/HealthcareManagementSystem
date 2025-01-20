
import React from "react";
import styles from "./AuthStyles.module.css";
import { EmailSignUp } from "./EmailSignUp";
import { TermsAndPrivacy } from "./TermsAndPrivacy";
import { SignUpFormProps } from "./types";

export const SignUpForm: React.FC<SignUpFormProps> = ({ onEmailSignUp }) => {
  return (
    <div className={styles.signupContainer}>
      <EmailSignUp onSubmit={onEmailSignUp} />
      <TermsAndPrivacy />
      <div className={styles.accountLink}>
        Already have an account?{" "}
        <a href="/login" className={styles.loginLink}>
          Login
        </a>
      </div>
    </div>
  );
};

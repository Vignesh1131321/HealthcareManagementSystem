import React from "react";
import styles from "./AuthStyles.module.css";
import { GoogleSignUp } from "./GoogleSignUp";
import { EmailSignUp } from "./EmailSignUp";
import { TermsAndPrivacy } from "./TermsAndPrivacy";
import { SignUpFormProps } from "./types";

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onGoogleSignUp,
  onEmailSignUp,
}) => {
  return (
    <div className={styles.signupContainer}>
      <GoogleSignUp onSignUp={onGoogleSignUp} />
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>OR</span>
        <div className={styles.dividerLine} />
      </div>
      <EmailSignUp onSubmit={onEmailSignUp} />
      <TermsAndPrivacy />
    </div>
  );
};

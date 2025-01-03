import React from "react";
import styles from "./AuthStyles.module.css";
import { TermsAndPrivacyProps } from "./types";

export const TermsAndPrivacy: React.FC<TermsAndPrivacyProps> = ({
  className,
}) => {
  return (
    <div className={`${styles.termsText} ${className || ""}`}>
      <span>By signing up, you agree to the </span>
      <a href="/terms" className={styles.termsLink}>
        Terms of use
      </a>
      <span> and </span>
      <a href="/privacy" className={styles.termsLink}>
        Privacy Policy.
      </a>
    </div>
  );
};

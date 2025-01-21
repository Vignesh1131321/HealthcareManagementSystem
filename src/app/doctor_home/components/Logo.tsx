import React from "react";
import styles from "../styles/Logo.module.css";
import { LogoProps } from "../types";

export const Logo: React.FC<LogoProps> = ({ letter, text }) => {
  return (
    <div className={styles.logoWrapper}>
      <div className={styles.logoLetter}>{letter}</div>
      <div className={styles.logoText}>{text}</div>
    </div>
  );
};

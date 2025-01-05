import React from "react";
import styles from "./Auth.module.css";
import { DividerProps } from "./types";

export const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
      <div className={styles.dividerText}>{text}</div>
      <div className={styles.dividerLine} />
    </div>
  );
};

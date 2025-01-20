
"use client"
import React from "react";
import styles from "./LeadingHealthcare.module.css";
import { LeadingHealthcareProps } from "./types";

export const LeadingHealthcare: React.FC<LeadingHealthcareProps> = ({
  imageUrl,
  title,
  description,
  buttonText,
}) => {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.imageColumn}>
          <img
            loading="lazy"
            src={imageUrl}
            className={styles.healthcareImage}
            alt="Healthcare services illustration"
          />
        </div>
        <div className={styles.contentColumn}>
          <div className={styles.contentWrapper}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>{title}</h2>
              <div className={styles.divider} />
              <p className={styles.description}>{description}</p>
            </div>
            <button
              className={styles.actionButton}
              onClick={() => {}}
              tabIndex={0}
              aria-label={buttonText}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

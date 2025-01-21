import * as React from "react";
import styles from './ServiceHeader.module.css';

interface ServiceHeaderProps {
  title: string;
  description: string;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({ title, description }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.divider} role="presentation" />
      <p className={styles.description}>{description}</p>
    </header>
  );
}
import React from "react";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import styles from "../styles/NavbarWrapper.module.css";

interface NavbarWrapperProps {
  backgroundColor?: string;
  className?: string;
}

export const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ 
  backgroundColor,
  className
}) => {
  return (
    <header 
      className={`${styles.headerContent} ${className || ''}`}
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Logo letter="M" text="MediLink" />
        </div>
        <Navigation />
      </div>
    </header>
  );
};
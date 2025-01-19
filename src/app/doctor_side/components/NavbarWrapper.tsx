import React from "react";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import styles from "../styles/NavbarWrapper.module.css";

interface NavbarWrapperProps {
  backgroundColor?: string; // Optional background color prop
}

export const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ backgroundColor }) => {
  return (
    <div 
      className={styles.headerContent} 
      style={{ backgroundColor: backgroundColor || "transparent" }} // Apply the background color passed via props
    >
      <Logo letter="M" text="MediLink" />
      <Navigation />
    </div>
  );
};
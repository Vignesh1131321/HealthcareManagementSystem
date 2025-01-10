"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Navigation.module.css";
import { NavigationItemProps } from "../types";

const navigationItems: NavigationItemProps[] = [
  { text: "Home", link: "/" },
  { text: "Find Hospitals", link: "/hospitals" },
  { text: "ManasMaitri", link: "/chatbot" },
  { text: "Profile", link: "/profile" },
];

export const Navigation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = (index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);
  const handleClick = (index: number) => setActiveIndex(index);

  return (
    <>
      <nav className={styles.nav}>
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <Link href={item.link || "#"} className={styles.navLink}>
              {item.text}
            </Link>
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isMobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => {
              handleClick(index);
              setIsMobileMenuOpen(false);
            }}
          >
            <Link href={item.link || "#"} className={styles.navLink}>
              {item.text}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
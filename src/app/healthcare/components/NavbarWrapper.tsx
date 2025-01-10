"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/NavbarWrapper.module.css"

export const NavbarWrapper = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { text: "Home", link: "/" },
    { text: "Find Hospitals", link: "/hospitals" },
    { text: "ManasMaitri", link: "/chatbot" },
    { text: "Profile", link: "/profile" },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.navbar}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logoLetter}>M</span>
              <span className={styles.logoText}>MediLink</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={styles.navLink}
              >
                {item.text}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.mobileMenuButton}
          >
            <span className={styles.srOnly}>Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className={styles.menuIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={styles.menuIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

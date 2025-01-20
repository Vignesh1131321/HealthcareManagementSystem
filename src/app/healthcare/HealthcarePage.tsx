"use client"
import React, { useState, useEffect } from "react";
import styles from "./styles/HealthcarePage.module.css";
import { Logo } from "./components/Logo";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { HeroContent } from "./components/HeroContent";
import { ServiceHeader } from "./services/ServiceHeader";
import { Services } from "./services/Services";
import { HealthcareSection } from "./aboutus/HealthcareSection";
import { Footer } from "./footer/Footer";
import { HeroContentProps } from "./types";

interface AnimatedTextProps {
  text: string;
  speed?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, speed = 45 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        const nextChar = text[currentIndex];
        setDisplayedText(prev => {
          const newText = prev + nextChar;
          return newText;
        });
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  // Split text into two parts: "Virtual healthcare for" and "you"
  const words = text.split(' ');
  const firstLine = words.slice(0, words.length - 1).join(' '); // Everything except "you"
  const secondLine = words[words.length - 1]; // Just "you"

  return (
    <div className={styles.animationContainer}>
      <div className={styles.animationWrapper}>
        {firstLine.split('').map((char, index) => (
          <span
            key={index}
            className={styles.animatedChar}
            style={{
              animationDelay: `${index * 0.05}s`,
              marginRight: char === ' ' ? '0.25em' : '0.02em'
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className={styles.animationWrapper}>
        {secondLine.split('').map((char, index) => (
          <span
            key={`second-${index}`}
            className={styles.animatedChar}
            style={{
              animationDelay: `${(firstLine.length + index) * 0.05}s`,
              marginRight: '0.02em'
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export const HealthcarePage: React.FC<HeroContentProps> = () => {
  return (
    <div className="hospital-page">
      <NavbarWrapper backgroundColor="linear-gradient(to bottom, #f8fafc, #ffffff)"/>
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.heroSection}>
            <HeroContent
              title={<AnimatedText text="Virtual healthcare for you" />}
              description="MediLink provides progressive, and affordable healthcare, accessible on mobile and online for everyone"
              buttonText="Learn More"
            />
            <div className={styles.heroImageWrapper}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e55ff247c2988b688428a10fe0cfc087b57f88bc455029154e413d38c849302f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
                alt="Healthcare service illustration"
                className={styles.heroImage}
              />
            </div>
          </div>

          <ServiceHeader
            title="Our Services"
            description="We provide the best choices for you. Adjust it to your health needs and ensure you undergo treatment with our highly qualified doctors. You can consult with us which type of service is suitable for your health."
          />
          <Services />
          <br></br>
          <br></br>
          <br></br>
          <HealthcareSection />
          <br></br>
          <br></br>
        </div>
      </div>
      <Footer />
    </div>
  );
};
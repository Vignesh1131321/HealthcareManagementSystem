

import React from "react";
import styles from "./styles/HealthcarePage.module.css";
import { Logo } from "./components/Logo";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { HeroContent } from "./components/HeroContent";
import { ServiceHeader } from "./services/ServiceHeader";
import { Services } from "./services/Services";
import {HealthcareSection} from "./aboutus/HealthcareSection"
import {Footer} from "./footer/Footer"

export const HealthcarePage: React.FC = () => {
  return (
    <>
    <NavbarWrapper/>
    <div className={styles.pageContainer}>
      {/* Header Section */}


      {/* Main Content Section */}
      <div className={styles.mainContent}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <HeroContent
           title="Empower Your Practice"
           description="Join MediLink to provide cutting-edge, accessible healthcare. Manage your patients seamlessly with our intuitive platform designed for healthcare professionals."
           buttonText="Join Now"
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

        {/* Services Section */}
        <ServiceHeader
        title="Our Services"
        description="Expand your reach with MediLink. Offer video consultations, manage online prescriptions, and schedule appointments effortlessly with your patients through our comprehensive platform."

        />
        <Services />
        <br></br>
        <br></br>
        <br></br>
        <HealthcareSection/>
        <br></br>
        <br></br>
        
        
      </div>
    </div>
    <Footer/>
    </>
  );
};

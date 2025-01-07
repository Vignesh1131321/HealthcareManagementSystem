
// import React from "react";
// import styles from "./styles/HealthcarePage.module.css";
// import { Logo } from "./components/Logo";
// import { Navigation } from "./components/Navigation";
// import { HeroContent } from "./components/HeroContent";
// import { ServiceHeader } from "./services/ServiceHeader"; // Adjust path if needed
// import { Services } from "./services/Services"; // Adjust path if needed

// export const HealthcarePage: React.FC = () => {
//   return (
//     <div className={styles.header}>
//       {/* Header Section */}
//       <div className={styles.headerContent}>
//         <Logo letter="T" text="Trafalgar" />
//         <Navigation />
//       </div>
      
//       {/* Main Content Section */}
//       <div className={styles.mainContent}>
//         <div className={styles.contentGrid}>
//           {/* Hero Content */}
//           <div className={styles.column}>
//             <HeroContent
//               title="Virtual healthcare for you"
//               description="Trafalgar provides progressive, and affordable healthcare, accessible on mobile and online for everyone"
//               buttonText="Consult today"
//             />
//           </div>
          
//           {/* Main Image */}
//           <div className={styles.column}>
//             <img
//               loading="lazy"
//               src="https://cdn.builder.io/api/v1/image/assets/TEMP/e55ff247c2988b688428a10fe0cfc087b57f88bc455029154e413d38c849302f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
//               alt="Healthcare service illustration"
//               className={styles.heroImage}
//             />
//           </div>
//         </div>
        
//         {/* Services Section */}
//         <ServiceHeader
//           title="Our Services"
//           description="We provide the best choices for you. Adjust it to your health needs and ensure you undergo treatment with our highly qualified doctors. You can consult with us which type of service is suitable for your health."
//         />
//         <Services />
//       </div>
//     </div>
//   );
// };



// import React from "react";
// import styles from "./styles/HealthcarePage.module.css";
// import { Logo } from "./components/Logo";
// import { Navigation } from "./components/Navigation";
// import { HeroContent } from "./components/HeroContent";
// import { ServiceHeader } from "./services/ServiceHeader";
// import { Services } from "./services/Services";

// export const HealthcarePage: React.FC = () => {
//   return (
//     <div className={styles.pageContainer}>
//       {/* Header Section */}
//       <div className={styles.headerContent}>
//         <Logo letter="T" text="Trafalgar" />
//         <Navigation />
//       </div>

//       {/* Main Content Section */}
//       <div className={styles.mainContent}>
//         {/* Hero Section */}
//         <HeroContent
//           title="Virtual healthcare for you"
//           description="Trafalgar provides progressive, and affordable healthcare, accessible on mobile and online for everyone"
//           buttonText="Consult today"
//         />
//         <div className={styles.heroImageWrapper}>
//           <img
//             loading="lazy"
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/e55ff247c2988b688428a10fe0cfc087b57f88bc455029154e413d38c849302f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
//             alt="Healthcare service illustration"
//             className={styles.heroImage}
//           />
//         </div>

//         {/* Services Section */}
//         <ServiceHeader
//           title="Our Services"
//           description="We provide the best choices for you. Adjust it to your health needs and ensure you undergo treatment with our highly qualified doctors. You can consult with us which type of service is suitable for your health."
//         />
//         <Services />
//       </div>
//     </div>
//   );
// };



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
            title="Virtual healthcare for you"
            description="Trafalgar provides progressive, and affordable healthcare, accessible on mobile and online for everyone"
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

        {/* Services Section */}
        <ServiceHeader
          title="Our Services"
          description="We provide the best choices for you. Adjust it to your health needs and ensure you undergo treatment with our highly qualified doctors. You can consult with us which type of service is suitable for your health."
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

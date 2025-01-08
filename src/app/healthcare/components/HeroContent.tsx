// import React from "react";
// import styles from "../styles/HeroContent.module.css";
// import { HeroContentProps } from "../types";

// export const HeroContent: React.FC<HeroContentProps> = ({
//   title,
//   description,
//   buttonText,
// }) => {
//   return (
//     <div className={styles.contentWrapper}>
//       <img
//         loading="lazy"
//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c01ee420af001b0d0d5f13258745692c5786bf47cd67aeae420323590267b62?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
//         alt="Healthcare illustration"
//         className={styles.decorativeImage}
//       />
//       <div>
//         <h1 className={styles.title}>{title}</h1>
//         <p className={styles.description}>{description}</p>
//         <button className={styles.ctaButton}>{buttonText}</button>
//       </div>
//     </div>
//   );
// };



// import React from "react";
// import styles from "../styles/HeroContent.module.css";
// import { HeroContentProps } from "../types";
// export const HeroContent: React.FC<HeroContentProps> = ({
//   title,
//   description,
//   buttonText,
// }) => {
//   return (
//     <div className={styles.contentWrapper}>
//       {/* Decorative image */}
//       <img
//         loading="lazy"
//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c01ee420af001b0d0d5f13258745692c5786bf47cd67aeae420323590267b62?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
//         alt="Healthcare decorative"
//         className={styles.decorativeImage}
//       />
//       {/* Main content */}
//       <div>
//         <h1 className={styles.title}>{title}</h1>
//         <p className={styles.description}>{description}</p>
//         <button className={styles.ctaButton}>{buttonText}</button>
//       </div>
//     </div>
//   );
// };



import React from "react";
import styles from "../styles/HeroContent.module.css";
import { HeroContentProps } from "../types";

export const HeroContent: React.FC<HeroContentProps> = ({
  title,
  description,
  buttonText,
}) => {
  return (
    <div className={styles.contentWrapper}>
      {/* Decorative image */}
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c01ee420af001b0d0d5f13258745692c5786bf47cd67aeae420323590267b62?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
        alt="Healthcare decorative"
        className={styles.decorativeImage}
      />
      {/* Main content */}
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <button className={styles.ctaButton}>{buttonText}</button>
      </div>
    </div>
  );
};

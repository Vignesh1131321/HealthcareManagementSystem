

import React from "react";
import { ServiceCardProps } from "./types";
import styles from "./Services.module.css";

export const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  onClick, // Destructure onClick prop
}) => {
  return (
    <div className={styles.serviceCard} onClick={onClick}> {/* Apply onClick here */}
      <img
        loading="lazy"
        src={imageSrc}
        alt={imageAlt}
        className={styles.serviceIcon}
      />
      <h3 className={styles.serviceTitle}>{title}</h3>
      <p className={styles.serviceDescription}>{description}</p>
    </div>
  );
};


// import React from "react";
// import { ServiceCardProps } from "./types";
// import styles from "./Services.module.css";

// export const ServiceCard: React.FC<ServiceCardProps> = ({
//   imageSrc,
//   imageAlt,
//   title,
//   description,
//   icon: Icon,  // Renamed to Icon to make it clearer
//   onClick, // Destructure onClick prop
// }) => {
//   return (
//     <div className={styles.serviceCard} onClick={onClick}> {/* Apply onClick here */}
//       {/* Render the icon if it exists */}
//       {Icon ? (
//         <div className={styles.iconWrapper}>
//           <Icon className={styles.serviceIcon} /> {/* Render the icon component */}
//         </div>
//       ) : (
//         <img
//           loading="lazy"
//           src={imageSrc}
//           alt={imageAlt}
//           className={styles.serviceIcon}
//         />
//       )}
//       <h3 className={styles.serviceTitle}>{title}</h3>
//       <p className={styles.serviceDescription}>{description}</p>
//     </div>
//   );
// };

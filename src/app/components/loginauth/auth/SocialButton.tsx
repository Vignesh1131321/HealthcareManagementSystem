// import React from "react";
// import styles from "./Auth.module.css";
// import { SocialButtonProps } from "./types";

// export const SocialButton: React.FC<SocialButtonProps> = ({
//   icon,
//   text,
//   onClick,
// }) => {
//   return (
//     <button className={styles.socialButton} onClick={onClick}>
//       <div className={styles.socialButtonContent}>
//         <img src={icon} alt="" className={styles.socialIcon} />
//         <span className={styles.socialText}>{text}</span>
//       </div>
//     </button>
//   );
// };
import React from "react";
import styles from "./Auth.module.css";
import { SocialButtonProps } from "./types";

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
}) => {
  return (
    <button className={styles.socialButton} onClick={onClick}>
      <div className={styles.socialButtonContent}>
        <img src={icon} alt="" className={styles.socialIcon} />
        <span className={styles.socialText}>{text}</span>
      </div>
    </button>
  );
};

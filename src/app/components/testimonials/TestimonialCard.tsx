import React from "react";
import styles from "./TestimonialCard.module.css";
import { TestimonialCardProps } from "./types";
import { FaUser } from "react-icons/fa";

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  data,
  size,
}) => {
  const isLarge = size === "large";

  return (
    <div className={styles.testimonialCard}>
      <img
        loading="lazy"
        src={
          isLarge
            ? "https://cdn.builder.io/api/v1/image/assets/TEMP/534df00a10846f365ce4da933ffb6a1bede4e9c054b64cf20a43c53d9b37149c?placeholderIfAbsent=true&apiKey=b9a076070502440993b3c21301b2e338"
            : "https://cdn.builder.io/api/v1/image/assets/TEMP/9b499cb1e0d1ccbaed79a32e70593ce7cd4bc2a7bf357fcb3f173c90124a3a9b?placeholderIfAbsent=true&apiKey=b9a076070502440993b3c21301b2e338"
        }
        className={styles.cardBackground}
        alt=""
      />
      <div className={styles.cardContent}>
        <div className={`${styles.avatarWrapper} ${isLarge ? styles.avatarLarge : styles.avatarSmall}`}>
          <FaUser className={`${styles.avatarIcon} ${isLarge ? styles.avatarLarge : styles.avatarSmall}`} />
      </div>
        <div
          className={`${styles.name} ${
            isLarge ? styles.nameLarge : styles.nameSmall
          }`}
        >
          {data.author}
        </div>
        <div className={styles.role}>{data.text}</div>
        <img
          loading="lazy"
          src={data.rating}
          className={`${styles.rating} ${
            isLarge ? styles.ratingLarge : styles.ratingSmall
          }`}
          alt="Rating stars"
        />
        <div className={`${styles.quote} ${isLarge ? styles.quoteLarge : ""}`}>
         
        </div>
      </div>
    </div>
  );
};

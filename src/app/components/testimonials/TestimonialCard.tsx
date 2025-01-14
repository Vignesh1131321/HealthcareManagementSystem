import React from "react";
import styles from "./TestimonialCard.module.css";
import { FaUserCircle, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface TestimonialCardProps {
  data: {
    author: string;
    text: string;
    rating: string;
  };
  size: "large" | "small";
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  data,
  size,
}) => {
  const isLarge = size === "large";

  // Helper function to render stars based on the rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className={styles.star} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      } else {
        stars.push(<FaRegStar key={i} className={styles.star} />);
      }
    }
    return stars;
  };

  return (
    <div 
      className={styles.testimonialCard}
      style={{
        height: '100%',
        zIndex: 1
      }}
    >
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
        <div
          className={`${styles.avatarWrapper} ${
            isLarge ? styles.avatarSmall : styles.avatarSmall
          }`}
        >
          <FaUserCircle
            className={`${styles.avatarIcon} ${
              isLarge ? styles.avatarLarge : styles.avatarLarge
            }`}
          />
        </div>
        <div
          className={`${styles.name} ${
            isLarge ? styles.nameSmall : styles.nameSmall
          }`}
        >
          {data.author}
        </div>
        <div className={styles.role}>
          {data.text}
        </div>
        <div
          className={`${styles.rating} ${
            isLarge ? styles.ratingLarge : styles.ratingLarge
          }`}
        >
          {renderStars(parseFloat(data.rating))}
        </div>
      </div>
    </div>
  );
};
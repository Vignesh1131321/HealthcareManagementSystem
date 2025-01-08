import React from 'react';
import styles from './TestimonialSection.module.css';
import { TestimonialCard } from './TestimonialCard';
import { testimonials } from './testimonialData';

export const TestimonialSection: React.FC = () => {
  return (
    <section className={styles.testimonialSection}>
{/*       <div className={styles.header}>
        <h2>What Our Clients Say About Us</h2>
        <div className={styles.navigationDots}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === 0 ? styles.active : ''}`}
            />
          ))}
        </div>
      </div> */}

      <div className={styles.testimonialGrid}>
        <div className={styles.navigationArrows}>
          <div className={styles.arrow}>←</div>
          <div className={styles.arrow}>→</div>
        </div>

        <div className={styles.columnLarge}>
          <div className={styles.innerGrid}>
            <div className={styles.innerColumnLeft}>
              <TestimonialCard data={testimonials[0]} size="small" />
            </div>
            <div className={styles.innerColumnRight}>
              <TestimonialCard data={testimonials[1]} size="large" />
            </div>
          </div>
        </div>
        
        <div className={styles.columnSmall}>
          <TestimonialCard data={testimonials[2]} size="small" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
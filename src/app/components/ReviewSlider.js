import React, { useState, useEffect } from 'react';
import { TestimonialCard } from './testimonials/TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "./ReviewSlider.css";

const ReviewSlider = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - 3 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (testimonials.length === 0) {
    return <div className="testimonial-slider">No testimonials available</div>;
  }

  return (
    <div className="testimonial-slider">
      <h2 className="slider-title">What Our Users Say</h2>
      <div className="testimonial-slider-container">
        <button 
          className="nav-button prev" 
          onClick={handlePrev}
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="testimonial-wrapper">
          <div
            className="testimonial-slide"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`,
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`} 
                className="testimonial-item"
              >
                <TestimonialCard 
                  data={testimonial} 
                  size={index % 2 === 0 ? "large" : "small"} 
                />
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="nav-button next" 
          onClick={handleNext}
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="testimonial-dots">
        {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
          <button
            key={index}
            className={`dot ${Math.floor(currentIndex / 3) === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index * 3)}
            aria-label={`Go to testimonial group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
"use client"
import React, { useState, useEffect } from 'react';
import { TestimonialCard } from './testimonials/TestimonialCard'; 
import "./ReviewSlider.css"

const ReviewSlider = ({ testimonials  }) => {  // Default to an empty array if undefined

    if (testimonials.length === 0) {
      return <div>No testimonials available</div>;  // Fallback in case of empty array
    }
  
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds
  
      return () => clearInterval(interval);
    }, [testimonials.length]);
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };
  
    return (
      <div className="testimonial-slider">
        <div className="testimonial-slider-container">
          <button className="nav-button prev" onClick={handlePrev}>←</button>
          <div className="testimonial-wrapper">
            <div 
              className="testimonial-slide"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id || index} className="testimonial-item">
                  <TestimonialCard data={testimonial} size={index % 2 === 0 ? "large" : "small"} />
                </div>
              ))}
            </div>
          </div>
          <button className="nav-button next" onClick={handleNext}>→</button>
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index} // Add key prop here
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  };
  

export default ReviewSlider;

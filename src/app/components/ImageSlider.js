"use client"
import React, { useState, useEffect } from 'react';
import './Temp.css';

function ImageSlider({ images, interval = 7000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [images.length, interval]);

  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="image-slider">
      <div
        className="slider-wrapper"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} className="slider-image" />
        ))}
      </div>
      <button className="slider-button left" onClick={goToPrevSlide}>
        ‹
      </button>
      <button className="slider-button right" onClick={goToNextSlide}>
        ›
      </button>
    </div>
  );
}

export default ImageSlider;

"use client"
import React, { useEffect } from 'react';
import './Temp.css';
import ImageSlider from './ImageSlider';

function Hero() {
    const images = [
        'data:image/jpeg;base64,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',
        'https://via.placeholder.com/800x300.png?text=Image+2',
        'https://via.placeholder.com/800x300.png?text=Image+3',
      ];
  useEffect(() => {
    // Remove the first line's cursor after typing is completed
    setTimeout(() => {
      const cursorFast = document.querySelector('.cursor-fast');
      if (cursorFast) cursorFast.classList.add('typing-complete');
    }, 2000); // Matches the first line's animation duration (2s)

    // Remove the second line's cursor after typing is completed
    setTimeout(() => {
      const cursorSlow = document.querySelector('.cursor-slow');
      if (cursorSlow) cursorSlow.classList.add('typing-complete');
    }, 6000); // Matches the second line's animation start (2s) + duration (4s)
  }, []);

  return (
    <section className="hero">
      <div className="typing-container">
        <h1>
          <span className="typing-fast">Welcome to MediLink</span>
          {/* <span className="cursor-fast"></span> */}
        </h1>
        <h2>
          <span className="typing-slow">
            Revolutionizing Healthcare with AI-Powered Solutions
          </span>
          {/* <span className="cursor-slow"></span> */}
        </h2>
      </div>
      <div className="image-slider">
        <ImageSlider images={images} interval={7000} />
      </div>
      <button className="cta-button metallic-button">Book an Appointment</button>
    </section>
  );
}

export default Hero;

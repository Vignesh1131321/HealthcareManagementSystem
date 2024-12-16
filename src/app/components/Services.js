"use client"
import React from 'react';
import './Temp.css';

function Services() {
  const serviceItems = [
    { title: 'Cardiology', description: 'Specialized care for heart health.' },
    { title: 'Orthopedics', description: 'Advanced treatment for bones and joints.' },
    // Add more services here
  ];

  return (
    <section id="services" className="services">
      <h2>Our Services</h2>
      <div className="service-item">
        {serviceItems.map((service, index) => (
          <div key={index}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;

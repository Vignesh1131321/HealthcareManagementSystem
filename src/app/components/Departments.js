"use client"
import React from 'react';
import './Temp.css';

function Departments() {
  const departments = [
    { title: 'Neurology', description: 'Expert care for neurological disorders.' },
    { title: 'Pediatrics', description: 'Comprehensive healthcare for children.' },
    // Add more departments here
  ];

  return (
    <section id="departments" className="departments">
      <h2>Departments</h2>
      <div className="department">
        {departments.map((dept, index) => (
          <div key={index}>
            <h3>{dept.title}</h3>
            <p>{dept.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Departments;

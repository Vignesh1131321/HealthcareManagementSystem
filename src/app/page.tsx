import React from 'react';
import './App.css';
import Header from './components/Header.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Departments from './components/Departments.js';
import Appointments from './components/Appointments.js';
import Contact from './components/Contact.js';
import Features from './components/Features.js';
import { HealthcarePage } from './healthcare/HealthcarePage';
export default function Home() {
  return (
      <div>
        <HealthcarePage/>
      </div>

  );
}

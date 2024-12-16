"use client"
import React from 'react';
import './Temp.css';

function Appointments() {
  return (
    <section id="appointments" className="appointments">
      <h2>Book an Appointment</h2>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" required />

        <label htmlFor="time">Time:</label>
        <input type="time" id="time" name="time" required />

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default Appointments;

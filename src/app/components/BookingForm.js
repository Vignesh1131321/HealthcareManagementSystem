"use client"
import React, { useState } from "react";
import "./BookingForm.css";

const BookingForm = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked with Dr. ${doctor.name} on ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>
        <label>
          Select Time:
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">--Select Time Slot--</option>
            {doctor.availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookingForm;

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./AppointmentPage.css";

const AppointmentPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit button state
  const searchParams = useSearchParams();

  // Generate time slots from 9 AM to 4 PM
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9;
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return {
      time: `${formattedHour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      available: Math.random() > 0.3 // Randomly set availability for demo
    };
  });

  useEffect(() => {
    const doctorData = searchParams.get("doctor");
    if (doctorData) {
      try {
        const parsedDoctor = JSON.parse(doctorData);
        setDoctor(parsedDoctor);
        if (parsedDoctor.reviews) {
          setReviews(parsedDoctor.reviews);
        }
      } catch (error) {
        console.error("Error parsing doctor details:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const calculateRatingDistribution = () => {
      const ratings = [5, 4, 3, 2, 1];
      const distribution = ratings.map((rating) => {
        const count = reviews.filter((review) => review.rating === rating).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return {
          rating,
          count,
          percentage
        };
      });
      setRatingDistribution(distribution);
    };

    calculateRatingDistribution();
  }, [reviews]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.time === selectedTimeSlot ? null : slot.time);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both date and time");
      return;
    }

    setIsSubmitting(true);

    const appointmentDetails = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTimeSlot,
    };

    try {
        const response = await fetch("/api/users/appointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentDetails),
        });
  
        if (response.ok) {
          alert("Appointment successfully booked!");
          setSelectedDate("");
          setSelectedTimeSlot(null);
        } else {
          const error = await response.json();
          console.error("Error booking appointment:", error.message);
          alert("Failed to book appointment.");
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("An error occurred while booking the appointment.");
      } finally {
        setIsSubmitting(false);
      }
    };



  if (!doctor) {
    return <p className="loading-message">Loading doctor details...</p>;
  }

  return (
    <div className="appointment-container">
      {/* Left Section: Doctor Details and Ratings */}
      <div className="doctor-details">
        <h2>{doctor.name}</h2>
        <p>
          <strong>Specialty:</strong> {doctor.specialty}
        </p>
        <p>
          <strong>Clinic Name:</strong> {doctor.clinicName}
        </p>
        <p>
          <strong>Address:</strong> {doctor.clinicLocation?.address}
        </p>
        <p>
          <strong>City:</strong> {doctor.clinicLocation?.city},{" "}
          <strong>State:</strong> {doctor.clinicLocation?.state},{" "}
          <strong>ZIP:</strong> {doctor.clinicLocation?.zip}
        </p>
        <p>
          <strong>Contact:</strong> {doctor.contact?.phone},{" "}
          {doctor.contact?.email}
        </p>
        
        {/* Ratings Distribution Section */}
        <h3>Ratings Distribution:</h3>
        <ul className="rating-distribution-list">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <li key={rating} className="rating-item">
              <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
              <div className="rating-bar-container">
                <div 
                  className="rating-bar" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="rating-count">
                {count} review{count !== 1 ? 's' : ''}
              </span>
            </li>
          ))}
        </ul>

        <h3>Reviews:</h3>
        {reviews.length > 0 ? (
          <ul className="review-list">
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p>
                  <strong>{review.author_name}</strong>: {review.text}
                </p>
                <p>
                  Rating: {review.rating} / 5
                  {review.relative_time_description && (
                    <> - {review.relative_time_description}</>
                  )}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Right Section: Appointment Booking */}
      <div className="appointment-form">
        <h2>Book an Appointment</h2>
        
        {/* Date Selection */}
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
        />

        {/* Time Slots */}
        {selectedDate && (
          <>
            <h3>Available Time Slots</h3>
            <div className="time-slots-container">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`time-slot ${slot.available ? 'available' : 'booked'} ${
                    selectedTimeSlot === slot.time ? 'selected' : ''
                  }`}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="slot-legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Free</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked"></div>
            <span>Full</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
            className="confirm-button"
            disabled={!selectedDate || !selectedTimeSlot}
            onClick={async () => {
                if (selectedDate && selectedTimeSlot) {
                try {
                    const response = await fetch("/api/users/appointment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        doctorId: doctor.id,
                        doctorName: doctor.name,
                        specialty: doctor.specialty,
                        date: selectedDate,
                        time: selectedTimeSlot,
                    }),
                    });

                    if (response.ok) {
                    alert(`Appointment scheduled for ${selectedDate} at ${selectedTimeSlot}`);
                    } else {
                    alert("Failed to schedule appointment. Please try again.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while booking the appointment.");
                }
                } else {
                alert("Please select both date and time.");
                }
            }}
            >
            Confirm Appointment
        </button>

      </div>
    </div>
  );
};

export default AppointmentPage;
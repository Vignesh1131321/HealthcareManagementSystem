"use client"
import React from "react";
import "./DoctorDetails.css";

const DoctorDetails = ({ doctor }) => {
  return (
    <div className="doctor-details">
      <img src={doctor.image} alt={doctor.name} className="doctor-image" />
      <h2>{doctor.name}</h2>
      <p>{doctor.specialty}</p>
      <p>{doctor.experience} years of experience</p>
      <h3>Reviews & Ratings</h3>
      <div className="reviews">
        {doctor.reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p><strong>{review.reviewerName}</strong></p>
            <p>{review.comment}</p>
            <span>Rating: {review.rating} ⭐</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDetails;

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TestimonialSection from "./testimonials/TestimonialSection";
import ReviewSlider from "./ReviewSlider"
import AppointmentSuccessful from "./AppointmentSuccessful";
import { TestimonialCard } from "./testimonials/TestimonialCard";
import styles from "./testimonials/TestimonialSection.module.css";
import "./AppointmentPage.css";

let UserDetails = {
  _id: "", // String value
  username: "", // String value
  email: "", // String value
  firstName: "", // String value
  lastName: "", // String value
  phoneNumber: "", // String value
  emergencyContact: {
    name: "", // String value
    phoneNumber: "", // String value
  },
  address: {
    street: "", // String value
    city: "", // String value
    state: "", // String value
    zipCode: "", // String value
  },
  age: 0, // Number value
  gender: "", // String value
  profilePhotoUrl: "", // String value (URL)
  isCompleteProfile: false, // Boolean value
};


const AppointmentPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isError, setIsError] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  const searchParams = useSearchParams();

  // Generate time slots once when component mounts
  useEffect(() => {
    const generateTimeSlots = () => [
      { time: "9:00 AM", available: Math.random() > 0.3 },
      { time: "10:00 AM", available: Math.random() > 0.3 },
      { time: "11:00 AM", available: Math.random() > 0.3 },
      { time: "12:00 PM", available: Math.random() > 0.3 },
      { time: "1:00 PM", available: Math.random() > 0.3 },
      { time: "2:00 PM", available: Math.random() > 0.3 },
      { time: "3:00 PM", available: Math.random() > 0.3 },
      { time: "4:00 PM", available: Math.random() > 0.3 },
    ];
    setTimeSlots(generateTimeSlots());
  }, []);

  // Fetch doctor data from query params
  useEffect(() => {
    const doctorData = searchParams.get("doctor");
    if (doctorData) {
      try {
        const parsedDoctor = JSON.parse(doctorData);
        setDoctor(parsedDoctor);
        setReviews(parsedDoctor.reviews || []);
      } catch (error) {
        console.error("Error parsing doctor details:", error);
      }
    }
  }, [searchParams]);

  // Calculate rating distribution
  useEffect(() => {
    const calculateRatingDistribution = () => {
      const ratings = [5, 4, 3, 2, 1];
      const distribution = ratings.map((rating) => {
        const count = reviews.filter((review) => review.rating === rating).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { rating, count, percentage };
      });
      setRatingDistribution(distribution);
    };
    calculateRatingDistribution();
  }, [reviews]);

  // Cycle through reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.time);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both date and time");
      return;
    }

    setIsSubmitting(true);

    const appointmentDetails = {
      userId : userDetails._id,
      identity: doctor.identity,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTimeSlot,
    };

    try {
      const response = await fetch("/api/users/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentDetails),
      });
      console.log("Appointment details:", appointmentDetails);
      
      if (response.ok) {
        /* alert("Appointment successfully booked!"); */
        setShowModal(true);
        setSelectedDate("");
        setSelectedTimeSlot(null);
      } else {
        const error = await response.json();
        console.error("Error booking appointment:", error.message);
        /* alert("Failed to book appointment.") */;
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      /* alert("An error occurred while booking the appointment."); */
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details... from appointment");
      
      const response = await fetch("/../api/users/me");
      
      if (response.ok) {
        const resData = await response.json();
        
        if (resData && resData.data) {
          setUserDetails(resData.data);
          
          if (!resData.data.isCompleteProfile) {
            setShowCompleteProfileCard(true);
          }
        } else {
          toast.error("Failed to get user details");
        }
      } else {
        toast.error("Failed to fetch user details. Server returned an error.");
      }
    } 
    catch (error) {
      console.error("Error fetching user details or health records:", error);
      toast.error("Failed to fetch user details or health records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!doctor) {
    return <p className="loading-message">Loading doctor details...</p>;
  }

  const currentReview = reviews[currentReviewIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundImage: "url('/hospital-background.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="appointment-page-container">
        <div className="top-sections-container">
          <div className="doctor-details-section">
            {doctor.identity === "1" && (
              <h2>Hospital Details</h2>
            )}
            {doctor.identity === "2" && (
              <h2>Doctor Details</h2>
            )}
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              {doctor.identity === "2" && (
                <p><strong>Specialty:</strong> {doctor.specialty}</p>
              )}
              
              <p><strong>Clinic Name:</strong> {doctor.clinicName}</p>
              <p><strong>Address:</strong> {doctor.clinicLocation?.address}</p>
              {/* <p>
                <strong>City:</strong> {doctor.clinicLocation?.city},{" "}
                <strong>State:</strong> {doctor.clinicLocation?.state},{" "}
                <strong>ZIP:</strong> {doctor.clinicLocation?.zip}
              </p> */}
              {/* <p>
                <strong>Contact:</strong> {doctor.contact?.phone},{" "}
                {doctor.contact?.email}
              </p> */}
            </div>
          </div>

          <div className="appointment-section">
            <h2>Book an Appointment</h2>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />

            {selectedDate && (
              <>
                <h3>Available Time Slots</h3>
                <div className="time-slots-container">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot ${slot.available ? "available" : "booked"} ${
                        selectedTimeSlot === slot.time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Show AppointmentSuccessful or AppointmentFailure modal */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  {isError ? (
                    <>
                      <AppointmentFailure />
                      <button
                        className="close-button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <AppointmentSuccessful />
                      <button
                        className="close-button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}


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

            <button
              className="confirm-button"
              disabled={!selectedDate || !selectedTimeSlot || isSubmitting}
              onClick={handleAppointmentSubmit}
            >
              {isSubmitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </div>

        {/* <div className="reviews-section">
          <h2>Reviews</h2>
          {currentReview ? (
            <div className="review-content">
              <p>
                <strong>{currentReview.author || "Anonymous"}</strong>:{" "}
                {currentReview.text || "No review text available"}
              </p>
              <p>
                Rating:{" "}
                <span className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < currentReview.rating ? "star filled" : "star"}
                    />
                  ))}
                </span>
                {currentReview.relative_time_description && (
                  <> - {currentReview.relative_time_description}</>
                )}
              </p>
            </div>
          ) : (
            <p>No reviews available.</p>
          )} */}
          {/* <TestimonialSection></TestimonialSection> */}
          <ReviewSlider testimonials = {reviews}></ReviewSlider>

  {/*         <section className={styles.testimonialSection}>
            <div className={styles.navigationDots}>
              {reviews.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${
                    i === currentIndex ? styles.active : ""
                  }`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>

            <div className={styles.testimonialGrid}>
              <div className={styles.navigationArrows}>
                <div className={styles.arrow} onClick={handlePrev}>
                  ←
                </div>
                <div className={styles.arrow} onClick={handleNext}>
                  →
                </div>
              </div>

              <div
                className={styles.slider}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                {reviews.map((review, i) => (
                  <div key={i} className={styles.slide}>
                    <TestimonialCard data={review} size="large" />
                  </div>
                ))}
              </div>
            </div>
          </section> */}
        </div>
      </div>
    


  );
};

export default AppointmentPage;

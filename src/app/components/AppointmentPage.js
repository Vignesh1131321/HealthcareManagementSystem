"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TestimonialSection from "./testimonials/TestimonialSection";
import ReviewSlider from "./ReviewSlider"
import AppointmentSuccessful from "./AppointmentSuccessful";
import Emergency from "./Emergency";
import { TestimonialCard } from "./testimonials/TestimonialCard";
import styles from "./testimonials/TestimonialSection.module.css";
import { Building2, Phone, Mail } from 'lucide-react';
import "./AppointmentPage.css";
import axios from "axios";
import { toast } from "react-hot-toast";

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


import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
  const [appointments, setAppointments] = useState([]);


  const searchParams = useSearchParams();

  const fetchAppointments = async ( newDate ) => {
    if (!userDetails || !userDetails._id) {
      console.warn("User details not available yet.");
      return;
    }

  
    try {
      setLoading(true);

      const appointmentDate = new Date(newDate);

      const day = String(appointmentDate.getDate()).padStart(2, '0'); // Add leading zero if necessary
      const month = String(appointmentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = appointmentDate.getFullYear();
  
      const formattedDate = `${day}-${month}-${year}`;
      const response = await axios.get('/api/get-booked-appointment', {
        params: {
          doctorId: doctor.id,
          date: formattedDate,
        },
      });

      if (response.request.status === 200) {
        setAppointments(response.data.appointments);

        
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  console.log("Updated appointments state:", appointments);
}, [appointments]);
console.log(appointments);

useEffect(() => {
  const generateTimeSlots = () => {
    // Define default time slots
    const defaultTimeSlots = [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: true },
    ];

    // Mark time slots as unavailable if they match booked appointment times
    const updatedTimeSlots = defaultTimeSlots.map((slot) => {
      const isBooked = appointments.some(
        (appointment) => appointment.appointmentTime === slot.time
      );
      return { ...slot, available: !isBooked };
    });

    return updatedTimeSlots;
  };

  // Update time slots when appointments change
  setTimeSlots(generateTimeSlots());
}, [appointments]); // Recompute when appointments change

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

/*   useEffect(() => {
    fetchAppointments();
  }, [selectedDate]); */

  // Cycle through reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchAppointments(newDate);
    setSelectedTimeSlot(null);
  };
  const getTimeSlotClass = (slot) => {
    if (!selectedDate) return "time-slot disabled";
    if (selectedTimeSlot === slot.time) return "time-slot selected";
    return `time-slot ${slot.available ? "available" : "booked"}`;
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

    const appointmentDate = new Date(appointmentDetails.date);

    const day = String(appointmentDate.getDate()).padStart(2, '0'); // Add leading zero if necessary
    const month = String(appointmentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = appointmentDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    
    appointmentDetails.date = formattedDate;

    try {
      const response = await fetch("/api/users/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentDetails),
      });
      
      
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
          <div className="doctor-card">
            <div className="doctor-card-header">
              
              <div className="doctor-header-info">
                <Typography variant="h4" className="doctor-name">
                  {doctor.name}
                </Typography>
                {doctor.identity === "2" && (
                  <div className="specialty-badge">
                    <AccessTimeIcon className="specialty-icon" />
                    <Typography variant="body1" className="specialty-text">
                      {doctor.specialty}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            
            <div className="doctor-card-content">
              <div className="info-row">
                <Building2 className="info-icon" />
                <div className="info-text">
                  <Typography variant="subtitle2" className="info-label">
                    Clinic Name
                  </Typography>
                  <Typography variant="body1">
                    {doctor.clinicName}
                  </Typography>
                </div>
              </div>

              <div className="info-row">
                <LocationOnIcon className="info-icon" />
                <div className="info-text">
                  <Typography variant="subtitle2" className="info-label">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {doctor.clinicLocation?.address}
                  </Typography>
                </div>
              </div>

              {doctor.contact && (
                <>
                  <div className="info-row">
                    <Phone className="info-icon" />
                    <div className="info-text">
                      <Typography variant="subtitle2" className="info-label">
                        Contact
                      </Typography>
                      <Typography variant="body1">
                        {doctor.contact.phone}
                      </Typography>
                    </div>
                  </div>

                  <div className="info-row">
                    <Mail className="info-icon" />
                    <div className="info-text">
                      <Typography variant="subtitle2" className="info-label">
                        Website
                      </Typography>
                      <Typography variant="body1">
                        {doctor.contact.email}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

          <div className="appointment-section">
            <h2>Book an Appointment</h2>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Select Date"
    value={selectedDate}
    onChange={handleDateChange}
    renderInput={(params) => (
      <TextField {...params} className="date-input" />
    )}
  />
</LocalizationProvider>

           

            
              <>
                <h3>Available Time Slots</h3>
                <div className="time-slots-container">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={getTimeSlotClass(slot)}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              </>
            

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
                      <Emergency num = "1"/>
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
            {!selectedDate && (
              <div className="legend-item">
                <div className="legend-box disabled"></div>
                <span>Select a date first</span>
              </div>
            )}
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
          <ReviewSlider testimonials = {reviews}></ReviewSlider>
        </div>
      </div>
  );
};

export default AppointmentPage;

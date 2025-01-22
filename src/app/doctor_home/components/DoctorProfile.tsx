"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavbarWrapper } from './NavbarWrapper';
import styles from './DoctorProfile.module.css';
import { toast } from 'react-hot-toast';
import { User, Building2, GraduationCap, Clock, MapPin, Star } from 'lucide-react';

type DoctorDetails = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  specialty: string;
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    }
  },
  licenseNumber: string;
  clinicName: string;
  isVerified: boolean;
  createdAt: string;
};

const DoctorProfile = () => {
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);

  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        const res = await axios.get<{ data: DoctorDetails }>("/doctor_home/doctors/me");
      if (res.data && res.data.data) {
        setDoctorDetails(res.data.data);
      } else {
        toast.error("Failed to get doctor details");
        return;
      }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };
    getDoctorDetails();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <NavbarWrapper />
      <div className={styles.profileContent}>
        <h1>Doctor Profile</h1>
        {doctorDetails && (
        <div className={styles.profileGrid}>
          <div className={styles.detailCard}>
            <User className={styles.cardIcon} />
            <div className={styles.cardContent}>
              <h3>Personal Information</h3>
              <p><strong>Username:</strong> {doctorDetails.username}</p>
              <p><strong>Name:</strong> {doctorDetails.firstName + " " + doctorDetails.lastName}</p>
              <p><strong>Email:</strong> {doctorDetails.email}</p>
              <p><strong>Phone:</strong> {doctorDetails.phoneNumber}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <GraduationCap className={styles.cardIcon} />
            <div className={styles.cardContent}>
            <h3>Professional Details</h3>
            <p><strong>Specialty:</strong> {doctorDetails.specialty}</p>
            <p><strong>License Number:</strong> {doctorDetails.licenseNumber}</p>
            <p><strong>Clinic Name:</strong> {doctorDetails.clinicName}</p>
            </div>
          </div>

          {/* <div className={styles.detailCard}>
            <h3>Location Details</h3>
            <p><strong>Address:</strong> {doctorDetails.location.address}</p>
            <p><strong>City:</strong> {doctorDetails.location.city}</p>
            <p><strong>State:</strong> {doctorDetails.location.state}</p>
            <p><strong>Country:</strong> {doctorDetails.location.country}</p>
          </div> */}
          <div className={styles.detailCard}>
            <Building2 className={styles.cardIcon} />
            <div className={styles.cardContent}>
              <h3>Clinic Details</h3>
              <p><strong>Clinic Name:</strong> {doctorDetails.clinicName}</p>
              {/* <p><strong>Address:</strong> {doctorDetails.location.address}</p>
              <p><strong>City:</strong> {doctorDetails.location.city}</p>
              <p><strong>State:</strong> {doctorDetails.location.state}</p>
              <p><strong>Country:</strong> {doctorDetails.location.country}</p> */}
            </div>
          </div>

          {/* <div className={styles.detailCard}>
            <h3>Account Status</h3>
            <p><strong>Verification Status:</strong> 
              {doctorDetails.isVerified ? 
                <span className={styles.verified}>Verified</span> : 
                <span className={styles.unverified}>Unverified</span>
              }
            </p>
            <p><strong>Member Since:</strong> {new Date(doctorDetails.createdAt).toLocaleDateString()}</p>
          </div> */}
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorProfile;
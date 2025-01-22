"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavbarWrapper } from './NavbarWrapper';
import styles from './DoctorProfile.module.css';
import "./DoctorProfile.css";
import { signOut } from "next-auth/react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { User, Building2, GraduationCap, Clock, MapPin, Star, Upload, Phone, Mail } from 'lucide-react';

interface ProfileImage {
  contentType: string;
  data: {
    data: Buffer;
  };
}
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState<ProfileImage[]>([]);

  const logout = async () => {
      try {
        await signOut({ redirect: false }); // Logout without redirecting immediately
        toast.success("Logged Out Successfully");
        // After sign out, manually redirect to the login page
        router.push("/login");
      } catch (error: any) {
        console.error(error.message);
        toast.error("Failed to Logout");
      }
    };

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
        {doctorDetails && (<>
          <div className="profile-header">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {loading ? (
                <div className="loading-placeholder" />
              ) : images.length > 0 ? (
                <img
                  src={`data:${images[images.length-1].contentType};base64,${btoa(
                    new Uint8Array(images[images.length-1].data.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  )}`}
                  alt="Profile"
                  className="photo"    // className="profile-image"
                />
              ) : (
                <div className="photo-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            <label className="photo-upload-btn">
<input
  type="file"
  className="hidden"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file || !doctorDetails?._id) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", doctorDetails._id);

    try {
      setLoading(true);
      const res = await fetch("/api/upload-mongo-image", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload response:", result);

      if (result.success) {
        toast.success("Successfully Uploaded");
        // Update profile photo URL immediately
        setDoctorDetails((prev) =>
          prev ? { ...prev, profilePhotoUrl: result.updatedProfilePhotoUrl } : null
        );
      } else {
        toast.error("Failed to upload: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during the upload process.");
    } finally {
      setLoading(false);
    }
  }}
/>
<Upload size={16} />
</label>
          </div>
          
          <div className="user-info">
            <h1>{doctorDetails?.username}</h1>
            <div className="contact-info">
              <span><Mail size={16} /> {doctorDetails?.email}</span>
              <span><Phone size={16} /> {doctorDetails?.phoneNumber}</span>
              {/* <span><MapPin size={16} /> {doctorDetails?.address?.city}, {userDetails?.address?.state}</span> */}
            </div>
          </div>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
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
        </>
      )}
      </div>
    </div>
  );
};

export default DoctorProfile;
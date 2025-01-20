import React, { useState } from 'react';
import styles from './DoctorSignUp.module.css';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

// Define the expected doctor data structure
interface DoctorData {
  username: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  clinicName: string;
  placeId: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface DoctorSignUpProps {
  onSubmit: (doctorData: DoctorData) => void;
}

export const DoctorSignUp: React.FC<DoctorSignUpProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    licenseNumber: '',
    specialty: '',
    clinicName: '',
  });
  
  const [placeData, setPlaceData] = useState({
    placeId: '',
    location: '',
    coordinates: { lat: 0, lng: 0 }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber?.match(/^\+?[\d\s-]{10,}$/)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!placeData.placeId) {
      newErrors.location = 'Please select a valid clinic location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setPlaceData({
          placeId: place.place_id || '',
          location: place.formatted_address || '',
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });
        if (errors.location) {
          setErrors(prev => ({ ...prev, location: '' }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const doctorData: DoctorData = {
      ...formData,
      placeId: placeData.placeId,
      location: {
        type: "Point",
        coordinates: [placeData.coordinates.lng, placeData.coordinates.lat]
      }
    };

    onSubmit(doctorData);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.doctorForm}>
      <div className={styles.formSection}>
        <h3>Account Information</h3>
        <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
            />
            {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Personal Information</h3>
        <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
            />
            {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Professional Information</h3>
        <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="licenseNumber"
              placeholder="Medical License Number"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Clinic Information</h3>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="clinicName"
            placeholder="Clinic Name"
            value={formData.clinicName}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={onPlaceSelected}
          >
            <input
              type="text"
              placeholder="Search for your clinic location"
              className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
            />
          </Autocomplete>
          {errors.location && <span className={styles.errorMessage}>{errors.location}</span>}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Account Security</h3>
        <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Register as Doctor
      </button>
    </form>
  );
};
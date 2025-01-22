import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { 
  User, Mail, Lock, Phone, UserPlus, Building, MapPin,
  Stethoscope, ChevronRight, ChevronLeft, Award
} from 'lucide-react';
import styles from './DoctorSignUp.module.css';

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
  const [currentStep, setCurrentStep] = useState(1);
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Invalid email format';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phoneNumber?.match(/^\+?[\d\s-]{10,}$/)) {
        newErrors.phoneNumber = 'Invalid phone number format';
      }
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const doctorData: DoctorData = {
        ...formData,
        placeId: placeData.placeId,
        location: {
          type: "Point",
          coordinates: [placeData.coordinates.lng, placeData.coordinates.lat]
        }
      };
      onSubmit(doctorData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.doctorForm}>
      <div className={styles.stepIndicator}>
        {[1, 2].map((step) => (
          <div
            key={step}
            className={`${styles.step} ${
              currentStep === step ? styles.active : ''
            } ${currentStep > step ? styles.completed : ''}`}
          />
        ))}
      </div>

      {/* Step 1: Account & Personal Information */}
      <div className={styles.formStep} style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        <div className={styles.formSection}>
          <h3>Account Information</h3>
          <div className={styles.inputGrid}>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Professional Information */}
      <div className={styles.formStep} style={{ display: currentStep === 2 ? 'block' : 'none' }}>
        <div className={styles.formSection}>
          <h3>Professional Information</h3>
          <div className={styles.inputGrid}>
            <div className={styles.inputWrapper}>
              <UserPlus className={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Phone className={styles.inputIcon} />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Award className={styles.inputIcon} />
              <input
                type="text"
                name="licenseNumber"
                placeholder="Medical License Number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.licenseNumber && <span className={styles.errorMessage}>{errors.licenseNumber}</span>}
            </div>
            <div className={styles.inputWrapper}>
              <Stethoscope className={styles.inputIcon} />
              <input
                type="text"
                name="specialty"
                placeholder="Specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Building className={styles.inputIcon} />
              <input
                type="text"
                name="clinicName"
                placeholder="Clinic Name"
                value={formData.clinicName}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <MapPin className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Search for your clinic location"
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navigationButtons}>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
        {currentStep < 2 ? (
          <button
            type="button"
            onClick={handleNext}
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            Complete Registration
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
};
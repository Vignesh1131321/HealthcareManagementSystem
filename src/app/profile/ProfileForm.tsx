import React, { useState } from 'react';
import { User, Home, Phone, Activity, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ProfileForm.css';

type UserDetails = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  gender: string;
  profilePhotoUrl?: string;
  isCompleteProfile: boolean;
};

type ProfileFormProps = {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  setShowCompleteProfileCard: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ userDetails, setUserDetails, setShowCompleteProfileCard }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    zipCode: string;
    state: string;
    city: string;
    street: string;
    emergencyName: string;
    emergencyContact: string;
    weight: string;
    height: string;
    bloodGroup: string;
    bloodPressure: string;
  }>({
    firstName: userDetails?.firstName || '',
    lastName: userDetails?.lastName || '',
    phoneNumber: userDetails?.phoneNumber || '',
    gender: userDetails?.gender || '',
    zipCode: userDetails?.address?.zipCode || '',
    state: userDetails?.address?.state || '',
    city: userDetails?.address?.city || '',
    street: userDetails?.address?.street || '',
    emergencyName: userDetails?.emergencyContact?.name || '',
    emergencyContact: userDetails?.emergencyContact?.phoneNumber || '',
    weight: '',
    height: '',
    bloodGroup: '',
    bloodPressure: '',
  });

  const steps = [
    { name: 'Basic Information', icon: <User />, completed: false },
    { name: 'Address Details', icon: <Home />, completed: false },
    { name: 'Emergency Contact', icon: <Phone />, completed: false },
    { name: 'Vital Statistics', icon: <Activity />, completed: false },
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleCompleteProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userDetails?._id) {
      toast.error('User ID not found');
      return;
    }

    try {
      setLoading(true);

      // Create a properly structured request body
      const requestBody = {
        userId: userDetails._id,
        username: userDetails.username,
        email: userDetails.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        emergencyContact: {
          name: formData.emergencyName,
          phoneNumber: formData.emergencyContact
        },
        vitalStats: {
          weight: formData.weight,
          height: formData.height,
          bloodGroup: formData.bloodGroup,
          bloodPressure: formData.bloodPressure
        }
      };

      const response = await fetch('/api/users/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile completed successfully');
        setUserDetails(data.data);
        setShowCompleteProfileCard(false);
      } else {
        throw new Error(data.error || 'Failed to complete profile');
      }
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast.error(error.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
  switch (activeStep) {
    case 0:
      return (
        <div className="form-fields">
          <div className="field-group">
            <label>First Name</label>
            <div className="input-wrapper">
              <User />
              <input
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
          </div>
          <div className="field-group">
            <label>Last Name</label>
            <div className="input-wrapper">
              <User />
              <input
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="field-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone />
              <input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
          </div>
          <div className="field-group">
            <label>Gender</label>
            <div className="input-wrapper">
              <User />
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="form-fields">
          <div className="field-group">
            <label>Street Address</label>
            <input
              type="text"
              placeholder="Enter street address"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>State</label>
            <input
              type="text"
              placeholder="Enter state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Zip Code</label>
            <input
              type="text"
              placeholder="Enter zip code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="form-fields">
          <div className="field-group">
            <label>Emergency Contact Name</label>
            <div className="input-wrapper">
              <User />
              <input
                type="text"
                placeholder="Enter emergency contact name"
                value={formData.emergencyName}
                onChange={(e) => handleInputChange('emergencyName', e.target.value)}
              />
            </div>
          </div>
          <div className="field-group">
            <label>Emergency Contact Phone</label>
            <div className="input-wrapper">
              <Phone />
              <input
                type="tel"
                placeholder="Enter emergency contact phone"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="form-fields">
          <div className="field-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Height (cm)</label>
            <input
              type="number"
              placeholder="Enter height"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div className="field-group">
            <label>Blood Pressure</label>
            <input
              type="text"
              placeholder="Enter blood pressure (e.g., 120/80)"
              value={formData.bloodPressure}
              onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

return (
    <div className="profile-page">
      <div className="steps-container">
        <div className="steps-progress">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div
                className={`step-icon ${
                  index < activeStep ? 'completed' : index === activeStep ? 'active' : ''
                }`}
              >
                {index < activeStep ? <Check /> : step.icon}
              </div>
              <span className={`step-name ${index === activeStep ? 'active' : ''}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
  
      <div className="profile">
        <form onSubmit={handleCompleteProfileSubmit} className="form-card">
          <h2>{steps[activeStep].name}</h2>
          {renderStepContent()}
  
          <div className="form-footer">
            <button 
              type="button" 
              onClick={handleBack} 
              disabled={activeStep === 0}
            >
              <ChevronLeft /> Back
            </button>
            {activeStep === steps.length - 1 ? (
  <button 
    type="button" // Change from submit to button
    onClick={(e) => {
      e.preventDefault();
      handleCompleteProfileSubmit(e as React.FormEvent<HTMLFormElement>);
    }}
    disabled={loading}
    className="submit-button"
  >
    {loading ? 'Submitting...' : 'Submit'}
  </button>
) : (
  <button 
    type="button"
    onClick={(e) => {
      e.preventDefault();
      handleNext();
    }}
    className="next-button"
  >
    Next <ChevronRight />
  </button>
)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

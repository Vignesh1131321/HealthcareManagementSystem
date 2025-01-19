import React, { useState } from 'react';
import { User, Home, Phone, Activity, Check, ChevronLeft, ChevronRight, AlertCircle, Pill, FileText, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ProfileForm.css';
import {  Eye,  X } from 'lucide-react';
import axios from 'axios';

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
  age: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  gender: string;
  vitalStats: {
    weight: string;
    height: string;
    bloodGroup: string;
    // bloodPressure: string;
  };
  profilePhotoUrl?: string;
  isVerified: boolean;
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
  const [file, setFile] = useState<File | null>(null); // <-- Add this state
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [healthRecords, setHealthRecords] = useState<any[]>([]); // Define state for health records

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
    // bloodPressure: string;
    allergies: {
      type: string;
      severity: string;
      reaction: string;
    }[];
    medications: {  name: string;
      dosage: string;
      frequency: string;
      startDate: string;}[];
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
    // bloodPressure: '',
    allergies: [],
    medications: [],
  });

  const steps = [
    { name: 'Basic Information', icon: <User />, completed: false },
    { name: 'Address Details', icon: <Home />, completed: false },
    { name: 'Emergency Contact', icon: <Phone />, completed: false },
    { name: 'Vital Statistics', icon: <Activity />, completed: false },
    { name: 'Allergies', icon: <AlertCircle />, completed: false },
    { name: 'Medications', icon: <Pill />, completed: false },
    { name: 'Health Records', icon: <FileText />, completed: false },
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    }
  };
  
  const clearSelectedFile = () => {
    setFile(null);
    setSelectedFileName('');
  };

  const handleSubmitForHealthRecord = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    if (!file || !userDetails?._id) {
      toast.error("Please select a file and ensure you're logged in");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userDetails._id);
  
    try {
      setLoading(true);
      const res = await fetch("/api/upload-health-record", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
  
      if (result.success) {
        toast.success("Successfully uploaded health record");
        
        const healthRecordsRes = await axios.get('/api/get-health-records', {
          headers: { userId: userDetails._id },
        });
        
        if (healthRecordsRes.data && healthRecordsRes.data.records) {
          setHealthRecords(healthRecordsRes.data.records);
        }
        
        clearSelectedFile();
      } else {
        toast.error(result.message || "Failed to upload health record");
      }
    } catch (error) {
      console.error("Error uploading health record:", error);
      toast.error("Failed to upload health record");
    } finally {
      setLoading(false);
    }
  };
  // const handleRecordPreview = (record: any) => {
  //   // Ensure we have the correct data format
  //   const base64Data = record.data instanceof Uint8Array 
  //     ? btoa(String.fromCharCode.apply(null, record.data))
  //     : record.data;

  //   setPreviewRecord({
  //     name: record.name,
  //     url: `data:${record.contentType};base64,${base64Data}`,
  //     type: record.contentType
  //   });
  //   setShowPreview(true);
  // };
  

  const handleCompleteProfileSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
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
          // bloodPressure: formData.bloodPressure
        },
        allergies: formData.allergies,
    medications: formData.medications,
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

  const handleAllergyChange = (index: number, field: keyof typeof formData['allergies'][0], value: string) => {
    console.log('Before update:', formData.allergies); // Debug log
    setFormData((prev) => {
      const updatedAllergies = [...prev.allergies];
      if (!updatedAllergies[index]) {
        updatedAllergies[index] = { type: '', severity: '', reaction: '' };
      }
      updatedAllergies[index] = {
        ...updatedAllergies[index],
        [field]: value,
      };
      console.log('After update:', updatedAllergies); // Debug log
      return { ...prev, allergies: updatedAllergies };
    });
  };

  const addAllergy = () => {
    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, { type: '', severity: '', reaction: '' }],
    }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof typeof formData['medications'][0],
    value: string
  ) => {
    setFormData((prev) => {
      const updatedMedications = [...prev.medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '', startDate: '' },
      ],
    }));
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
              className="custom-select"
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
          {/* <div className="field-group">
            <label>Blood Pressure</label>
            <input
              type="text"
              placeholder="Enter blood pressure (e.g., 120/80)"
              value={formData.bloodPressure}
              onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
            />
          </div> */}
        </div>
      );
    case 4:
      return (
          <div className="form-fields card-grid">
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="info-card">
                <h3>Allergy {index + 1}</h3>
                <div className="card-content">
                  <input
                    type="text"
                    placeholder="Allergy Type"
                    value={allergy.type}
                    onChange={(e) => handleAllergyChange(index, 'type', e.target.value)}
                  />
                  <select
                    value={allergy.severity}
                    onChange={(e) => handleAllergyChange(index, 'severity', e.target.value)}
                  >
                    <option value="">Select Severity</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Reaction"
                    value={allergy.reaction}
                    onChange={(e) => handleAllergyChange(index, 'reaction', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addAllergy} className="add-card-btn">
              Add Allergy
            </button>
          </div>
        );
    case 5:
        return (
          <div className="form-fields card-grid">
            {formData.medications.map((medication, index) => (
              <div key={index} className="info-card">
                <h3>Medication {index + 1}</h3>
                <div className="card-content">
                  <input
                    type="text"
                    placeholder="Medication Name"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={medication.startDate}
                    onChange={(e) => handleMedicationChange(index, 'startDate', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addMedication} className="add-card-btn">
              Add Medication
            </button>
          </div>
        );    
        case 6:
          return (
            <div className="form-fields">
              <div className="health-records-section">
                {healthRecords.length > 0 ? (
                  <div className="health-records-list">
                    {healthRecords.map((record, index) => (
                      <div key={index} className="health-record-item">
                        <div className="record-info">
                          <FileText className="file-icon" />
                          <span>{record.name}</span>
                        </div>
                        {/* <button 
                          className="preview-btn"
                          onClick={() => handleRecordPreview(record)}
                        >
                          <Eye className="preview-icon" />
                          Preview
                        </button> */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No health records available</p>
                )}
                
                <div className="upload-section">
                  {selectedFileName && (
                    <div className="selected-file">
                      <div className="file-info">
                        <FileText className="file-icon" />
                        <span>{selectedFileName}</span>
                      </div>
                      <button 
                        className="clear-file" 
                        onClick={clearSelectedFile}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  <div className="upload-controls">
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                      />
                      Choose File
                    </label>
                    <button
                      className="upload-btn"
                      onClick={handleSubmitForHealthRecord}
                      disabled={!file || loading}
                    >
                      {loading ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="upload-icon" />
                          Upload Health Record
                        </>
                      )}
                    </button>
                  </div>
                </div>
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
        <div className="steps-header">
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
      </div>
  
      {/* <div className="profile"> */}
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
                  handleCompleteProfileSubmit(e);
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
      {/* </div> */}
    </div>
  );
};

export default ProfileForm;

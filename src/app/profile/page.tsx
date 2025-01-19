"use client";
import React, { useState, useEffect } from 'react';
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { X, FileText, Upload, Eye, User, Home, Phone, Activity, Heart, AlertCircle, ChevronLeft } from 'lucide-react';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ProfileForm from './ProfileForm';
import "./profile.css";

interface ProfileImage {
  contentType: string;
  data: {
    data: Buffer;
  };
}

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

interface Appointment {
  _id: string;
  doctorName:string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  identity: string;
  specialty: string;
  // Add other appointment properties as needed
}


export default function ProfilePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [healthRecords, setHealthRecords] = useState<Array<{
    _id: string;
    name: string;
    uploadedAt: string;
    contentType: string;
    data: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showCompleteProfileCard, setShowCompleteProfileCard] = useState(false);
  const [activeTab, setActiveTab] = useState<"healthRecords" | "appointments">("healthRecords");
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [previewRecord, setPreviewRecord] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const steps = [
    { name: 'Basic Information', icon: <User className="step-icon" /> },
    { name: 'Address Details', icon: <Home className="step-icon" /> },
    { name: 'Emergency Contact', icon: <Phone className="step-icon" /> },
    { name: 'Vital Statistics', icon: <Activity className="step-icon" /> },
    { name: 'Allergies', icon: <AlertCircle className="step-icon" /> },
    { name: 'Current Medications', icon: <Heart className="step-icon" /> }
  ];
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      
      // Create preview URL for PDFs
      if (selectedFile.type === 'application/pdf') {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Clear selected file
  const clearSelectedFile = () => {
    setFile(null);
    setSelectedFileName("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Handle record preview
  const handleRecordPreview = (record: any) => {
    // Ensure we have the correct data format
    const base64Data = record.data instanceof Uint8Array 
      ? btoa(String.fromCharCode.apply(null, record.data))
      : record.data;

    setPreviewRecord({
      name: record.name,
      url: `data:${record.contentType};base64,${base64Data}`,
      type: record.contentType
    });
    setShowPreview(true);
  };

  // Close preview modal
  const closePreview = () => {
    setShowPreview(false);
    setPreviewRecord(null);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
  

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get<{ data: UserDetails }>("/api/users/me");
      if (res.data && res.data.data) {
        setUserDetails(res.data.data);
        if (!res.data.data.isCompleteProfile) {
          setShowCompleteProfileCard(true);
        }
      } else {
        toast.error("Failed to get user details");
        return;
      }
  
      try {
        const healthRecordsRes = await axios.get('/api/get-health-records', {
          headers: { userId: res.data.data._id },
        });
      
        if (healthRecordsRes.data && healthRecordsRes.data.records) {
          setHealthRecords(healthRecordsRes.data.records);
        } else {
          console.log("No health records found");
          setHealthRecords([]);
        }
      } catch (error:any) {
        console.error("Error fetching health records:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to fetch health records");
      }
      
    } catch (error: any) {
      console.error("Error fetching user details or health records:", error);
      toast.error("Failed to fetch user details or health records");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchUserDetails();
  }, []);
  // const handleCompleteProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  
  //   if (!userDetails?._id) {
  //     toast.error('User ID not found');
  //     return;
  //   }
  
  //   try {
  //     setLoading(true);
      
  //     const formData = new FormData();
      
  //     // Append all form fields
  //     formData.append('userId', userDetails._id);
  //     formData.append('username', userDetails.username);
  //     formData.append('email', userDetails.email);
  //     formData.append('firstName', formData.firstName);
  //     formData.append('lastName', formData.lastName);
  //     formData.append('phoneNumber', formData.phoneNumber);
  //     formData.append('gender', formData.gender);
      
  //     // Address
  //     formData.append('street', formData.street);
  //     formData.append('city', formData.city);
  //     formData.append('state', formData.state);
  //     formData.append('zipCode', formData.zipCode);
      
  //     // Emergency Contact
  //     formData.append('emergencyContactName', formData.emergencyName);
  //     formData.append('emergencyContactPhone', formData.emergencyContact);
      
  //     // Vital Stats
  //     formData.append('weight', formData.weight);
  //     formData.append('height', formData.height);
  //     formData.append('bloodGroup', formData.bloodGroup);
  //     formData.append('bloodPressure', formData.bloodPressure);
  
  //     const response = await fetch('/api/users/complete-profile', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       toast.success('Profile completed successfully');
  //       setUserDetails(data.data);
  //       setShowCompleteProfileCard(false);
  //     } else {
  //       throw new Error(data.error || 'Failed to complete profile');
  //     }
  //   } catch (error: any) {
  //     console.error('Error completing profile:', error);
  //     toast.error(error.message || 'An error occurred while updating profile');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      alert("No file uploaded");
      return;
    }

    if (!userDetails || !userDetails._id) {
      alert("User details not available. Please try again later.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userDetails._id);

    try {
      setLoading(true);
      const res = await fetch("/api/upload-mongo-image", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload response:", result);

      if (result.success) {
        alert("Successfully Uploaded");

        // Update profile photo URL immediately
        setUserDetails((prev) =>
          prev ? { ...prev, profilePhotoUrl: result.updatedProfilePhotoUrl } : null
        );
      } else {
        alert("Failed to upload: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during the upload process.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForHealthRecord = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
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
        console.log(healthRecords);
        if (healthRecordsRes.data && healthRecordsRes.data.records) {
          setHealthRecords(healthRecordsRes.data.records);
        }
        
        // Clear the form
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
  useEffect(() => {
    const fetchImages = async () => {
      if (!userDetails || !userDetails._id) {
        console.warn('User details not available yet.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get-mongo-image', {
          headers: {
            userId: userDetails._id,
          },
        });
        const result = await response.json();
        if (result.success) {
          setImages(result.images);
        } else {
          alert('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userDetails]);

  const fetchAppointments = async () => {
    if (!userDetails || !userDetails._id) {
      console.warn("User details not available yet.");
      return;
    }

  
    try {
      setLoading(true);
  
      const response = await axios.get('/api/get-appointments', {
        headers: {
          userId: userDetails._id,
        },
      });
  
      if (response.data.success) {
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
  

// Trigger fetch when activeTab is "appointments"
useEffect(() => {
  if (activeTab === "appointments") {
    fetchAppointments();
  }
}, [activeTab]);

  return (
  <>
    {!showCompleteProfileCard && userDetails && (
      <NavbarWrapper/>
    )}
    <div className="profile-container">
      {showCompleteProfileCard && (
       <ProfileForm
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          setShowCompleteProfileCard={setShowCompleteProfileCard}
       />
      )}
      {!showCompleteProfileCard && userDetails && (
        
        <>
        <div className="profile-card">
          <div className="profile-image-container">
            {loading ? (
              <p>Loading image...</p>
            ) : images.length > 0 ? (
              <img
                src={`data:${images[images.length-1].contentType};base64,${btoa(
                  new Uint8Array(images[images.length-1].data.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                )}`}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <p>No profile image</p>
            )}
          </div>
          <h1 className="profile-header">Profile</h1>
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : userDetails ? (
            <div className="profile-details">
              <p><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone:</strong> {userDetails.phoneNumber}</p>
              {/* <p><strong>Age:</strong> {userDetails.age}</p> */}
              <p><strong>Gender:</strong> {userDetails.gender}</p>
              <p>
                <strong>Emergency Contact:</strong>{' '}
                {userDetails.emergencyContact ? (
                  <>
                    {userDetails.emergencyContact.name || 'N/A'} 
                    {userDetails.emergencyContact.phoneNumber ? 
                      `(+91 ${userDetails.emergencyContact.phoneNumber})` : 
                      '(No phone number provided)'
                    }
                  </>
                ) : (
                  'No emergency contact provided'
                )}
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {userDetails.address ? (
                  <>
                    {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state} - {userDetails.address.zipCode}
                  </>
                ) : (
                  'No address provided'
                )}
              </p>
              <div className="profile-actions">
                <label className="custom-file-upload">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  Choose File
                </label>
                <button 
                  className="upload-btn"
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Profile Picture"}
                </button>
                <button 
                  className="logout-btn" 
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </div>
        <div className="health-record-container">
          <h2>Manage Records</h2>
          {/* Tab Selector */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "healthRecords" ? "active" : ""}`}
              onClick={() => setActiveTab("healthRecords")}
            >
              Health Records
            </button>
            <button
              className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
          </div>

          {/* Conditional Rendering */}
          {activeTab === "healthRecords" && (
            <>
              {loading ? (
                <p>Loading health records...</p>
              ) : healthRecords.length > 0 ? (
                <div className="health-records-list">
                  {healthRecords.map((record, index) => (
                    <div key={index} className="health-record-item">
                      <div className="record-info">
                        <FileText className="file-icon" />
                        <span>{record.name}</span>
                      </div>
                      <button 
                        className="preview-btn"
                        onClick={() => handleRecordPreview(record)}
                      >
                        <Eye className="preview-icon" />
                        Preview
                      </button>
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
            </>
          )}

          {activeTab === "appointments" && (
            <div className="appointments-list">
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length > 0 ? (
                <ul style={{padding: "0px"}}>
                  {appointments.map((appointment:Appointment) => (
                    <li key={appointment._id} className="appointment-item">
                      <h3>{appointment.doctorName.split('|')[0]}</h3>
                      {appointment.identity=="2" && (<p>Specialty: {appointment.specialty}</p>)}
                      
                      <p>Date: {appointment.appointmentDate}</p>
                      <p>Time: {appointment.appointmentTime}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments available</p>
              )}
            </div>
          )}

        </div>
          {/* Preview Modal */}
      {showPreview && previewRecord && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <div className="preview-modal-header">
              <h3>{previewRecord.name}</h3>
              <button 
                className="close-preview" 
                onClick={closePreview}
              >
                <X size={24} />
              </button>
            </div>
            <div className="preview-modal-content">
  { previewRecord.type && previewRecord.type.includes('pdf') ? (
    <iframe 
      src={previewRecord.url}
      className="pdf-preview"
      title="PDF preview"
    />
  ) : (
    <div className="unsupported-format">
      <FileText size={48} />
      <p>Preview not available for this file format</p>
      <a 
        href={previewRecord?.url} 
        download={previewRecord?.name}
        className="download-btn"
      >
        Download File
      </a>
    </div>
  )}
</div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  </>
);

}
"use client";
import React, { useState, useEffect } from 'react';
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { X, FileText, Upload, Eye, User, Home, Phone, Activity, Heart, AlertCircle, ChevronLeft,Mail,MapPin,Calendar } from 'lucide-react';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ProfileStepsForm from './ProfileForm';
import "./profile.css";
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
  vitalStats: {
    weight: string;
    height: string;
    bloodGroup: string;
    bloodPressure: string;
  };
  profilePhotoUrl?: string;
  isVerified: boolean;
  isCompleteProfile: boolean;
};




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
  const [images, setImages] = useState([]);
  const [showCompleteProfileCard, setShowCompleteProfileCard] = useState(false);
  const [activeTab, setActiveTab] = useState<"healthRecords" | "appointments">("healthRecords");
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
  const handleCompleteProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!userDetails?._id) {
      toast.error('User ID not found');
      return;
    }
  
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Append all form fields
      formData.append('userId', userDetails._id);
      formData.append('username', userDetails.username);
      formData.append('email', userDetails.email);
      formData.append('firstName', formData.firstName);
      formData.append('lastName', formData.lastName);
      formData.append('phoneNumber', formData.phoneNumber);
      formData.append('gender', formData.gender);
      
      // Address
      formData.append('street', formData.street);
      formData.append('city', formData.city);
      formData.append('state', formData.state);
      formData.append('zipCode', formData.zipCode);
      
      // Emergency Contact
      formData.append('emergencyContactName', formData.emergencyName);
      formData.append('emergencyContactPhone', formData.emergencyContact);
      
      // Vital Stats
      formData.append('weight', formData.weight);
      formData.append('height', formData.height);
      formData.append('bloodGroup', formData.bloodGroup);
      formData.append('bloodPressure', formData.bloodPressure);
  
      const response = await fetch('/api/users/complete-profile', {
        method: 'POST',
        body: formData,
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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSubmitForHealthRecord = async (e: React.FormEvent<HTMLFormElement>) => {
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
  <div className="profile-page">
    {showCompleteProfileCard ? (
      <ProfileStepsForm
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        setShowCompleteProfileCard={setShowCompleteProfileCard}
      />
    ) : (
      <div className="profile-content">
        {/* Main Profile Section */}
        <div className="profile-main">
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
                    className="photo"
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
      if (!file || !userDetails?._id) return;

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
          toast.success("Successfully Uploaded");
          // Update profile photo URL immediately
          setUserDetails((prev) =>
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
              <h1>{userDetails?.firstName} {userDetails?.lastName}</h1>
              <div className="contact-info">
                <span><Mail size={16} /> {userDetails?.email}</span>
                <span><Phone size={16} /> {userDetails?.phoneNumber}</span>
                <span><MapPin size={16} /> {userDetails?.address?.city}, {userDetails?.address?.state}</span>
              </div>
            </div>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>

          {/* Details Cards */}
          <div className="details-grid">
            <div className="detail-card">
              <Heart className="card-icon" />
              <div className="card-content">
                <h3>Health Info</h3>
                <p><strong>Age:</strong> {userDetails?.age}</p>
                <p><strong>Gender:</strong> {userDetails?.gender}</p>
                <p><strong>Blood Group: </strong>{userDetails?.vitalStats?.bloodGroup || 'Not provided'}</p>
      <p><strong>Weight: </strong>{userDetails?.vitalStats?.weight ? `${userDetails.vitalStats.weight} kg` : 'Not provided'}</p>
      <p><strong>Height: </strong>{userDetails?.vitalStats?.height ? `${userDetails.vitalStats.height} cm` : 'Not provided'}</p>
              </div>
            </div>

            <div className="detail-card">
              <AlertCircle className="card-icon" />
              <div className="card-content">
                <h3>Emergency Contact</h3>
                <p><strong>Name: </strong>{userDetails?.emergencyContact?.name || 'Not provided'}</p>
      <p><strong>Phone: </strong>{userDetails?.emergencyContact?.phoneNumber ? 
        `+91 ${userDetails.emergencyContact.phoneNumber}` : 
        'Not provided'}</p>
              </div>
            </div>

            <div className="detail-card">
              <MapPin className="card-icon" />
              <div className="card-content">
                <h3>Address</h3>
                <p><strong>Street: </strong>{userDetails?.address?.street || 'Not provided'}</p>
      <p><strong>City: </strong>{userDetails?.address?.city || 'Not provided'}</p>
      <p><strong>State: </strong>{userDetails?.address?.state || 'Not provided'}</p>
      <p><strong>Zip Code: </strong>{userDetails?.address?.zipCode || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Records Section */}
          <div className="records-section">
            <div className="section-header">
              <h2>Medical Records</h2>
              <div className="tab-buttons">
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
            </div>

            <div className="records-content">
              {activeTab === "healthRecords" && (
                <div className="health-records">
                  {loading ? (
                    <div className="loading">Loading records...</div>
                  ) : healthRecords.length > 0 ? (
                    <div className="records-list">
                      {healthRecords.map((record, index) => (
                        <div key={index} className="record-item">
                          <div className="record-info">
                            <FileText size={20} />
                            <span>{record.name}</span>
                          </div>
                          <button 
                            className="preview-button"
                            onClick={() => handleRecordPreview(record)}
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-records">No health records available</div>
                  )}

                  <div className="upload-section">
                    {selectedFileName && (
                      <div className="selected-file">
                        <div className="file-info">
                          <FileText size={16} />
                          <span>{selectedFileName}</span>
                        </div>
                        <button 
                          className="clear-file-btn" 
                          onClick={clearSelectedFile}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    
                    <div className="upload-controls">
                      <label className="file-select-btn">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        Choose File
                      </label>
                      <button
                        className="upload-submit-btn"
                        onClick={handleSubmitForHealthRecord}
                        disabled={!selectedFileName || loading}
                      >
                        {loading ? "Uploading..." : (
                          <>
                            <Upload size={16} />
                            Upload Record
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="appointments">
                  {loading ? (
                    <div className="loading">Loading appointments...</div>
                  ) : appointments.length > 0 ? (
                    <div className="appointments-list">
                      {appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-card">
                          <div className="appointment-header">
                            <Calendar size={20} />
                            <h3>{appointment.doctorName.split('|')[0]}</h3>
                          </div>
                          {appointment.identity === "2" && (
                            <p className="specialty">Specialty: {appointment.specialty}</p>
                          )}
                          <div className="appointment-details">
                            <p>Date: {appointment.appointmentDate}</p>
                            <p>Time: {appointment.appointmentTime}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-appointments">No appointments scheduled</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Preview Modal */}
    {showPreview && previewRecord && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>{previewRecord.name}</h3>
            <button className="close-modal" onClick={closePreview}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-content">
            {previewRecord.type && previewRecord.type.includes('pdf') ? (
              <iframe 
                src={previewRecord.url}
                className="pdf-viewer"
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
  </div>
);
};
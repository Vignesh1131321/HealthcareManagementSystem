"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./profile.css";
import Header from "../components/Header";
import { signOut } from "next-auth/react";
// import . from "../api/u";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { X, FileText, Upload, Eye } from 'lucide-react';
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
  age: number;
  gender: string;
  profilePhotoUrl?: string;
  isCompleteProfile: boolean;
};

type HealthRecord = {
  name: string;
  uploadedAt: string;
};


export default function ProfilePage() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [healthRecords, setHealthRecords] = useState<Array<{
    _id: string;
    name: string;
    uploadedAt: string;
    contentType: string;
    data: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
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
  
    if (!userDetails) {
      toast.error("User details not available");
      return;
    }
  
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("username", userDetails.username);
      formData.append("email", userDetails.email);
      formData.append("firstName", userDetails.firstName);
      formData.append("lastName", userDetails.lastName);
      formData.append("phoneNumber", userDetails.phoneNumber);
      formData.append("age", String(userDetails.age || ""));
      formData.append("gender", userDetails.gender || "");
  
      if (userDetails.emergencyContact?.name && userDetails.emergencyContact?.phoneNumber) {
        formData.append("emergencyContactName", userDetails.emergencyContact.name);
        formData.append("emergencyContactPhone", userDetails.emergencyContact.phoneNumber);
      }

      if (userDetails.address) {
        formData.append("street", userDetails.address.street || '');
        formData.append("city", userDetails.address.city || '');
        formData.append("state", userDetails.address.state || '');
        formData.append("zipCode", userDetails.address.zipCode || '');
      }
      
      const response = await fetch("/api/users/complete-profile", {
        method: "POST",
        body: formData, // Send form data
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("Profile completed successfully");
        setShowCompleteProfileCard(false);
        setUserDetails(data.data);
      } else {
        toast.error(data.error || "Failed to complete profile");
      }
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast.error(error.message || "An error occurred");
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
        
        // Format the new record properly
        const newRecord = {
          _id: result.record._id,
          name: result.record.name,
          uploadedAt: result.record.uploadedAt,
          contentType: result.record.contentType,
          data: result.record.data // This should already be base64 encoded from the server
        };
        
        // Update records state with the new record
        setHealthRecords(prev => [...prev, newRecord]);
        
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
    <NavbarWrapper/>
    <div className="profile-container">
      {showCompleteProfileCard && (
        <div className="complete-profile-card">
          <h2>Complete Your Profile</h2>
            <form onSubmit={handleCompleteProfileSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={userDetails?.username || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, username: e.target.value } : null)}
              />
              <input
                type="email"
                placeholder="Email"
                value={userDetails?.email || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, email: e.target.value } : null)}
              />
              <input
                type="text"
                placeholder="First Name"
                value={userDetails?.firstName || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, firstName: e.target.value } : null)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={userDetails?.lastName || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, lastName: e.target.value } : null)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={userDetails?.phoneNumber || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, phoneNumber: e.target.value } : null)}
              />
              <input
                type="text"
                placeholder="Emergency Contact Name"
                value={userDetails?.emergencyContact?.name || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value } } : null)}
              />
              <input
                type="text"
                placeholder="Emergency Contact Phone"
                value={userDetails?.emergencyContact?.phoneNumber || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, emergencyContact: { ...prev.emergencyContact, phoneNumber: e.target.value } } : null)}
              />
              <input
                type="text"
                placeholder="Street"
                value={userDetails?.address?.street || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, address: { ...prev.address, street: e.target.value } } : null)}
              />
              <input
                type="text"
                placeholder="City"
                value={userDetails?.address?.city || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, address: { ...prev.address, city: e.target.value } } : null)}
              />
              <input
                type="text"
                placeholder="State"
                value={userDetails?.address?.state || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, address: { ...prev.address, state: e.target.value } } : null)}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={userDetails?.address?.zipCode || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, address: { ...prev.address, zipCode: e.target.value } } : null)}
              />
              <input
                type="number"
                placeholder="Age"
                value={userDetails?.age || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, age: parseInt(e.target.value) } : null)}
              />
              <input
                type="text"
                placeholder="Gender"
                value={userDetails?.gender || ""}
                onChange={(e) => setUserDetails((prev) => prev ? { ...prev, gender: e.target.value } : null)}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          <button onClick={() => setShowCompleteProfileCard(false)}>Close</button>
        </div>
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
              <p><strong>Age:</strong> {userDetails.age}</p>
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
                  {appointments.map((appointment) => (
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

"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./profile.css";
import Header from "../components/Header";
import { signOut } from "next-auth/react";
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
};

type HealthRecord = {
  date: string;
  description: string;
  doctor: string;
};

type UploadedFile = {
  name: string;
  url: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  // const logout = async () => {
  //   try {
  //     await axios.get("/api/users/logout");
  //     toast.success("Logged Out Successfully");
  //     router.push("/login");
  //   } catch (error: any) {
  //     console.error(error.message);
  //     toast.error("Failed to Logout");
  //   }
  // };
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
  const getUserDetails = async () => {
    try {
      const res = await axios.get<{ data: UserDetails }>("/api/users/me");
      console.log("Fetched user details:", res.data.data);
      setUserDetails(res.data.data);

      // Mock health records
      setHealthRecords([
        { date: "2024-12-01", description: "Routine Checkup", doctor: "Dr. Smith" },
        { date: "2024-12-15", description: "Dental Cleaning", doctor: "Dr. Adams" },
        { date: "2025-01-10", description: "Eye Examination", doctor: "Dr. Lee" },
      ]);

      // Fetch uploaded files (Mock API endpoint)
      const uploadedFilesRes = await axios.get<{ data: UploadedFile[] }>("/api/health-records");
      setUploadedFiles(uploadedFilesRes.data.data);

      // Fetch additional records using EHR/FHIR APIs (Replace this with actual API integration)
      const ehrRecordsRes = await axios.get<{ data: HealthRecord[] }>("/api/fhir/records");
      setHealthRecords((prevRecords) => [...prevRecords, ...ehrRecordsRes.data.data]);
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to fetch user details or health records");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await axios.post<{ data: UploadedFile }>("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedFiles((prevFiles) => [...prevFiles, res.data.data]);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to upload file");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const handleCompleteProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userDetails || !userDetails._id) {
      toast.error("User details not available");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(userDetails).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });

      const res = await fetch('/api/users/complete-profile', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      
      if (result.success) {
        toast.success("Profile completed successfully");
        setShowCompleteProfileCard(false);
        setUserDetails(result.data);
      } else {
        toast.error("Failed to complete profile: " + result.message);
      }
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast.error("An error occurred during the profile completion process.");
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

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-image-container">
            <img
              src="https://imgs.search.brave.com/BpXs26bfzlO4TBTMItL09Tq1qrkHu8NPCaOCrWGt1hE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vc2xpZGVz/LzMxMzYzNDlmYjhl/YzRiZTRiNmU3NTI3/OGQ1MjEyZGVkLndl/YnA"
              alt="User Profile"
              className="profile-image"
            />
          </div>
          <h1 className="profile-header">User Profile</h1>
          <hr />
          {loading ? (
            <p className="loading-text">Loading user details...</p>
          ) : userDetails ? (
            <div className="profile-details">
              <p>
                <strong>Name:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
            </div>
          ) : (
            <p className="error-text">No user details found. Please log in again.</p>
          )}
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="health-record-container">
          <h2>Health Records</h2>
          <div className="health-record-list">
            {healthRecords.map((record, index) => (
              <div key={index} className="health-record-card">
                <p className="record-date">
                  <strong>Date:</strong> {record.date}
                </p>
                <p className="record-description">
                  <strong>Description:</strong> {record.description}
                </p>
                <p className="record-doctor">
                  <strong>Doctor:</strong> {record.doctor}
                </p>
              </div>
            ))}
          </div>
          <div className="file-upload-section">
            <h3>Upload Health Records</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="file-input"
            />
            <div className="uploaded-files-list">
              <h3>Uploaded Files</h3>
              {uploadedFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uploaded-file-link"
                >
                  {file.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

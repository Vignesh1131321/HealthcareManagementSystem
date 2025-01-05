"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./profile.css";
import Header from "../components/Header";

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

export default function ProfilePage() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState([]);
  const [showCompleteProfileCard, setShowCompleteProfileCard] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged Out Successfully");
      router.push("/login");
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to Logout");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get<{ data: UserDetails }>("/api/users/me");
      console.log("Fetched user details:", res.data.data);
      setUserDetails(res.data.data);
      if (!res.data.data.isCompleteProfile) {
        setShowCompleteProfileCard(true);
      }
      // Mock health records (replace with actual data if available)
      setHealthRecords([
        { date: "2024-12-01", description: "Routine Checkup", doctor: "Dr. Smith" },
        { date: "2024-12-15", description: "Dental Cleaning", doctor: "Dr. Adams" },
        { date: "2025-01-10", description: "Eye Examination", doctor: "Dr. Lee" },
      ]);
    } catch (error: any) {
      console.error("Failed to fetch user details:", error.message);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
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
        <div className="profile-card">
          <div className="profile-image-container">
            {loading ? (
              <p>Loading image...</p>
            ) : images.length > 0 ? (
              <img
                src={`data:${images[0].contentType};base64,${btoa(
                  new Uint8Array(images[0].data.data).reduce(
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
          <h1>Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : userDetails ? (
            <div className="profile-details">
              <p><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone:</strong> {userDetails.phoneNumber}</p>
              <p><strong>Age:</strong> {userDetails.age}</p>
              <p><strong>Gender:</strong> {userDetails.gender}</p>
              <p><strong>Emergency Contact:</strong> {userDetails.emergencyContact?.name} ({userDetails.emergencyContact?.phoneNumber})</p>
              <div className="profile-actions">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button onClick={handleSubmit} disabled={loading}>
                  Upload Profile Picture
                </button>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </div>
      )}
      <div className="health-records">
        <h2>Health Records</h2>
        <div className="health-record-list">
          {healthRecords.map((record, index) => (
            <div key={index} className="health-record-card">
              <p><strong>Date:</strong> {record.date}</p>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Doctor:</strong> {record.doctor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

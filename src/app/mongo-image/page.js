'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadMongoImage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user details when the component mounts
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        setUserDetails(res.data.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    getUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('No file uploaded');
      return;
    }

    if (!userDetails || !userDetails._id) {
      alert('User details not available. Please try again later.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userDetails._id);

    try {
      setLoading(true);
      const res = await fetch('/api/upload-mongo-image', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert('Successfully Uploaded');
      } else {
        alert('Failed to upload: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during the upload process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      {userDetails ? (
        <p>Welcome, {userDetails.username}!</p>
      ) : (
        <p>Loading user details...</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadMongoImage;

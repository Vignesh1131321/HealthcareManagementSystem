'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetMongoImage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch images when userDetails are available
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
    <div>
      <h2>Get Images from MongoDB</h2>
      {userDetails ? (
        <p>Welcome, {userDetails.username}!</p>
      ) : (
        <p>Loading user details...</p>
      )}

      {loading ? (
        <p>Loading images...</p>
      ) : images.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {images.map((image) => (
            <div key={image._id} style={{ margin: '10px' }}>
              <img
                src={`data:${image.contentType};base64,${btoa(
                  new Uint8Array(image.data.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                )}`}
                alt={image.name}
                style={{ width: '200px', height: '200px' }}
              />
              <p>{image.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
};

export default GetMongoImage;

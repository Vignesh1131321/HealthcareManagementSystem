"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "500px",
};

const HospitalLocator = () => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null); // Initially null for dynamic location

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4", // Use your API key here
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };
          setMapCenter(currentLocation);
          fetchHospitals(currentLocation);
        },
        (error) => {
          console.error("Error fetching user location:", error);
          // Fallback to a default location if location access is denied
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
          setMapCenter(defaultLocation);
          fetchHospitals(defaultLocation);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location
      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      setMapCenter(defaultLocation);
      fetchHospitals(defaultLocation);
    }
  };

  const fetchHospitals = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const request = {
      location,
      radius: 500000, 
      type: "hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results);
      } else {
        console.error("Error fetching hospitals:", status);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Hospital Locator</h1>
      {isLoaded ? (
        mapCenter ? (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={13}
              onLoad={(map) => console.log("Map Loaded", map)}
            >
              {hospitals.map((hospital) => (
                <Marker
                  key={hospital.place_id}
                  position={{
                    lat: hospital.geometry.location.lat(),
                    lng: hospital.geometry.location.lng(),
                  }}
                  title={hospital.name}
                />
              ))}
            </GoogleMap>
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <h2>Nearby Hospitals:</h2>
              <ul>
                {hospitals.map((hospital) => (
                  <li key={hospital.place_id}>
                    <strong>{hospital.name}</strong>
                    <p>{hospital.vicinity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Fetching your location...</p>
        )
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default HospitalLocator;
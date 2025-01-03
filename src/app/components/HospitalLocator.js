"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "500px",
};

const HospitalLocator = () => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [hoveredHospital, setHoveredHospital] = useState(null); // Track the hovered hospital

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4",
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
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
          setMapCenter(defaultLocation);
          fetchHospitals(defaultLocation);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      setMapCenter(defaultLocation);
      fetchHospitals(defaultLocation);
    }
  };

  const fetchHospitals = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const request = {
      location,
      radius: 5000,
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
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.place_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: "box-shadow 0.3s ease",
                    }}
                    onMouseEnter={() => setHoveredHospital(hospital.place_id)}
                    onMouseLeave={() => setHoveredHospital(null)}
                  >
                    <div>
                      <strong>{hospital.name}</strong>
                      <p>{hospital.vicinity}</p>
                    </div>
                    {hoveredHospital === hospital.place_id && (
                      <button
                        style={{
                          padding: "10px 15px",
                          borderRadius: "8px",
                          backgroundColor: "#6b43ff",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
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

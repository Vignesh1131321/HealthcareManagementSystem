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
  const [manualLocation, setManualLocation] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredHospital, setHoveredHospital] = useState(null);

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
        () => {
          setErrorMessage("Unable to fetch your location. Please enter manually.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
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
        setErrorMessage("");
      } else {
        setHospitals([]);
        setErrorMessage("No hospitals found near the selected location.");
      }
    });
  };

  const handleAutocomplete = (query) => {
    setManualLocation(query);
    if (!query) {
      setAutocompleteSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: query }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setAutocompleteSuggestions(predictions);
      } else {
        setAutocompleteSuggestions([]);
      }
    });
  };

  const handlePlaceSelect = (placeId) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        const newLocation = { lat: location.lat(), lng: location.lng() };
        setMapCenter(newLocation);
        fetchHospitals(newLocation);
        setAutocompleteSuggestions([]);
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid location selected.");
      }
    });
  };

  const handleSearch = () => {
    if (autocompleteSuggestions.length > 0) {
      handlePlaceSelect(autocompleteSuggestions[0].place_id);
    } else {
      setErrorMessage("Please select a valid location from the suggestions.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Hospital Locator</h1>
      <div style={{ marginBottom: "20px", textAlign: "center", position: "relative" }}>
        <p>Enter your location manually</p>
        <div style={{ display: "flex", alignItems: "center", position: "relative", width: "300px" }}>
          <input
            type="text"
            value={manualLocation}
            onChange={(e) => handleAutocomplete(e.target.value)}
            placeholder="Enter your location"
            style={{
              padding: "10px",
              borderRadius: "8px 0 0 8px",
              border: "1px solid #ccc",
              width: "calc(100% - 50px)",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 15px",
              backgroundColor: "#6b43ff",
              color: "white",
              border: "none",
              borderRadius: "0 8px 8px 0",
              cursor: "pointer",
              fontWeight: "bold",
              height: "38px"
            }}
          >
            Enter
          </button>
        </div>
        {autocompleteSuggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              listStyle: "none",
              margin: 0,
              padding: "10px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              zIndex: 1000,
            }}
          >
            {autocompleteSuggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handlePlaceSelect(suggestion.place_id)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {isLoaded ? (
        mapCenter ? (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={13}
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
            <div style={{ width: "100%", maxWidth: "600px", marginTop: "20px" }}>
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

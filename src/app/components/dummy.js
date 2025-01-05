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
      radius: 500000, 
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
    

  );
};

export default HospitalLocator;
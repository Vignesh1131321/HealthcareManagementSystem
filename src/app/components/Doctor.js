"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Building2, Phone, MapPin, Star, Clock ,Search} from 'lucide-react';
import "./HospitalLocator.css";

const Doctor = ({ specialty }) => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialty1 = searchParams.get('specialty');

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
          setMapCenter({ lat: latitude, lng: longitude });
          fetchHospitals({ lat: latitude, lng: longitude });
        },
        () => setErrorMessage("Unable to fetch your location. Please enter manually.")
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const fetchHospitals = async (location) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(
      {
        location,
        radius: 5000,
        keyword: specialty1 || specialty,
      },
      async (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const placesWithDetails = await Promise.all(
            results.map(place => fetchPlaceDetails(place))
          );
          setHospitals(placesWithDetails.filter(Boolean));
          setErrorMessage("");
        } else {
          setHospitals([]);
          setErrorMessage("No specialists found nearby.");
        }
      }
    );
  };

  const fetchPlaceDetails = (place) => {
    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      
      service.getDetails(
        {
          placeId: place.place_id,
          fields: ['formatted_phone_number', 'opening_hours', 'reviews']
        },
        (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              ...place,
              formatted_phone_number: details.formatted_phone_number,
              opening_hours: details.opening_hours,
              reviews: details.reviews
            });
          } else {
            resolve(place);
          }
        }
      );
    });
  };

  const handleAutocomplete = (query) => {
    setManualLocation(query);
    if (!query) {
      setAutocompleteSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: query },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAutocompleteSuggestions(predictions);
        } else {
          setAutocompleteSuggestions([]);
        }
      }
    );
  };

  const handlePlaceSelect = (placeId) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = { lat: location.lat(), lng: location.lng() };
        setMapCenter(newLocation);
        fetchHospitals(newLocation);
        setAutocompleteSuggestions([]);
        setManualLocation(results[0].formatted_address);
      }
    });
  };

  const handleBookAppointment = (hospital) => {
    if (!hospital || !hospital.name || !hospital.vicinity || !hospital.geometry) {
      console.error("Invalid hospital data:", hospital);
      return;
    }

    const doctorDetails = {
      identity: "2",
      id: hospital.place_id,
      name: hospital.name,
      specialty: specialty1 || specialty,
      clinicName: hospital.name,
      clinicLocation: {
        address: hospital.vicinity,
        city: "City",
        state: "State",
        zip: "Zip",
      },
      contact: {
        phone: hospital.formatted_phone_number || "Phone not available",
        email: "contact@clinic.com",
      },
      availableTimes: [
        { day: "Monday", time: "9:00 AM - 5:00 PM" },
        { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
      ],
      reviews: (hospital.reviews || []).map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
      })),
    };

    router.push(`/appointment?doctor=${encodeURIComponent(JSON.stringify(doctorDetails))}`);
  };

  return (
    <div className="hospital-locator-container">
     
      <div className="main-container">
        <h1 className="page-title">Find a {(specialty1 || specialty)?.charAt(0).toUpperCase() + (specialty1 || specialty)?.slice(1)}</h1>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => handleAutocomplete(e.target.value)}
              placeholder="Enter location..."
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>

          {autocompleteSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {autocompleteSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handlePlaceSelect(suggestion.place_id)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}

        {isLoaded && mapCenter ? (
          <div className="content-container">
            <div className="map-container">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "500px" }}
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
            </div>

            <div className="hospitals-grid">
              {hospitals.map((hospital) => (
                <div key={hospital.place_id} className="hospital-card">
                  <div className="hospital-card-header">
                    <Building2 className="card-icon" size={24} />
                    <h3 className="hospital-name">{hospital.name}</h3>
                  </div>

                  <div className="hospital-info">
                    <div className="info-row">
                      <div className="info-icon-wrapper">
                        <MapPin className="info-icon" size={20} />
                      </div>
                      <p className="hospital-address">{hospital.vicinity}</p>
                    </div>

                    {hospital.rating ? (
  <div className="info-row rating-row">
    <div className="info-icon-wrapper">
      <Star className="info-icon star-icon" size={24} />
    </div>
    <p className="hospital-rating">
      <span className="rating-value">{hospital.rating}</span>
      <span className="rating-max"> / 5</span>
    </p>
  </div>
) : (
  <div className="info-row rating-row">
    <div className="info-icon-wrapper">
      <Star className="info-icon star-icon" size={24} />
    </div>
    <p className="hospital-rating">Rating not available</p>
  </div>
)}

                    <div className="info-row">
                      <div className="info-icon-wrapper">
                        <Clock className="info-icon" size={20} />
                      </div>
                      <p className="hospital-hours">
                        {hospital.opening_hours?.weekday_text?.[0] || "Hours not available"}
                      </p>
                    </div>

                    <div className="contact-info">
                      <div className="info-row">
                        <div className="info-icon-wrapper">
                          <Phone className="info-icon" size={20} />
                        </div>
                        <p className="contact-text">{hospital.formatted_phone_number || "Phone not available"}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookAppointment(hospital)}
                    className="book-button"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="loading-message">Loading map...</div>
        )}
      </div>
    </div>
  );
};

export default Doctor;
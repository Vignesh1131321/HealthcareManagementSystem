

"use client"
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { 
  Search, 
  Building2, 
  Phone, 
  MapPin, 
  Star, 
  Clock, 
  ChevronDown,
  Stethoscope,
  Activity,
  Loader2,
  Shield,
  Heart,
  Filter
} from 'lucide-react';
import "./HospitalLocator.css";
import { FiFilter } from 'react-icons/fi'; // For the filter icon

const HospitalLocator = () => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    distance: "1 km",
    specialty: "All",
    rating: "Any Rating",
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    libraries: ["places"]
  });
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px'
  };
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

  const fetchHospitalDetails = async (hospital) => {
    return new Promise((resolve, reject) => {
      if (hospital.business_status !== 'OPERATIONAL') {
        resolve(null);
        return;
      }

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      
      service.getDetails(
        {
          placeId: hospital.place_id,
          fields: ['formatted_phone_number', 'opening_hours', 'reviews', 'business_status']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              ...hospital,
              formatted_phone_number: place.formatted_phone_number,
              opening_hours: place.opening_hours,
              detailed_reviews: place.reviews,
              business_status: place.business_status || hospital.business_status
            });
          } else {
            resolve(hospital);
          }
        }
      );
    });
  };

  const fetchHospitals = async (location) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    
    const radius = parseInt(filters.distance) * 1000;
    
    service.nearbySearch(
      {
        location,
        radius,
        type: "hospital",
      },
      async (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          let filteredResults = results.filter(hospital => {
            if (filters.rating !== "Any Rating") {
              const minRating = parseInt(filters.rating);
              if (!hospital.rating || hospital.rating < minRating) return false;
            }
            return hospital.business_status === 'OPERATIONAL';
          });

          const hospitalsWithDetails = await Promise.all(
            filteredResults.map(hospital => fetchHospitalDetails(hospital))
          );
          
          setHospitals(hospitalsWithDetails.filter(hospital => hospital !== null));
          setErrorMessage("");
        } else {
          setHospitals([]);
          setErrorMessage("No hospitals found nearby.");
        }
      }
    );
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (mapCenter) {
      fetchHospitals(mapCenter);
    }
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
    if (!hospital?.place_id || hospital.business_status !== 'OPERATIONAL') return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      { 
        placeId: hospital.place_id,
        fields: ['formatted_phone_number', 'opening_hours', 'reviews', 'business_status']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const doctorDetails = {
            identity: "1",
            id: hospital.place_id,
            name: hospital.name,
            specialty: "",
            clinicName: hospital.name,
            clinicLocation: {
              address: hospital.vicinity,
              city: "City",
              state: "State",
              zip: "Zip",
            },
            contact: {
              phone: place.formatted_phone_number || "Not available",
              email: "contact@hospital.com",
            },
            availableTimes: [
              { day: "Monday", time: "9:00 AM - 5:00 PM" },
              { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
            ],
            reviews: (place.reviews || []).map(review => ({
              author: review.author_name,
              rating: review.rating,
              text: review.text,
            })),
          };

          router.push(`/appointment?doctor=${encodeURIComponent(JSON.stringify(doctorDetails))}`);
        }
      }
    );
  };

  return (
    <div className="hospital-page">
      <NavbarWrapper />
      
      <main className="main-content">
        <div className="hero-section">
          <h1>Find Healthcare Near You</h1>
          <p>Discover and connect with top-rated medical facilities in your area</p>
        </div>

        <div className="search-container">
          <div className="search-box">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => handleAutocomplete(e.target.value)}
                placeholder="Enter your location..."
                className="location-input"
              />
            </div>
            
            <button
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="button-icon" />
              <span>Filters</span>
              <ChevronDown className={`arrow-icon ${showFilters ? 'rotate' : ''}`} />
            </button>
          </div>

          {autocompleteSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {autocompleteSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handlePlaceSelect(suggestion.place_id)}
                  className="suggestion-item"
                >
                  <MapPin className="suggestion-icon" />
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}

          <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
            <div className="filter-groups">
              {['Distance', 'Specialty', 'Rating'].map((filterType) => (
                <div key={filterType} className="filter-group">
                  <h3>{filterType}</h3>
                  <div className="filter-options">
                    {filterType === 'Distance' && 
                      ["1 km", "5 km", "10 km", "20 km", "50 km"].map((option) => (
                        <button
                          key={option}
                          className={`filter-option ${filters.distance === option ? 'active' : ''}`}
                          onClick={() => handleFilterChange('distance', option)}
                        >
                          {option}
                        </button>
                      ))
                    }
                    {filterType === 'Specialty' && 
                      ["All", "Emergency", "Cardiology", "Pediatrics", "Orthopedics"].map((option) => (
                        <button
                          key={option}
                          className={`filter-option ${filters.specialty === option ? 'active' : ''}`}
                          onClick={() => handleFilterChange('specialty', option)}
                        >
                          {option}
                        </button>
                      ))
                    }
                    {filterType === 'Rating' && 
                      ["Any Rating", "3+ Rating", "4+ Rating"].map((option) => (
                        <button
                          key={option}
                          className={`filter-option ${filters.rating === option ? 'active' : ''}`}
                          onClick={() => handleFilterChange('rating', option)}
                        >
                          {option}
                        </button>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="error-message">
            <Shield className="error-icon" />
            {errorMessage}
          </div>
        )}

        <div className="content-grid">
          <div className="map-section">
          {isLoaded && mapCenter ? (
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={mapCenter}
    zoom={13}
    // Remove the black and white styling
    options={{
      // No styles needed for default colored map
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    }}
  >
    {hospitals.map((hospital) => (
      <Marker
        key={hospital.place_id}
        position={{
          lat: hospital.geometry.location.lat(),
          lng: hospital.geometry.location.lng(),
        }}
        onClick={() => setSelectedHospital(hospital)}
      />
    ))}
  </GoogleMap>
            ) : (
              <div className="loading-map">
                <Loader2 className="loading-icon" />
                <p>Loading map...</p>
              </div>
            )}
          </div>

          <div className="hospitals-list">
            {hospitals.map((hospital) => (
              <div 
                key={hospital.place_id} 
                className={`hospital-card ${selectedHospital?.place_id === hospital.place_id ? 'selected' : ''}`}
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="hospital-header">
                  <Building2 className="hospital-icon" />
                  <h3>{hospital.name}</h3>
                  {hospital.rating && (
                    <div className="rating">
                      <Star className="star-icon" />
                      <span>{hospital.rating}</span>
                    </div>
                  )}
                </div>

                <div className="hospital-info">
                  <div className="info-row">
                    <MapPin className="info-icon" />
                    <p>{hospital.vicinity}</p>
                  </div>
                  <div className="info-row">
                    <Clock className="info-icon" />
                    <p>{hospital.opening_hours ? 
                      hospital.opening_hours.weekday_text[0] : 
                      "Hours not available"}
                    </p>
                  </div>
                  <div className="info-row">
                    <Phone className="info-icon" />
                    <p>{hospital.formatted_phone_number || "Phone not available"}</p>
                  </div>
                </div>

                <button
                  className="book-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAppointment(hospital);
                  }}
                >
                  <Heart className="button-icon" />
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalLocator;
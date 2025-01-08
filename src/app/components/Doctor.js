/* "use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./Doctor.css";

const containerStyle = {
  width: "80%",
  height: "500px",
};

const Doctor = ({ specialty = "hospital" }) => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const router = useRouter();

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
          fetchHospitals(currentLocation, specialty);
        },
        (error) => {
          console.error("Error fetching user location:", error);
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; 
          setMapCenter(defaultLocation);
          fetchHospitals(defaultLocation, specialty);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      setMapCenter(defaultLocation);
      fetchHospitals(defaultLocation, specialty);
    }
  };

  const fetchHospitals = (location, type) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const request = {
      location,
      radius: 5000,
      keyword: type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results);
      } else {
        console.error("Error fetching hospitals:", status);
      }
    });
  };

  const handleBookAppointment = (hospital) => {
    if (!hospital || !hospital.name || !hospital.vicinity || !hospital.geometry) {
      console.error("Invalid hospital data:", hospital);
      return;
    }

    const doctorDetails = {
      id: hospital.place_id,
      name: hospital.name,
      specialty: specialty,
      clinicName: hospital.name,
      clinicLocation: {
        address: hospital.vicinity,
        city: "City Placeholder",
        state: "State Placeholder",
        zip: "Zip Placeholder",
      },
      contact: {
        phone: "Phone Placeholder",
        email: "Email Placeholder",
      },
      availableTimes: [
        { day: "Monday", time: "9:00 AM - 5:00 PM" },
        { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
      ],
    };

    
    const queryString = encodeURIComponent(JSON.stringify(doctorDetails));
    const url = `/appointment?doctor=${queryString}`;
    
    
    router.push(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Find a {specialty.charAt(0).toUpperCase() + specialty.slice(1)}</h1>
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
              <h2>Nearby {specialty.charAt(0).toUpperCase() + specialty.slice(1)}s:</h2>
              <ul>
                {hospitals.map((hospital) => (
                  <li key={hospital.place_id}>
                    <strong>{hospital.name}</strong>
                    <p>{hospital.vicinity}</p>
                    <button
                      className="book-appointment-btn"
                      onClick={() => handleBookAppointment(hospital)}
                    >
                      Book Appointment
                    </button>
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

export default Doctor;  */



"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Header from "../components/Header";

const containerStyle = {
  width: "80%",
  height: "500px",
};

const Doctor = ({ specialty }) => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredHospital, setHoveredHospital] = useState(null);
  const router = useRouter();

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
      keyword: specialty || "doctor", // Search by specialty
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results);
        setErrorMessage("");
      } else {
        setHospitals([]);
        setErrorMessage("No specialists found near the selected location.");
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

  const handleBookAppointment = (hospital) => {
    if (!hospital || !hospital.name || !hospital.vicinity || !hospital.geometry) {
      console.error("Invalid hospital data:", hospital);
      return;
    }
  
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
  
    // Fetch reviews for the selected hospital
    service.getDetails(
      { placeId: hospital.place_id },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const reviews = place.reviews || [];
  
          const doctorDetails = {
            id: hospital.place_id,
            name: hospital.name,
            specialty: specialty,
            clinicName: hospital.name,
            clinicLocation: {
              address: hospital.vicinity,
              city: "City Placeholder",
              state: "State Placeholder",
              zip: "Zip Placeholder",
            },
            contact: {
              phone: "Phone Placeholder",
              email: "Email Placeholder",
            },
            availableTimes: [
              { day: "Monday", time: "9:00 AM - 5:00 PM" },
              { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
            ],
            reviews: reviews.map((review) => ({
              author: review.author_name,
              rating: review.rating,
              text: review.text,
            })),
          };
  
          const queryString = encodeURIComponent(JSON.stringify(doctorDetails));
          const url = `/appointment?doctor=${queryString}`;
  
          router.push(url);
        } else {
          console.error("Failed to fetch hospital details for reviews.");
        }
      }
    );
  };
  
  return (
    <>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundImage: "url('/hospital-background.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <h1 style={{ color: "#6b43ff", fontSize: "32px", marginBottom: "20px" }}>
          Specialist Locator
        </h1>
        <div style={{ marginBottom: "30px", textAlign: "center", position: "relative", width: "100%", maxWidth: "500px" }}>
          <p style={{ marginBottom: "10px", fontSize: "16px", color: "#555" }}>Enter your location manually</p>
          <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
            <input type="text" value={manualLocation} onChange={(e) => handleAutocomplete(e.target.value)} placeholder="Enter your location" style={{ padding: "12px", borderRadius: "8px 0 0 8px", border: "1px solid #ccc", width: "calc(100% - 60px)", outline: "none", fontSize: "14px" }} />
            <button onClick={handleSearch} style={{ padding: "12px 20px", backgroundColor: "#6b43ff", color: "white", border: "none", borderRadius: "0 8px 8px 0", cursor: "pointer", fontWeight: "bold", transition: "background-color 0.3s ease" }} onMouseOver={(e) => (e.target.style.backgroundColor = "#5a37d1")} onMouseOut={(e) => (e.target.style.backgroundColor = "#6b43ff")}>
              Enter
            </button>
          </div>
          {autocompleteSuggestions.length > 0 && (
            <ul style={{ position: "absolute", top: "110%", left: 0, right: 0, listStyle: "none", margin: 0, padding: "10px", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              {autocompleteSuggestions.map((suggestion) => (
                <li key={suggestion.place_id} onClick={() => handlePlaceSelect(suggestion.place_id)} style={{ padding: "10px", cursor: "pointer", fontSize: "14px", transition: "background-color 0.3s ease" }} onMouseOver={(e) => (e.target.style.backgroundColor = "#f1f1f1")} onMouseOut={(e) => (e.target.style.backgroundColor = "white")}>
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errorMessage && <p style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</p>}
        {isLoaded ? (
          mapCenter ? (
            <>
              <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13}>
                {hospitals.map((hospital) => (
                  <Marker key={hospital.place_id} position={{ lat: hospital.geometry.location.lat(), lng: hospital.geometry.location.lng() }} title={hospital.name} />
                ))}
              </GoogleMap>
              <div className="hospitals-grid-container" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>Nearby Specialists:</h2>
                <div className="hospitals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", paddingLeft: "75px", paddingRight: "75px" }}>
                  {hospitals.map((hospital) => (
                    <div key={hospital.place_id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "20px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }} onMouseEnter={() => setHoveredHospital(hospital.place_id)} onMouseLeave={() => setHoveredHospital(null)}>
                      <div style={{ textAlign: "center" }}>
                        <strong style={{ fontSize: "16px", color: "#333" }}>{hospital.name}</strong>
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>{hospital.vicinity}</p>
                      </div>
                      <button onClick={() => handleBookAppointment(hospital)} style={{ marginTop: "15px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "rgba(107,67,255,0.75)", color: "white", border: "none", cursor: "pointer", fontSize: "14px" }}>
                        Book Appointment
                      </button>
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
    </>
  );
};

export default Doctor;

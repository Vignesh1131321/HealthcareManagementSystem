"use client";
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
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
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

  const fetchReviews = (placeId) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.PlacesService(document.createElement("div"));

      const request = {
        placeId,
        fields: ["reviews"],
      };

      service.getDetails(request, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(result.reviews || []);
        } else {
          console.error("Error fetching reviews:", status);
          resolve([]);
        }
      });
    });
  };

  const handleBookAppointment = async (hospital) => {
    if (!hospital || !hospital.name || !hospital.vicinity || !hospital.geometry) {
      console.error("Invalid hospital data:", hospital);
      return;
    }

    // Fetch reviews for the selected hospital
    const reviews = await fetchReviews(hospital.place_id);

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
      reviews, // Include reviews in the doctor details
    };

    // Create the URL with encoded doctor details
    const queryString = encodeURIComponent(JSON.stringify(doctorDetails));
    const url = `/appointment?doctor=${queryString}`;

    // Navigate to the appointment page
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

export default Doctor;

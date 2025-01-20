import React, { useState, useEffect } from "react";
import styles from "./Services.module.css";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardProps } from "./types";
import { DoctorModal } from "./DoctorModal";
import Emergency from "../../components/Emergency";
import EmergencyConfirm from "../../components/EmergencyConfirm"; // Import EmergencyConfirm
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const servicesData: ServiceCardProps[] = [
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bcc86c97...",
    imageAlt: "Search doctor icon",
    title: "Search doctor",
    description:
      "Choose your doctor from thousands of specialist, general, and trusted hospitals",
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/f603194c...",
    imageAlt: "Emergency care icon",
    title: "Emergency care",
    description:
      "You can get 24/7 urgent care for yourself or your children and your lovely family",
  },
  // Add other services here...
];

export const Services: React.FC = () => {
  const currentDate = new Date();
  const [mapCenter, setMapCenter] = useState<google.maps.LatLng | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>(
    []
  );
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

  const date = currentDate.toLocaleDateString("en-GB").replace(/\//g, "-");
  const time = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, "0")}`;
  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details... from appointment");
      
      const response = await fetch("/../api/users/me");
      
      if (response.ok) {
        const resData = await response.json();
        
        if (resData && resData.data) {
          setUserDetails(resData.data);
  
        } else {
          console.log("Failed to get user details");
        }
      } else {
        console.log("Failed to fetch user details. Server returned an error.");
      }
    } 
    catch (error) {
      console.error("Error fetching user details or health records:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

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
          const currentLocation = new google.maps.LatLng(latitude, longitude);
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

  const fetchHospitals = (location: google.maps.LatLng) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      location,
      radius: 5000,
      keyword: "Nearest Hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results ?? []);
        setErrorMessage("");
      } else {
        setHospitals([]);
        setErrorMessage("No specialists found near the selected location.");
      }
    });
  };

  const handleFindDoctorClick = () => {
    setIsModalOpen(true);
  };

  const handleEmergencyCareClick = () => {
    setShowEmergencyConfirm(true); // Show EmergencyConfirm popup
  };

  const handleConfirmEmergency = async () => {
    setShowEmergencyConfirm(false); // Hide EmergencyConfirm popup
    await handleAppointmentSubmit(); // Book appointment
    setShowEmergencyPopup(true); // Show Emergency popup
  };

  const handleAppointmentSubmit = async () => {
    if (!hospitals.length) {
      alert("No hospitals found nearby.");
      return;
    }

    const appointmentDetails = {
      userId: userDetails._id,
      identity: "1",
      doctorId: hospitals[0].place_id,
      doctorName: hospitals[0].name,
      specialty: "",
      date: date,
      time: time,
    };

    try {
      const response = await fetch("/api/users/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error booking appointment:", error.message);
        alert("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };

  return (
    <div className={styles.servicesContainer}>
      {servicesData.map((service, index) => (
        <div key={index} className={styles.serviceColumn}>
          <ServiceCard
            {...service}
            onClick={
              service.title === "Search doctor"
                ? handleFindDoctorClick
                : service.title === "Emergency care"
                ? handleEmergencyCareClick
                : undefined
            }
          />
        </div>
      ))}
      {isModalOpen && <DoctorModal onClose={() => setIsModalOpen(false)} />}
      {showEmergencyConfirm && (
        <EmergencyConfirm
            isOpen={showEmergencyConfirm}
          onConfirm={handleConfirmEmergency}
          onClose={() => setShowEmergencyConfirm(false)}
        />
      )}
      {showEmergencyPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Emergency />
            <button
              className={styles.closeButton}
              onClick={() => setShowEmergencyPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

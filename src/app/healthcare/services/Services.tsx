// import React from "react";
// import styles from "./Services.module.css";
// import { ServiceCard } from "./ServiceCard";
// import { ServiceCardProps } from "./types";

// const servicesData: ServiceCardProps[] = [
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/bcc86c97d2a1f454d7c56a4523ae36991114bba3b55e0249dce5b16e730bc59c?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Search doctor icon",
//     title: "Search doctor",
//     description:
//       "Choose your doctor from thousands of specialist, general, and trusted hospitals",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/f603194c42343420fed615c51e0db10a9d2c74dc1a226b34282f2993e7b9d15f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Online pharmacy icon",
//     title: "Online pharmacy",
//     description:
//       "Buy your medicines with our mobile application with a simple delivery system",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/9669e28a94a0712decf9cf2aea791a4844a0b2ba5275c0d4c287673faf5bcd92?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Consultation icon",
//     title: "Consultation",
//     description:
//       "Free consultation with our trusted doctors and get the best recomendations",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/15c5bf4fcde5830907277032315d66226187cd0422f88a1e1726a4fd9f7b6645?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Details info icon",
//     title: "Details info",
//     description:
//       "Free consultation with our trusted doctors and get the best recomendations",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/ed902067d3d4dfa717efa5aa3ca976f534514db1426e550709c377f4648c727a?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Emergency care icon",
//     title: "Emergency care",
//     description:
//       "You can get 24/7 urgent care for yourself or your children and your lovely family",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/9d89bab03ab543406445b1ea0544a233d317412dc0a7e20834b16dff0deeeee2?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Tracking icon",
//     title: "Tracking",
//     description: "Track and save your medical history and health data",
//   },
// ];
// export const Services: React.FC = () => {
//   return (
//     <div className={styles.servicesContainer}>
//       {servicesData.map((service, index) => (
//         <div key={index} className={styles.serviceColumn}>
//           <ServiceCard {...service} />
//         </div>
//       ))}
//     </div>
//   );
// };
"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Services.module.css";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardProps } from "./types";
import { DoctorModal } from "./DoctorModal";
import  Emergency  from "../../components/Emergency";
import EmergencyConfirm from "../../components/EmergencyConfirm"; // Import EmergencyConfirm
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { FaRobot, FaHospital } from "react-icons/fa"; // Importing React Icons

const servicesData: ServiceCardProps[] = [
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bcc86c97d2a1f454d7c56a4523ae36991114bba3b55e0249dce5b16e730bc59c?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Search doctor icon",
    title: "Search doctor",
    description:
      "Choose your doctor from thousands of specialist, general, and trusted hospitals",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f603194c42343420fed615c51e0db10a9d2c74dc1a226b34282f2993e7b9d15f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Online pharmacy icon",
    title: "Online Pharmacy",
    description:
      "Buy your medicines with our website with a simple delivery system",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9669e28a94a0712decf9cf2aea791a4844a0b2ba5275c0d4c287673faf5bcd92?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "MediAid",
    title: "MediAid",
    description:
      "Free consultation with our in built AI",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/15c5bf4fcde5830907277032315d66226187cd0422f88a1e1726a4fd9f7b6645?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Search Hospitals icon",
    title: "Search Hospitals",
    description:
      "Quickly locate and access the closest hospitals for immediate care and support.",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/ed902067d3d4dfa717efa5aa3ca976f534514db1426e550709c377f4648c727a?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Emergency care icon",
    title: "Emergency care",
    description:
      "You can get 24/7 urgent care for yourself or your children and your lovely family",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9d89bab03ab543406445b1ea0544a233d317412dc0a7e20834b16dff0deeeee2?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Tracking icon",
    title: "Tracking",
    description: "Track and save your medical history and health data",
  },
];

export const Services: React.FC = () => {

  const currentDate = new Date();
  const [mapCenter, setMapCenter] = useState<google.maps.LatLng | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

const date = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');  // Format: "MM/DD/YYYY" or based on locale
const time = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

type EmergencyContact = {
  name: string;
  phoneNumber: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

type UserDetails = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
  address: Address;
  age: number;
  gender: string;
  profilePhotoUrl: string;
  isCompleteProfile: boolean;
};

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

  // Define the type for the location
  type Location = {
    lat: number;
    lng: number;
  } | null;

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
        keyword:  "Nearest Hospital", // Search by specialty
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
    
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to handle "Search doctor" card click
  const handleFindDoctorClick = () => {
    setIsModalOpen(true);
  };


// Function to handle "Emergency care" card click
/* const handleEmergencyCareClick = () => {
  try {
    if (hospitals.length > 0) {
      const nearestHospital = hospitals[0];
      const currentDate = new Date();
      const appointmentDate = currentDate.toLocaleDateString();
      const appointmentTime = currentDate.toLocaleTimeString();
      handleAppointmentSubmit();
      
      setShowModal(true);

    } else {
      alert("No hospitals found nearby.");
    }
  } catch (error) {
    console.error("Error handling emergency care click:", error);
  }
}; */


/*   const findNearbyHospitals = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4`
    );
    const data = await response.json();
    return data.results;
  }; */
  
/*   const handleAppointmentSubmit = async () => {

    const appointmentDetails = {
      userId : userDetails._id,
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
      
      if (response.ok) {
        
        setShowModal(true);
      } else {
        const error = await response.json();
        console.error("Error booking appointment:", error.message);
        
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      
    }
  }; */
  const router = useRouter();

  const handleSearchHospitals = () => {
    router.push("/hospitals");
  }
  const handleChatbotClick = (): void => {
    router.push("/chat");
  };

  const handleTracking = () => {
    router.push("/profile");
  }

  const handleClickPharmacy = () => {
    router.push("/pharmacy");
  }
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
             : service.title === "MediAid"
             ? handleChatbotClick
             : service.title === "Online Pharmacy"
             ? handleClickPharmacy
             : service.title === "Search Hospitals"
             ? handleSearchHospitals
             : service.title === "Tracking"
             ? handleTracking
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
            <Emergency num = "2"/>
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

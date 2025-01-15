// "use client";
// import React, { useState, useEffect } from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import { useRouter } from "next/navigation";
// import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
// import { Search } from "lucide-react";
// import "./HospitalLocator.css";
// import { Building2, Phone, MapPin,Star,Clock } from 'lucide-react';

// const HospitalLocator = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [mapCenter, setMapCenter] = useState(null);
//   const [manualLocation, setManualLocation] = useState("");
//   const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4",
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     if (isLoaded) {
//       getUserLocation();
//     }
//   }, [isLoaded]);

//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setMapCenter({ lat: latitude, lng: longitude });
//           fetchHospitals({ lat: latitude, lng: longitude });
//         },
//         () => setErrorMessage("Unable to fetch your location. Please enter manually.")
//       );
//     } else {
//       setErrorMessage("Geolocation is not supported by this browser.");
//     }
//   };

//   const fetchHospitalDetails = async (hospital) => {
//     return new Promise((resolve, reject) => {
//       // Only fetch details for operational hospitals
//       if (hospital.business_status !== 'OPERATIONAL') {
//         resolve(null);
//         return;
//       }

//       const service = new window.google.maps.places.PlacesService(
//         document.createElement("div")
//       );
      
//       service.getDetails(
//         {
//           placeId: hospital.place_id,
//           fields: ['formatted_phone_number', 'opening_hours', 'reviews', 'business_status']
//         },
//         (place, status) => {
//           if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//             resolve({
//               ...hospital,
//               formatted_phone_number: place.formatted_phone_number,
//               opening_hours: place.opening_hours,
//               detailed_reviews: place.reviews,
//               business_status: place.business_status || hospital.business_status
//             });
//           } else {
//             resolve(hospital);
//           }
//         }
//       );
//     });
//   };

//   const fetchHospitals = async (location) => {
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );
    
//     service.nearbySearch(
//       {
//         location,
//         radius: 5000,
//         type: "hospital",
//       },
//       async (results, status) => {
//         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//           // Filter and fetch details for operational hospitals only
//           const hospitalsWithDetails = await Promise.all(
//             results
//               .filter(hospital => hospital.business_status === 'OPERATIONAL')
//               .map(hospital => fetchHospitalDetails(hospital))
//           );
          
//           // Remove any null results and set the hospitals
//           setHospitals(hospitalsWithDetails.filter(hospital => hospital !== null));
//           setErrorMessage("");
//         } else {
//           setHospitals([]);
//           setErrorMessage("No hospitals found nearby.");
//         }
//       }
//     );
//   };

//   const handleAutocomplete = (query) => {
//     setManualLocation(query);
//     if (!query) {
//       setAutocompleteSuggestions([]);
//       return;
//     }

//     const service = new window.google.maps.places.AutocompleteService();
//     service.getPlacePredictions(
//       { input: query },
//       (predictions, status) => {
//         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//           setAutocompleteSuggestions(predictions);
//         } else {
//           setAutocompleteSuggestions([]);
//         }
//       }
//     );
//   };

//   const handlePlaceSelect = (placeId) => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ placeId }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const location = results[0].geometry.location;
//         const newLocation = { lat: location.lat(), lng: location.lng() };
//         setMapCenter(newLocation);
//         fetchHospitals(newLocation);
//         setAutocompleteSuggestions([]);
//         setManualLocation(results[0].formatted_address);
//       }
//     });
//   };

//   const handleBookAppointment = (hospital) => {
//     if (!hospital?.place_id || hospital.business_status !== 'OPERATIONAL') return;

//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );

//     service.getDetails(
//       { 
//         placeId: hospital.place_id,
//         fields: ['formatted_phone_number', 'opening_hours', 'reviews', 'business_status']
//       },
//       (place, status) => {
//         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//           const doctorDetails = {
//             identity: "1",
//             id: hospital.place_id,
//             name: hospital.name,
//             specialty: "",
//             clinicName: hospital.name,
//             clinicLocation: {
//               address: hospital.vicinity,
//               city: "City",
//               state: "State",
//               zip: "Zip",
//             },
//             contact: {
//               phone: place.formatted_phone_number || "Not available",
//               email: "contact@hospital.com",
//             },
//             availableTimes: [
//               { day: "Monday", time: "9:00 AM - 5:00 PM" },
//               { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
//             ],
//             reviews: (place.reviews || []).map(review => ({
//               author: review.author_name,
//               rating: review.rating,
//               text: review.text,
//             })),
//           };

//           router.push(`/appointment?doctor=${encodeURIComponent(JSON.stringify(doctorDetails))}`);
//         }
//       }
//     );
//   };

//   const getBusinessStatusLabel = (status) => {
//     const statusMap = {
//       'OPERATIONAL': 'Open',
//       'CLOSED_TEMPORARILY': 'Temporarily Closed',
//       'CLOSED_PERMANENTLY': 'Permanently Closed'
//     };
//     return statusMap[status] || 'Status Unknown';
//   };
  
//   return (
//     <div className="hospital-locator-container">
//       <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)" />
      
//       <div className="main-container">
//         <h1 className="page-title">Find Hospitals Near You</h1>

//         <div className="search-container">
//           <div className="search-input-wrapper">
//             <input
//               type="text"
//               value={manualLocation}
//               onChange={(e) => handleAutocomplete(e.target.value)}
//               placeholder="Enter location..."
//               className="search-input"
//             />
//             <Search className="search-icon" size={20} />
//           </div>

//           {autocompleteSuggestions.length > 0 && (
//             <div className="suggestions-dropdown">
//               {autocompleteSuggestions.map((suggestion) => (
//                 <div
//                   key={suggestion.place_id}
//                   onClick={() => handlePlaceSelect(suggestion.place_id)}
//                   className="suggestion-item"
//                 >
//                   {suggestion.description}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {errorMessage && (
//           <div className="error-message">{errorMessage}</div>
//         )}

//         {isLoaded && mapCenter ? (
//           <div className="content-container">
//             <div className="map-container">
//               <GoogleMap
//                 mapContainerStyle={{ width: "100%", height: "500px" }}
//                 center={mapCenter}
//                 zoom={13}
//               >
//                 {hospitals.map((hospital) => (
//                   <Marker
//                     key={hospital.place_id}
//                     position={{
//                       lat: hospital.geometry.location.lat(),
//                       lng: hospital.geometry.location.lng(),
//                     }}
//                     title={hospital.name}
//                   />
//                 ))}
//               </GoogleMap>
//             </div>

//             <div className="hospitals-grid">
//               {hospitals.map((hospital, index) => (
//                 <div key={index} className="hospital-card">
//                   <div className="hospital-card-header">
//                     <Building2 className="card-icon" size={24} />
//                     <h3 className="hospital-name">{hospital.name}</h3>
//                   </div>

//                   <div className="hospital-info">
//                     <div className="info-row">
//                       <MapPin className="info-icon" size={18} />
//                       <p className="hospital-address">{hospital.vicinity}</p>
//                     </div>

//                     {hospital.rating && (
//                       <div className="info-row">
//                         <Star className="info-icon" size={18} fill="#FFD700" />
//                         <p className="hospital-rating">{hospital.rating} / 5</p>
//                       </div>
//                     )}

//                     <div className="info-row">
//                       <Clock className="info-icon" size={18} />
//                       <p className="hospital-hours">
//                         {hospital.opening_hours ? 
//                           hospital.opening_hours.weekday_text[0] : 
//                           "Hours not available"}
//                       </p>
//                     </div>

//                    <div className="contact-info"></div>
//                       <div className="info-row">
//                         <Phone className="info-icon" size={18} />
//                         <p>{hospital.formatted_phone_number || "Phone not available"}</p>
                      
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => handleBookAppointment(hospital)}
//                     className="book-button"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="loading-message">Loading map...</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HospitalLocator;

"use client"
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
import { Search, Building2, Phone, MapPin, Star, Clock } from 'lucide-react';
import "./HospitalLocator.css";
import { FiFilter } from 'react-icons/fi'; // For the filter icon

const HospitalLocator = () => {
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    distance: "1 km",
    specialty: "All",
    rating: "Any Rating",
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4",
    libraries: ["places"]
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
    <>
    <NavbarWrapper />
    <div className="hospital-locator-container">
      
      
      <div className="main-container">
        <h1 className="page-title">Find Hospitals Near You</h1>

<div className="search-section">
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
    
    <button 
      className="filter-toggle-btn"
      onClick={() => setShowFilters(!showFilters)}
    >
      <FiFilter size={24} /> {/* Filter icon */}
    </button>

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

  <div className={`filters-container ${showFilters ? 'show' : 'hide'}`}>
            <div className="filter-group">
              <h3>Distance</h3>
              <div className="filter-options">
                {["1 km", "5 km", "10 km", "20 km", "50 km"].map((distance) => (
                  <button
                    key={distance}
                    className={`filter-button ${filters.distance === distance ? 'active' : ''}`}
                    onClick={() => handleFilterChange('distance', distance)}
                  >
                    {distance}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Specialty</h3>
              <div className="filter-options">
                {["All", "Emergency", "Cardiology", "Pediatrics", "Orthopedics", "Neurology", 
                  "General Medicine", "Gynecology", "Oncology", "Dermatology", "Psychiatry"
                ].map((specialty) => (
                  <button
                    key={specialty}
                    className={`filter-button ${filters.specialty === specialty ? 'active' : ''}`}
                    onClick={() => handleFilterChange('specialty', specialty)}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Minimum Rating</h3>
              <div className="filter-options">
                {["Any Rating", "3+ Rating", "4+ Rating"].map((rating) => (
                  <button
                    key={rating}
                    className={`filter-button ${filters.rating === rating ? 'active' : ''}`}
                    onClick={() => handleFilterChange('rating', rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Amenities</h3>
              <div className="filter-options">
                {["24/7 Beds", "Emergency", "ICU", "OPD"].map((amenity) => (
                  <button
                    key={amenity}
                    className={`filter-button ${filters.amenities.includes(amenity) ? 'active' : ''}`}
                    onClick={() => {
                      const newAmenities = filters.amenities.includes(amenity)
                        ? filters.amenities.filter(a => a !== amenity)
                        : [...filters.amenities, amenity];
                      handleFilterChange('amenities', newAmenities);
                    }}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
              {hospitals.map((hospital, index) => (
                <div key={index} className="hospital-card">
                  <div className="hospital-card-header">
                    <Building2 className="card-icon" size={24} />
                    <h3 className="hospital-name">{hospital.name}</h3>
                  </div>

                  <div className="hospital-info">
                    <div className="info-row">
                      <MapPin className="info-icon" size={18} />
                      <p className="hospital-address">{hospital.vicinity}</p>
                    </div>

                    {hospital.rating && (
                      <div className="info-row">
                        <Star className="info-icon" size={18} fill="#FFD700" />
                        <p className="hospital-rating">{hospital.rating} / 5</p>
                      </div>
                    )}

                    <div className="info-row">
                      <Clock className="info-icon" size={18} />
                      <p className="hospital-hours">
                        {hospital.opening_hours ? 
                          hospital.opening_hours.weekday_text[0] : 
                          "Hours not available"}
                      </p>
                    </div>

                    <div className="contact-info">
                      <div className="info-row">
                        <Phone className="info-icon" size={18} />
                        <p className="contact-text">
                          {hospital.formatted_phone_number || "Phone not available"}
                        </p>
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
    </>
  );
};

export default HospitalLocator;
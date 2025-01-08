// "use client";
// import React, { useState, useEffect } from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";

// const containerStyle = {
//   width: "80%",
//   height: "500px",
// };

// const HospitalLocator = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [mapCenter, setMapCenter] = useState(null);
//   const [manualLocation, setManualLocation] = useState("");
//   const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [hoveredHospital, setHoveredHospital] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4", // Use your API key here
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
//           const currentLocation = { lat: latitude, lng: longitude };
//           setMapCenter(currentLocation);
//           fetchHospitals(currentLocation);
//         },
//         () => {
//           setErrorMessage("Unable to fetch your location. Please enter manually.");
//         }
//       );
//     } else {
//       setErrorMessage("Geolocation is not supported by this browser.");
//     }
//   };

//   const fetchHospitals = (location) => {
//     const service = new window.google.maps.places.PlacesService(document.createElement("div"));

//     const request = {
//       location,
//       radius: 5000, 
//       type: "hospital",
//     };

//     service.nearbySearch(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         setHospitals(results);
//         setErrorMessage("");
//       } else {
//         setHospitals([]);
//         setErrorMessage("No hospitals found near the selected location.");
//       }
//     });
//   };

//   const handleAutocomplete = (query) => {
//     setManualLocation(query);
//     if (!query) {
//       setAutocompleteSuggestions([]);
//       return;
//     }

//     const service = new window.google.maps.places.AutocompleteService();
//     service.getPlacePredictions({ input: query }, (predictions, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         setAutocompleteSuggestions(predictions);
//       } else {
//         setAutocompleteSuggestions([]);
//       }
//     });
//   };

//   const handlePlaceSelect = (placeId) => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ placeId }, (results, status) => {
//       if (status === "OK" && results.length > 0) {
//         const location = results[0].geometry.location;
//         const newLocation = { lat: location.lat(), lng: location.lng() };
//         setMapCenter(newLocation);
//         fetchHospitals(newLocation);
//         setAutocompleteSuggestions([]);
//         setErrorMessage("");
//       } else {
//         setErrorMessage("Invalid location selected.");
//       }
//     });
//   };

//   const handleSearch = () => {
//     if (autocompleteSuggestions.length > 0) {
//       handlePlaceSelect(autocompleteSuggestions[0].place_id);
//     } else {
//       setErrorMessage("Please select a valid location from the suggestions.");
//     }
//   };

//   return (
//     <>
//     <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)" />

//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center",backgroundImage :"url('/hospital-background.svg')",
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat', }}>
//       <h1 style={{ color: "#6b43ff", fontSize: "32px", marginBottom: "20px" ,}}>
//       Hospital Locator
//     </h1>
//     <div
//       style={{
//         marginBottom: "30px",
//         textAlign: "center",
//         position: "relative",
//         width: "100%",
//         maxWidth: "500px",
        
//       }}
//     >
//       <p style={{ marginBottom: "10px", fontSize: "16px", color: "#555" }}>
//         Enter your location manually
//       </p>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           position: "relative",
//           width: "100%",
//         }}
//       >
//         <input
//           type="text"
//           value={manualLocation}
//           onChange={(e) => handleAutocomplete(e.target.value)}
//           placeholder="Enter your location"
//           style={{
//             padding: "12px",
//             borderRadius: "8px 0 0 8px",
//             border: "1px solid #ccc",
//             width: "calc(100% - 60px)",
//             outline: "none",
//             fontSize: "14px",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{
//             padding: "12px 20px",
//             backgroundColor: "#6b43ff",
//             color: "white",
//             border: "none",
//             borderRadius: "0 8px 8px 0",
//             cursor: "pointer",
//             fontWeight: "bold",
//             transition: "background-color 0.3s ease",
//           }}
//           onMouseOver={(e) => (e.target.style.backgroundColor = "#5a37d1")}
//           onMouseOut={(e) => (e.target.style.backgroundColor = "#6b43ff")}
//         >
//           Enter
//         </button>
//       </div>
//       {autocompleteSuggestions.length > 0 && (
//         <ul
//           style={{
//             position: "absolute",
//             top: "110%",
//             left: 0,
//             right: 0,
//             listStyle: "none",
//             margin: 0,
//             padding: "10px",
//             backgroundColor: "white",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             zIndex: 1000,
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           {autocompleteSuggestions.map((suggestion) => (
//             <li
//               key={suggestion.place_id}
//               onClick={() => handlePlaceSelect(suggestion.place_id)}
//               style={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 transition: "background-color 0.3s ease",
//               }}
//               onMouseOver={(e) => (e.target.style.backgroundColor = "#f1f1f1")}
//               onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
//             >
//               {suggestion.description}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//     {errorMessage && (
//       <p style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</p>
//     )}
//     {isLoaded ? (
//       mapCenter ? (
//         <>
       
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={mapCenter}
//             zoom={13}
            
//           >
//             {hospitals.map((hospital) => (
//               <Marker
//                 key={hospital.place_id}
//                 position={{
//                   lat: hospital.geometry.location.lat(),
//                   lng: hospital.geometry.location.lng(),
//                 }}
//                 title={hospital.name}
//               />
//             ))}
//           </GoogleMap>
       
//           <div
//   className="hospitals-grid-container"
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "100vh", // Full viewport height for vertical centering
//     padding: "20px",
//   }}
// >
//   <h2 style={{ marginBottom: "20px", color: "#333" }}>Nearby Hospitals:</h2>
//   <div
//     className="hospitals-grid"
//     style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(3, 1fr)",
//       gap: "20px",
//       paddingLeft: "75px",
//       paddingRight: "75px",
//     }}
//   >
//     {hospitals.map((hospital) => (
//       <div
//         key={hospital.place_id}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "20px",
//           borderRadius: "10px",
//           backgroundColor: "#ffffff",
//           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//         }}
//         onMouseEnter={() => setHoveredHospital(hospital.place_id)}
//         onMouseLeave={() => setHoveredHospital(null)}
//       >
//         <div style={{ textAlign: "center" }}>
//           <strong style={{ fontSize: "16px", color: "#333" }}>
//             {hospital.name}
//           </strong>
//           <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
//             {hospital.vicinity}
//           </p>
//         </div>
//         <button
//           style={{
//             marginTop: "15px",
//             padding: "10px 20px",
//             borderRadius: "8px",
//             backgroundColor: "rgba(107,67,255,0.75)",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "14px",
//           }}
//         >
//           Book Appointment
//         </button>
//       </div>
//     ))}
//   </div>
// </div>

//           </>
//         ) : (
//           <p>Fetching your location...</p>
//         )
//       ) : (
//         <p>Loading map...</p>
//       )}
//     </div>
//     </>
//   );
// };

// export default HospitalLocator;



"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";

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
  const [currentSlide, setCurrentSlide] = useState(0); // For slider functionality

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

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 3) % hospitals.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 3 + hospitals.length) % hospitals.length);
  };

  return (
    <>
      <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: "url('/hospital-background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 style={{ color: "#6b43ff", fontSize: "32px", marginBottom: "20px" }}>
          Hospital Locator
        </h1>
        <div style={{ marginBottom: "30px", textAlign: "center", position: "relative", width: "100%", maxWidth: "500px" }}>
          {/* Manual Location Input */}
          {/* Existing input and autocomplete logic */}
        </div>

        {isLoaded ? (
          mapCenter ? (
            <>
              <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13}>
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

              {/* Slider for hospitals */}
              <div className="slider-container" style={{ marginTop: "30px", position: "relative", width: "100%" }}>
                <button
                  className="prev-btn"
                  onClick={handlePrevSlide}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "#6b43ff",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8249;
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    width: "80%",
                    margin: "0 auto",
                  }}
                >
                  {hospitals.length > 0 ? (
                    hospitals
                      .slice(currentSlide, currentSlide + 3) // Show only 3 cards
                      .map((hospital, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h3 style={{ color: "#333" }}>{hospital.name}</h3>
                          <p style={{ color: "#666" }}>{hospital.vicinity}</p>
                          <button
                            style={{
                              marginTop: "10px",
                              padding: "10px 20px",
                              backgroundColor: "#6b43ff",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Book Appointment
                          </button>
                        </div>
                      ))
                  ) : (
                    <p>No hospitals to display.</p>
                  )}
                </div>

                <button
                  className="next-btn"
                  onClick={handleNextSlide}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "#6b43ff",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8250;
                </button>
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

export default HospitalLocator;

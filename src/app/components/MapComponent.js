"use client"
import React, { useEffect, useState } from "react";

function MapComponent() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Unable to fetch your location. Please enable location access.");
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        new window.google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 14,
        });
      };
      document.body.appendChild(script);
    }
  }, [location]);

  return (
    <div>
      <h3>Nearby Hospital Locator</h3>
      <div
        id="map"
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      ></div>
    </div>
  );
}

export default MapComponent;

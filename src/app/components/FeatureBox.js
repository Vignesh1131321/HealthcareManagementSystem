"use client"
import React from "react";
import "./Header.js";

function FeatureBox({ title, description, image }) {
  return (
    <div className="feature-box">
      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="feature-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
}

export default FeatureBox;

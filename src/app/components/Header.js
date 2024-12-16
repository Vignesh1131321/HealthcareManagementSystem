


"use client"
import React from "react";
//import { FaSearch } from "react-icons/fa"; // Import the search icon
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">MediLink</div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
        />
        <button className="search-button">
          {/* <FaSearch /> */} Search
        </button>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#manasmythri">ManasMythri</a></li>
          <li><a href="#departments">Health Records</a></li>
          <li><a href="#appointments">Appointments</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

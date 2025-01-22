"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';
import './DoctorAppointment.css';
import {v4 as uuid} from 'uuid';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";



export const DoctorAppointment = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/doctor-appointments', {
        params: { doctorId }
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (userId, doctorId) => {
    const newRoomId = uuid();
    try {
      console.log("userId", userId);
      console.log("doctorId", doctorId);
      console.log("newRoomId", newRoomId);
      const response = await axios.post("/api/rooms/create", 
        {
          roomId: newRoomId,
          userId: userId,
          doctorId: doctorId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data && response.data.room) {
        router.push(`/room/${newRoomId}`);
      } else {
        throw new Error('Failed to create room');
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = parseDate(appointment.appointmentDate);
      if (filter === 'upcoming') {
        return appointmentDate >= now;
      } else if (filter === 'past') {
        return appointmentDate < now;
      }
      return true;
    });
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrescription = (userId, doctorId) => {
    console.log('Prescription for:', userId, doctorId);
    router.push(`/prescription?userId=${userId}&doctorId=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1>My Appointments</h1>
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
      </div>

      <div className="appointments-grid">
        {filterAppointments().map((appointment, index) => (
          <div key={index} className="appointment-card">
            <div className="appointment-date">
              <CalendarIcon size={24} />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>
            
            <div className="appointment-time">
              <Clock size={20} />
              <span>{appointment.appointmentTime}</span>
            </div>

            <div className="appointment-divider"></div>

            <div className="patient-details">
              <div className="detail-row">
                <User size={20} />
                <span>{appointment.userName}</span>
              </div>

              {appointment.specialty && (
                <div className="detail-row">
                  <MapPin size={20} />
                  <span>{appointment.specialty}</span>
                </div>
              )}
            </div>

            <div className="appointment-actions">
              <button onClick={() => handleCreateRoom(appointment.userId, appointment.doctorId)} className="action-btn view">Video Call</button>
              <button className="action-btn reschedule">Reschedule</button>
            </div>
          </div>
        ))}
      </div>

      {filterAppointments().length === 0 && (
        <div className="no-appointments">
          <Calendar size={48} />
          <h3>No appointments found</h3>
          <p>There are no {filter !== 'all' ? filter : ''} appointments to display.</p>
        </div>
      )}
    </div>
  );
};


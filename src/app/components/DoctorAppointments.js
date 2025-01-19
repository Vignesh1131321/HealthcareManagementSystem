"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Get doctorId from wherever you're storing it (context, props, etc.)
      const doctorId = "your-doctor-id"; // Replace with actual doctorId
      const response = await fetch('/api/appointments', {
        headers: {
          'doctorId': doctorId
        }
      });
      const data = await response.json();
      
      // Check if the response has the expected structure
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        setError('Invalid data format received from server');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  // Filter appointments based on date
  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
    if (!appointment.date) return true; // Skip filtering if no date
    
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    
    if (filter === 'upcoming') {
      return appointmentDate >= today;
    } else if (filter === 'past') {
      return appointmentDate < today;
    }
    return true;
  }) : [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Appointments Schedule
          </h1>
          <div className="flex gap-4 mt-4">
            {['all', 'upcoming', 'past'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments found
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">
                          {appointment.patientName || 'Patient Name Not Available'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <Clock className="h-5 w-5 text-gray-500 ml-2" />
                        <span>{appointment.time}</span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                      {appointment.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <span>{appointment.phone}</span>
                        </div>
                      )}
                      {appointment.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>{appointment.email}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status || 'N/A'}
                    </span>
                  </div>
                  {appointment.notes && (
                    <div className="mt-4 text-gray-600">
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
"use client"
import { DoctorAppointment } from "../components/DoctorAppointment";
import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import axios from 'axios';

type DoctorDetails = {
  _id: string;
  username: string;
  email: string;
  placeId: string;
};

export default function DoctorAppointmentPage() {
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  
  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        const res = await axios.get<{ data: DoctorDetails }>("/doctor_side/doctors/me");
        if (res.data && res.data.data) {
          setDoctorDetails(res.data.data);
        } else {
          toast.error("Failed to get doctor details");
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        toast.error("An error occurred while fetching doctor details");
      }
    };
    getDoctorDetails();
  }, []);

  return (
    <div>
      {doctorDetails ? (
        <DoctorAppointment doctorId={doctorDetails.placeId} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

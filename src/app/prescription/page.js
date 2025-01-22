"use client";

import React from "react";
import { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Send } from 'lucide-react';
import './styles.css';
/* import { console } from "inspector"; */

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const doctorId = searchParams.get("doctorId");
  const [medicines, setMedicines] = useState([{
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  }]);

  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: '',
    diagnosis: ''
  });

  const addMedicine = () => {
    setMedicines([...medicines, {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = medicines.map((medicine, i) => {
      if (i === index) {
        return { ...medicine, [field]: value };
      }
      return medicine;
    });
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async () => {
/*     e.preventDefault();
 */    try {
    console.log("trying to submit");
      const response = await fetch(`/api/doctorgchjgv`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          doctorId,
          prescription: medicines,
          
        }),
      });
      console.log(medicines);
      if (response.ok) {
        alert("Prescription updated successfully!");
      } else {
        console.error("Error updating prescription:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };

  return (
    <div className="prescription-container">
      <h1 className="prescription-title">Create Prescription</h1>
      
      <div>
        <div className="patient-details">
          <h2>Patient Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                value={patientDetails.name}
                onChange={(e) => setPatientDetails({...patientDetails, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={patientDetails.age}
                onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={patientDetails.gender}
                onChange={(e) => setPatientDetails({...patientDetails, gender: e.target.value})}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label>Diagnosis</label>
            <textarea
              value={patientDetails.diagnosis}
              onChange={(e) => setPatientDetails({...patientDetails, diagnosis: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="medicines-section">
          <div className="medicines-header">
            <h2>Prescribed Medicines</h2>
            <button type="button" onClick={addMedicine} className="add-medicine-btn">
              <Plus size={20} /> Add Medicine
            </button>
          </div>

          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-card">
              <div className="medicine-card-header">
                <h3>Medicine {index + 1}</h3>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="remove-medicine-btn"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div className="medicine-form-grid">
                <div className="form-group">
                  <label>Medicine Name</label>
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <input
                    type="text"
                    value={medicine.frequency}
                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={medicine.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Special Instructions</label>
                  <textarea
                    value={medicine.instructions}
                    onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="submit-prescription-btn" onClick={handleSubmit}>
           Submit Prescription
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { useRouter } from "next/navigation"; // Replace useNavigate with useRouter
import styles from "./DoctorModal.module.css";
import {
  FaStethoscope,
  FaTooth,
  FaHeart,
  FaUserMd,
  FaBrain,
  FaBone,
  FaBaby,
  FaEye,
  FaFemale   
} from "react-icons/fa";
import { MdPersonPin } from "react-icons/md";

const doctorTypes = [
  { name: "Dermatologist", icon: <MdPersonPin size={40} /> },
  { name: "Dentist", icon: <FaTooth size={40} /> },
  { name: "Cardiologist", icon: <FaHeart size={40} /> },
  { name: "Urologist", icon: <FaUserMd size={40} /> },
  { name: "General Physician", icon: <FaStethoscope size={40} /> },
  { name: "Neurologist", icon: <FaBrain size={40} /> },
  { name: "Pediatrician", icon: <FaBaby size={40} /> },
  { name: "Orthopedic", icon: <FaBone size={40} /> },
  { name: "Ophthalmologist", icon: <FaEye size={40} /> },
  { name: "Gynecologist", icon: <FaFemale    size={40} /> },
];

export const DoctorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();

  const handleNavigate = (specialty: string) => {
    router.push(`/doctor?specialty=${encodeURIComponent(specialty)}`);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select a Doctor Type</h2>
        <div className={styles.doctorGrid}>
          {doctorTypes.map((doctor, index) => (
            <div
              key={index}
              className={styles.doctorBox}
              onClick={() => handleNavigate(doctor.name)}
            >
              <div className={styles.icon}>{doctor.icon}</div>
              <p>{doctor.name}</p>
            </div>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

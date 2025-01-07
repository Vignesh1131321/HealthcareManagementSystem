import React from "react";
import styles from "./DoctorModal.module.css";
import { FaStethoscope, FaTooth, FaHeart, FaUserMd,FaBrain,FaBone,FaBaby,FaEye,FaLungs} from "react-icons/fa"; // Use appropriate icons
import { MdPersonPin } from "react-icons/md"; // Dermatologist

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
    // { name: "Pulmonologist", icon: <FaLungs size={40} /> },
  ];

export const DoctorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select a Doctor Type</h2>
        <div className={styles.doctorGrid}>
          {doctorTypes.map((doctor, index) => (
            <div
              key={index}
              className={styles.doctorBox}
              onClick={() => alert(`You selected ${doctor.name}`)}
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

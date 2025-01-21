
"use client";
import React, { useState } from "react";
import { LoginForm } from "@/app/components/loginauth/auth/LoginForm";
import { DoctorLoginForm } from "@/app/components/loginauth/auth/DoctorLoginForm";
import "./login.css";


const LoginPage: React.FC = () => {
  const [isDoctor, setIsDoctor] = useState(false);

  return (
    <div className="pageContainer">
      <div className="formToggleContainer">
        <button
          className={`${"toggleButton"} ${!isDoctor ? "active" : ''}`}
          onClick={() => setIsDoctor(false)}
        >
          Patient Login
        </button>
        <button
          className={`${"toggleButton"} ${isDoctor ? "active" : ''}`}
          onClick={() => setIsDoctor(true)}
        >
          Doctor Login
        </button>
      </div>
      
      <div className="formContainer">
        {isDoctor ? <DoctorLoginForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default LoginPage;
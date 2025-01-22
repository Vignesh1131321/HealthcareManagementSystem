


// "use client";
// import React, { useState } from "react";
// import { LoginForm } from "@/app/components/loginauth/auth/LoginForm";
// import { DoctorLoginForm } from "@/app/components/loginauth/auth/DoctorLoginForm";
// import "./login.css";


// const LoginPage: React.FC = () => {
//   const [isDoctor, setIsDoctor] = useState(false);

//   return (
//     <div className="pageContainer">
//       <div className="formToggleContainer">
//         <button
//           className={`${"toggleButton"} ${!isDoctor ? "active" : ''}`}
//           onClick={() => setIsDoctor(false)}
//         >
//           Patient Login
//         </button>
//         <button
//           className={`${"toggleButton"} ${isDoctor ? "active" : ''}`}
//           onClick={() => setIsDoctor(true)}
//         >
//           Doctor Login
//         </button>
//       </div>
      
//       <div className="formContainer">
//         {isDoctor ? <DoctorLoginForm /> : <LoginForm />}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



// app/login/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { LoginForm } from "@/app/components/loginauth/auth/LoginForm";
import { DoctorLoginForm } from "@/app/components/loginauth/auth/DoctorLoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./login.css";

const LoginPage: React.FC = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === 'doctor') {
        router.push('/doctor_home');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Add proper loading state UI
  }

  return (
    <div className="pageContainer">
      <div className="formToggleContainer">
        <button
          className={`toggleButton ${!isDoctor ? "active" : ''}`}
          onClick={() => setIsDoctor(false)}
        >
          Patient Login
        </button>
        <button
          className={`toggleButton ${isDoctor ? "active" : ''}`}
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
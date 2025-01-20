// import React from "react";
// import styles from "./AuthStyles.module.css";
// import { SignUpForm } from "./SignUpForm";

// export const AuthPage: React.FC = () => {
//   const handleEmailSignUp = async (
//     username: string,
//     email: string,
//     password: string,
//     confirmPassword: string
//   ) => {
//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await fetch("/api/users/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, email, password }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         window.location.href = "/login";
//       } else {
//         alert(data.error || "Registration failed.");
//       }
//     } catch (error) {
//       console.error("An error occurred during email sign-up:", error);
//     }
//   };

//   return (
//     <div className={styles.authPage}>
//       <div className={styles.contentWrapper}>
//         <div className={styles.leftContent}>
//           <div className={styles.headlineContainer}>
//             <h1 className={styles.headline}>Empowering Your Health Journey</h1>
//             <p className={styles.subheadline}>
//               Simplify your healthcare journey with tools to track, manage, and improve your well-being.
//             </p>
//           </div>
//           <SignUpForm onEmailSignUp={handleEmailSignUp} />
//         </div>
//         <img
//           loading="lazy"
//           src="/images/5230819.jpg"
//           className={styles.heroImage}
//           alt="Design creativity illustration"
//         />
//       </div>
//     </div>
//   );
// };
import React, { useState } from "react";
import styles from "./AuthStyles.module.css";
import { SignUpForm } from "./SignUpForm";
import { DoctorSignUp } from "./DoctorSignUp";

export const AuthPage: React.FC = () => {
  const [userType, setUserType] = useState<'user' | 'doctor'>('user');

  const handleEmailSignUp = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("An error occurred during email sign-up:", error);
    }
  };

  const handleDoctorSignUp = async (doctorData: any) => {
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Doctor registration failed.");
      }
    } catch (error) {
      console.error("An error occurred during doctor sign-up:", error);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftContent}>
            <div className={styles.headlineContainer}>
              <h1 className={styles.headline}>Empowering Your Health Journey</h1>
              <p className={styles.subheadline}>
                Simplify your healthcare journey with tools to track, manage, and improve your well-being.
              </p>
            </div>

            <div className={styles.toggleContainer}>
              <div className={styles.toggleWrapper}>
                <button
                  onClick={() => setUserType('user')}
                  className={`${styles.toggleButton} ${
                    userType === 'user' ? styles.toggleButtonActive : styles.toggleButtonInactive
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Patient
                </button>
                <button
                  onClick={() => setUserType('doctor')}
                  className={`${styles.toggleButton} ${
                    userType === 'doctor' ? styles.toggleButtonActive : styles.toggleButtonInactive
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  Doctor
                </button>
              </div>
            </div>

            <div className={styles.formContainer}>
              {userType === 'user' ? (
                <SignUpForm onEmailSignUp={handleEmailSignUp} />
              ) : (
                <DoctorSignUp onSubmit={handleDoctorSignUp} />
              )}
            </div>
          </div>

          <div className={styles.rightContent}>
            <img
              src={userType === 'user' ? "/images/5230819.jpg" : "/images/5230819.jpg"}
              alt={userType === 'user' ? "Patient illustration" : "Doctor illustration"}
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
// import React from "react";
// import styles from "./AuthStyles.module.css";
// import { SignUpForm } from "./SignUpForm";
// import { signIn } from "next-auth/react";

// export const AuthPage: React.FC = () => {
//   // Make this function async
//   const handleGoogleSignUp = async () => {
//     // Handle Google sign up
//     const result = await signIn("google", { callbackUrl: "/" });
//     if (result?.error) {
//       console.log("Google Sign-In failed, please try again.");
//     }
//   };
  

//   // Define this function normally without an inner definition
//   const handleEmailSignUp = async (email: string, password: string, name: string) => {
//     const response = await fetch("/api/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password, name }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       window.location.href = "/login";
//     } else {
//       alert(data.error || "Registration failed.");
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
//           <SignUpForm
//             onGoogleSignUp={handleGoogleSignUp}
//             onEmailSignUp={handleEmailSignUp}
//           />
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
// import React from "react";
// import styles from "./AuthStyles.module.css";
// import { EmailSignUp } from "./EmailSignUp";
// import { SignUpForm } from "./SignUpForm";
// import { signIn } from "next-auth/react";
// export const AuthPage: React.FC = () => {
//   const handleEmailSignUp = async (email: string, password: string, confirmPassword: string) => {
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
//         body: JSON.stringify({ email, password }),
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
//           <SignUpForm
//             onEmailSignUp={handleEmailSignUp}
//           />
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
import React from "react";
import styles from "./AuthStyles.module.css";
import { SignUpForm } from "./SignUpForm";

export const AuthPage: React.FC = () => {
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

  return (
    <div className={styles.authPage}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftContent}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.headline}>Empowering Your Health Journey</h1>
            <p className={styles.subheadline}>
              Simplify your healthcare journey with tools to track, manage, and improve your well-being.
            </p>
          </div>
          <SignUpForm onEmailSignUp={handleEmailSignUp} />
        </div>
        <img
          loading="lazy"
          src="/images/5230819.jpg"
          className={styles.heroImage}
          alt="Design creativity illustration"
        />
      </div>
    </div>
  );
};

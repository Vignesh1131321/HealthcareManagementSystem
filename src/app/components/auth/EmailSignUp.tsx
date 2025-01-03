// import React, { useState } from "react";
// import styles from "./AuthStyles.module.css";
// import { EmailSignUpProps } from "./types";

// export const EmailSignUp: React.FC<EmailSignUpProps> = ({ onSubmit }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(email);
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.emailForm}>
//       <div className={styles.inputWrapper}>
//         <label htmlFor="email" className={styles.visuallyHidden}>
//           Email address
//         </label>
//         <input
//           id="email"
//           type="email"
//           className={styles.emailInput}
//           placeholder="Email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div className={styles.inputWrapper}>
//         <label htmlFor="password" className={styles.visuallyHidden}>
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           className={styles.emailInput}
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit" className={styles.signupButton}>
//         Sign up
//       </button>
//     </form>
//   );
// };
import React, { useState } from "react";
import styles from "./AuthStyles.module.css";
import { EmailSignUpProps } from "./types";

export const EmailSignUp: React.FC<EmailSignUpProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.emailForm}>
      <div className={styles.inputWrapper}>
        <label htmlFor="email" className={styles.visuallyHidden}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          className={styles.emailInput}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="password" className={styles.visuallyHidden}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.emailInput}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={styles.signupButton}>
        Sign up
      </button>
    </form>
  );
};

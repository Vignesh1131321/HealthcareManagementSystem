
"use client";
import React, { useState } from "react";
import styles from "./Auth.module.css";
import { InputField } from "./InputField"; // Import the InputField component
import { SocialButton } from "./SocialButton";
import { signIn } from "next-auth/react";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!email || !password) {
  //     setError("Email and Password are required.");
  //     return;
  //   }

  //   // Perform manual login with credentials
  //   const res = await signIn("credentials", {
  //     redirect: false,
  //     email,
  //     password,
  //   });

  //   if (res?.error) {
  //     setError(res.error);  // Set error message from NextAuth
  //   } else {
  //     // Redirect to home page on successful login
  //     window.location.href = "/";  // Or use `router.push("/")` if you're using next/router
  //   }
  // };
  // LoginForm.tsx - update handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
    
  if (!email || !password) {
    setError("Email and Password are required.");
    return;
  }

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
    isDoctor: false // explicitly set to false for regular users
  });

  if (res?.error) {
    setError(res.error);
  } else {
    window.location.href = "/"; // redirect to user dashboard
  }
};


  const handleSocialLogin = () => {
    signIn("google"); // Trigger Google login
  };

  return (
    <div className={styles.loginContainer}>
      <img
        src="/gif/health.gif"
        alt="Login illustration"
        className={styles.loginImage}
      />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.logoHeader}>
              <div className={styles.logo} />
              <h1 className={styles.loginTitle}>Sign In</h1>
            </div>

            <div className={styles.formFields}>
              <InputField
                label="Email"
                id="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Ensure onChange is passed correctly
              />
              <InputField
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Ensure onChange is passed correctly
                showHidePassword
              />

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.loginButton}>
                Sign In
              </button>
            </div>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            <SocialButton
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d9db2c249ee63c3bb536d1c87122771cfa623b5911c4c83594978d738168ecd4?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"
              text="Continue with Google"
              onClick={handleSocialLogin}
            />
            <div>
              <a href="#" className={styles.forgotPassword}>
                Forget your password?
              </a>
            </div>
          </form>
        </div>

        <div className={styles.signupPrompt}>
          <p>
            Don't have an account?{" "}
            <a href="/signup" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

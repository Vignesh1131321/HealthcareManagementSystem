"use client"
import React from "react";
import styles from "./Auth.module.css";
import { InputField } from "./InputField";
import { SocialButton } from "./SocialButton";
import { Divider } from "./Divider";

export const LoginForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSocialLogin = () => {
    // Handle Google login
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
              />
              <InputField
                label="Password"
                type="password"
                id="password"
                showHidePassword
              />

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
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d9db2c249ee63c3bb536d1c87122771cfa623b5911c4c83594978d738168ecd4?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21"// Google logo
              text="Continue with Google"
              onClick={handleSocialLogin}
            />
            <div>            
              <a href="#" className={styles.forgotPassword}>
              Forget your password?
            </a></div>

          </form>
        </div>

        <div className={styles.signupPrompt}>
          <p>
            Don't have an account?{" "}
            <a href="#" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>


      </div>
    </div>
  );
};

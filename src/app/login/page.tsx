"use client";


import styles from './styles.module.css';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/");
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className={styles.lody}>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
        <a href="#">Logo</a>
      </div>

      <div className={styles.container}>
        <h1>Login to your account 👏</h1>

        <div className={styles.sociallogin}>
          <button className="google">
            <i className="bx bxl-google"></i>
            Use Google
          </button>
          <button className="apple">
            <i className="bx bxl-apple"></i>
            Use Apple
          </button>
        </div>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <p>Or</p>
          <div className={styles.line}></div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          <label htmlFor="email">Email:</label>
          <div className={styles.custominput}>
            <input
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Your Email"
            />
            <i className="bx bx-at"></i>
          </div>

          <label htmlFor="password">Password:</label>
          <div className={styles.custominput}>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={styles.login}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className={styles.links}>
            <Link href="/forgotpassword">Forgot Password</Link>
            <Link href="/signup">Don't have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

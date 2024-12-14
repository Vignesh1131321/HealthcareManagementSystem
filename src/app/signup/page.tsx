"use client";
import Link from "next/link";
import React from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

import styles from './styles.module.css';


export default function SignupPage(){
  const router = useRouter();
  const [user,setUser] = React.useState(
    {
      email:"",
      password: "",
      username:"",

    })
    const [buttonDisabled,setButtonDisabled] =React.useState(false);
    const [loading,setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = axios.post("/api/users/signup",user);
      router.push("/login");
    } catch (error:any) {
      console.log("Signup failed",error.message);
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(user.email.length>0 && user.password.length>0 && user.username.length>0){
      setButtonDisabled(false);
    }
    else{
      setButtonDisabled(true);
    }
  }, [user])
    
  return(
    <div className={styles.page}>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
        <a href="#">Logo</a>
      </div>

      <div className={styles.container}>
        <h1> Create your account 👏</h1>

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
            onSignup();
          }}
        >
          <label htmlFor="username">Username:</label>
          <div className={styles.custominput}>
            <input
              id="username"
              type="text"
              value={user.username}
      onChange={(e) => setUser({...user, username: e.target.value})}
      placeholder="username"
            />
            <i className="bx bx-at"></i>
          </div>
          <label htmlFor="email">Email:</label>
          <div className={styles.custominput}>
            <input
              id="email"
              type="text"
              value={user.email}
      onChange={(e) => setUser({...user, email: e.target.value})}
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
      onChange={(e) => setUser({...user, password: e.target.value})}
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={styles.login}
          >
            {loading ? "Loading..." : "Signup"}
          </button>

          <div className={styles.links}>
            <Link href="/login">Already have an account? Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
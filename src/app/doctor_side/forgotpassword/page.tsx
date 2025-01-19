"use client"
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/forgotpassword", { email });
      setMessage(response.data.message);
    } catch (error:any) {
      setMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

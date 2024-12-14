"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Wait for the query parameter to be available
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlSearchParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }
    try {
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });
      setMessage(response.data.message);
      setPassword("");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

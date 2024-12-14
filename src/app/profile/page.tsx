"use client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function ProfilePage(){

  const router = useRouter();
  const logout = async ()=>{
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged Out Successfully");
      router.push("/login");
    } catch (error:any) {
      console.log(error.message);
      toast.error("Failed to Logout");
    }
  }
  const [data,setData] = useState("nothing");
  const getUserDetails = async ()=>{
    const res = await axios.get('/api/users/me');
    
    console.log(res.data);
    setData(res.data.data._id);
    

  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2 className="p-3 rounded bg-purple-700">{data==='nothing'?"Nothing":<Link
       href={`/profile/${data}`}>View
      </Link>}</h2>
      <hr />
      <button 
      onClick={logout}
      className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">logout</button>
      <button 
      onClick={getUserDetails}
      className="bg-pruple-700 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get User Details</button>
    </div>
  )

}
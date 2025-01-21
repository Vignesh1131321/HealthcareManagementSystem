"use client";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";
import {v4 as uuid} from 'uuid';
import toast from "react-hot-toast";
import axios from "axios";

export default function Video() {
  const { fullName, setFullName } = useUser();
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName("");
  }, []);

  
  const handleCreateRoom = async () => {
    const newRoomId = uuid();
    try {
      await axios.post("/api/rooms/create", { roomId: newRoomId });
      router.push(`/room/${newRoomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };
  
  const fetchRoom = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rooms/${id}`);
      
      if (response.data && response.data.room) {
        setRoomId(id);
        router.push(`/room/${id}`);
      } else {
        toast.error('Room not found');
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    await fetchRoom(roomId);
  };



  return (
    <div className="w-full h-screen">
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex-col gap-24 flex h-screen items-center">
          <h1>Virtual healthcare for you</h1>
          <div className="mx-auto max-w-4xl px-4 py-32 flex-col gap-24 flex h-screen text-center">
            <h1>Have a smooth meeting</h1>
            <div>
              <input
                type="text"
                id="name"
                onChange={(e) => setFullName(e.target.value.toString())}
                placeholder="Enter your name"
                className="text-black p-2 rounded"
              />
            </div>
            {fullName && fullName.length>=3 && (<>
            <div>
              <input
                type="text"
                id="roomid"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room Id"
                className="text-black p-2 rounded mr-2"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomId}
                className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
              >
                Join Room
              </button>
            </div>
            <div>
            <button onClick={handleCreateRoom} className="bg-green-500 px-4 py-2 rounded">
              Do
            </button>

              Or create a new meeting
            </div>
            </>
)}
          </div>
          
        </div>
      </section>
    </div>
  );
}
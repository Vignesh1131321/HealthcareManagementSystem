"use client";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";
import {v4 as uuid} from 'uuid';

export default function Video() {
  const { fullName, setFullName } = useUser();
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  useEffect(() => {
    setFullName("");
  }, []);

  const handleJoinRoom = () => {
    router.push(`/room/${roomId}`);
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
              <button
              onClick={() => router.push(`/room/${uuid()}`)}
              >
               do
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
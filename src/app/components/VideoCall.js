"use client"
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const VideoCall = () => {
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  useEffect(() => {
    // Dynamically load Jitsi Meet External API
    const loadJitsiScript = () => {
      if (typeof window !== "undefined" && !window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
          console.log("Jitsi Meet API script loaded.");
        };
        document.body.appendChild(script);
      }
    };

    loadJitsiScript();

    return () => {
      // Cleanup Jitsi API when the component is unmounted
      if (api) {
        api.dispose();
      }
    };
  }, [api]);

  const initializeCall = (roomNameToUse) => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi API script not loaded yet.");
      return;
    }

    if (api) {
      console.warn("A call is already in progress.");
      return;
    }

    const domain = "meet.jit.si";
    setRoomName(roomNameToUse);

    const options = {
      roomName: roomNameToUse,
      parentNode: jitsiContainerRef.current,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        DEFAULT_REMOTE_DISPLAY_NAME: "Guest",
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "hangup",
          "chat",
          "fullscreen",
          "tileview",
          "raisehand",
        ],
      },
      userInfo: {
        displayName: "User_" + Math.floor(Math.random() * 100),
      },
    };

    const newApi = new window.JitsiMeetExternalAPI(domain, options);
    setApi(newApi);
    console.log("Connected to room:", roomNameToUse);
  };

  const startCall = () => {
    const generatedRoomName = `DemoRoom_${Math.floor(Math.random() * 10000)}`;
    initializeCall(generatedRoomName);
  };

  const joinCall = (e) => {
    e.preventDefault();
    if (joinRoomInput.trim()) {
      initializeCall(joinRoomInput.trim());
      setJoinRoomInput("");
      setShowJoinInput(false);
    }
  };

  const endCall = () => {
    if (api) {
      api.dispose();
      setApi(null);
      setRoomName("");
      console.log("Call ended.");
    } else {
      console.warn("No active call to end.");
    }
  };

  return (
    <div className="p-6 text-center max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Video Call</h1>
      
      <div
        id="jitsi-container"
        ref={jitsiContainerRef}
        className="w-full h-[500px] mb-6 border border-gray-200 rounded-lg overflow-hidden"
      />

      <div className="space-y-4">
        {!api && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={startCall}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start New Call
              </button>
              <button
                onClick={() => setShowJoinInput(!showJoinInput)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Join Existing Call
              </button>
            </div>

            {showJoinInput && (
              <form onSubmit={joinCall} className="flex gap-2">
                <input
                  type="text"
                  value={joinRoomInput}
                  onChange={(e) => setJoinRoomInput(e.target.value)}
                  placeholder="Enter room name"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        )}

        {api && (
          <button
            onClick={endCall}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            End Call
          </button>
        )}

        {roomName && (
          <div className="mt-4">
            <p className="font-medium">Current Room: {roomName}</p>
            <p className="text-sm text-gray-600 mt-1">
              Share this room name with others to join the call
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Exporting the component dynamically to avoid SSR issues
export default dynamic(() => Promise.resolve(VideoCall), { ssr: false });
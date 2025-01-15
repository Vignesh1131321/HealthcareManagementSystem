"use client"
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const VideoCall = () => {
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [roomName, setRoomName] = useState("");

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

  const startCall = () => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi API script not loaded yet.");
      return;
    }

    if (api) {
      console.warn("A call is already in progress.");
      return;
    }

    const domain = "meet.jit.si";
    const generatedRoomName = `DemoRoom_${Math.floor(Math.random() * 10000)}`;
    setRoomName(generatedRoomName);

    const options = {
      roomName: generatedRoomName,
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
    console.log("Call started in room:", generatedRoomName);
  };

  const endCall = () => {
    if (api) {
      api.dispose();
      setApi(null);
      console.log("Call ended.");
    } else {
      console.warn("No active call to end.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Jitsi Video Call</h1>
      <div
        id="jitsi-container"
        ref={jitsiContainerRef}
        style={{
          width: "100%",
          height: "500px",
          margin: "20px auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={startCall}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Start Call
        </button>
        <button
          onClick={endCall}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          End Call
        </button>
      </div>
      {roomName && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Current Room: {roomName}
        </p>
      )}
    </div>
  );
};

// Exporting the component dynamically to avoid SSR issues
export default dynamic(() => Promise.resolve(VideoCall), { ssr: false });

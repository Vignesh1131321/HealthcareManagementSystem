"use client";

import React, { useRef, useState } from "react";

const VideoCall1 = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isInCall, setIsInCall] = useState(false);
  const [roomId, setRoomId] = useState(""); // State to store the Room ID

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Google's public STUN server
    ],
  };

  const generateRoomId = () => {
    // Generate a random 8-character room ID
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = localStream;

    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // In a real app, send the candidate to the signaling server
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Offer created:", offer);

    // Generate and display a room ID
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);

    setIsInCall(true);

    // For demonstration, log the offer and room ID
    console.log(`Room ID: ${newRoomId}`);
    console.log("Offer:", JSON.stringify(offer));
    alert(`Room ID: ${newRoomId}\nShare this Room ID with someone to join.`);
  };

  const joinCall = async (remoteOffer) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = localStream;

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // In a real app, send the candidate to the signaling server
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("Answer created:", answer);
    alert("Send this Answer to the person who created the room.");
    setIsInCall(true);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    remoteVideoRef.current.srcObject = null;
    setIsInCall(false);
    setRoomId("");
  };

  return (
    <div>
      <h1>Video Call</h1>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "45%", marginRight: "10px" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "45%" }} />
      </div>
      {!isInCall ? (
        <>
          <button onClick={startCall}>Start Call</button>
          <button
            onClick={() => {
              const remoteOffer = prompt("Paste the remote offer here:");
              if (remoteOffer) joinCall(JSON.parse(remoteOffer));
            }}
          >
            Join Call
          </button>
        </>
      ) : (
        <button onClick={endCall}>End Call</button>
      )}
      {roomId && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Room ID: <span style={{ color: "blue" }}>{roomId}</span>
        </p>
      )}
    </div>
  );
};

export default VideoCall1;

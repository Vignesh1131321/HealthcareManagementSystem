"use client"; // Add this directive to indicate it's a client component

import React, { useRef, useState } from "react";

const VideoCall1 = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isInCall, setIsInCall] = useState(false);

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Google's public STUN server
    ],
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
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Offer created:", offer);

    setIsInCall(true);
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
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("Answer created:", answer);
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
  };

  return (
    <div>
      <h1>Video Call</h1>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "45%", marginRight: "10px" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "45%" }} />
      </div>
      {!isInCall ? (
        <button onClick={startCall}>Start Call</button>
      ) : (
        <button onClick={endCall}>End Call</button>
      )}
      {!isInCall && (
        <button
          onClick={() => {
            const remoteOffer = prompt("Paste remote offer here:");
            joinCall(JSON.parse(remoteOffer));
          }}
        >
          Join Call
        </button>
      )}
    </div>
  );
};

export default VideoCall1;

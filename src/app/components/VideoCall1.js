"use client";
import axios from 'axios';
import React, { useRef, useState } from 'react';

const VideoCall1 = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [localOffer, setLocalOffer] = useState('');
  const [roomId, setRoomId] = useState('');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(7);
  };

  // Add room storage
  const [rooms, setRooms] = useState(new Map());
  
  const startCall = async () => {
    try {
      const newRoomId = generateRoomId();
      setRoomId(newRoomId);
  
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;
  
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
  
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      // Store room data in database
      await axios.post('/api/rooms/create', {
        roomId: newRoomId,
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      });
      
      alert(`Share this Room ID with the person you want to call: ${newRoomId}`);
      setIsInCall(true);
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Failed to start call: " + error.message);
    }
  };
  
  const joinCall = async () => {
    try {
      const roomId = prompt("Enter Room ID:");
      if (!roomId) return;
  
      // Get room data from database
      const response = await axios.get(`/api/rooms/${roomId}`);
      if (!response.data || !response.data.offer) {
        throw new Error('Room not found or invalid data');
      }

      const offerData = response.data.offer;

  
      setRoomId(roomId);
  
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;
  
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
  
      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
  
      await pc.setRemoteDescription(new RTCSessionDescription(offerData));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
  
      // Update room with answer
      await axios.post(`/api/rooms/${roomId}/answer`, {
        answer: {
          type: answer.type,
          sdp: answer.sdp
        }
      });
  
      setIsInCall(true);
    } catch (error) {
      console.error("Error joining call:", error);
      alert("Error joining call: " + error.message);
    }
  };
  return (
    <div className="video-call-container">
      <h1>Video Call</h1>
      {roomId && <div className="room-id">Room ID: {roomId}</div>}
      <div className="video-grid">
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div className="controls">
        {!isInCall ? (
          <div>
            <button onClick={startCall}>Start New Call</button>
            <button onClick={joinCall}>Join Call</button>
          </div>
        ) : (
          <button onClick={() => {
            peerConnectionRef.current?.close();
            setIsInCall(false);
            localVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
          }}>
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall1;
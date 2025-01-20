/* "use client"
import React, { useEffect, useRef, useState } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, PhoneOff, Video, Copy } from "lucide-react";

const VideoCall2 = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [roomID, setRoomID] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const appID = 2112340624;
  const serverSecret = "c4bc9693b91ae1d4fb50c4a76e59a128";
  const zegoClient = useRef(null);

  const initializeZego = () => {
    zegoClient.current = new ZegoExpressEngine(appID, "wss://webliveroom-test.zego.im/ws");
    zegoClient.current.on("roomStreamUpdate", (roomID, updateType, streamList) => {
      if (updateType === "ADD") {
        zegoClient.current.startPlayingStream(streamList[0].streamID, remoteVideoRef.current);
      }
    });
  };

  const generateRandomRoomID = () => {
    const randomID = Math.floor(100000 + Math.random() * 900000);
    setRoomID(randomID.toString());
  };

  const copyRoomID = () => {
    navigator.clipboard.writeText(roomID);
  };

  const startCall = async () => {
    if (!roomID || !userID || !userName) {
      alert("Please fill in all fields");
      return;
    }

    const token = generateToken(appID, userID, serverSecret);
    await zegoClient.current.loginRoom(roomID, token, { userID, userName });
    const streamID = `stream-${userID}`;
    const localStream = await zegoClient.current.createStream();
    localVideoRef.current.srcObject = localStream;
    zegoClient.current.startPublishingStream(streamID, localStream);
    setIsInCall(true);
  };

  const endCall = async () => {
    zegoClient.current.logoutRoom(roomID);
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    setIsInCall(false);
  };

  const generateToken = (appID, userID, secret) => {
    const expiredTime = Math.floor(Date.now() / 1000) + 3600;
    const payload = {
      app_id: appID,
      user_id: userID,
      expired_time: expiredTime,
    };
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    
    const encode = (data) => 
      Buffer.from(JSON.stringify(data)).toString("base64").replace(/=/g, "");
    
    const sign = (data, key) => {
      return CryptoJS.HmacSHA256(data, key)
        .toString(CryptoJS.enc.Base64)
        .replace(/=/g, "");
    };
    
    const headerBase64 = encode(header);
    const payloadBase64 = encode(payload);
    const signature = sign(`${headerBase64}.${payloadBase64}`, secret);
    
    return `${headerBase64}.${payloadBase64}.${signature}`;
  };

  useEffect(() => {
    initializeZego();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Video Call Interface</CardTitle>
      </CardHeader>
      <CardContent>
        {!isInCall ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsHost(true);
                  generateRandomRoomID();
                }}
              >
                <Video className="mr-2 h-4 w-4" />
                Start New Call
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsHost(false)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Join Existing Call
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Room ID"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                  disabled={isHost}
                />
                {isHost && (
                  <Button variant="outline" onClick={copyRoomID}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                type="text"
                placeholder="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
              <Input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={startCall}
            >
              {isHost ? 'Start Call' : 'Join Call'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between gap-4">
              <div className="w-1/2">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-lg bg-gray-100"
                />
                <p className="text-center mt-2">You</p>
              </div>
              <div className="w-1/2">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-gray-100"
                />
                <p className="text-center mt-2">Remote User</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="destructive" 
                onClick={endCall}
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Room ID: {roomID}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCall2; */
"use client";
import useUser from '@/app/hooks/useUser';
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Room = ({ params }: { params: Promise<{ roomid: string }> }) => {
  const { fullName } = useUser();
  const resolvedParams = React.use(params);
  const roomID = resolvedParams.roomid;
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initRoom = async () => {
      if (!containerRef.current || isInitializedRef.current) return;

      try {
        const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          uuid(),
          fullName || 'user' + Date.now(),
          720
        );

        // Store the ZegoUIKitPrebuilt instance
        zegoRef.current = ZegoUIKitPrebuilt.create(kitToken);
        
        // Mark as initialized
        isInitializedRef.current = true;

        await zegoRef.current.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Shareable Link',
              url:
                window.location.protocol + '//' +
                window.location.host + window.location.pathname +
                '?roomID=' +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,
          showRemoveUserButton: true,
          onJoinRoom: () => {
            console.log('Joined room successfully');
          },
        });
      } catch (error) {
        console.error('Failed to initialize room:', error);
        isInitializedRef.current = false;
      }
    };

    initRoom();

    // Cleanup function
    return () => {
      if (zegoRef.current) {
        try {
          isInitializedRef.current = false;
          zegoRef.current.destroy();
          zegoRef.current = null;
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, [roomID, fullName]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Room;
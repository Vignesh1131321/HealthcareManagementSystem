"use client";

import useUser from '@/app/hooks/useUser';
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { NavbarWrapper } from '@/app/healthcare/components/NavbarWrapper';
import './page.css';

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

        zegoRef.current = ZegoUIKitPrebuilt.create(kitToken);
        
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
    <>
      <style jsx>{`
        .hospital-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
          display: flex;
          flex-direction: column;
        }
      `}</style>
      
      <main 
        className="hospital-page"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <NavbarWrapper />
        <div
          className="myCallContainer"
          ref={containerRef}
          style={{
            width: '100%',
            height: 'calc(100vh - 64px)',
            position: 'relative'
          }}
        />
      </main>
    </>
  );
};

export default Room;
'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 's' && !isRecording) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: { ideal: 30 } },
            audio: true
          });

          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          chunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedVideo(url);
            stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Error starting screen recording:', error);
        }
      } else if (event.key === 'Escape' && isRecording) {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRecording]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
      {recordedVideo ? (
        <div className="w-full h-full flex items-center justify-center">
          <video
            src={recordedVideo}
            controls
            className="w-full h-full object-contain"
            style={{ 
              height: '100%',
              width: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      ) : (
        <div className="text-center">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-gray-600">Recording... (Press ESC to stop)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-gray-600">Press S to start recording</p>
              <p className="text-sm text-gray-400">No recording available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useEffect, useRef, useState } from 'react';

export default function CameraFeed() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    console.log('Attempting to start camera...');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API not supported');
      }

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,  // Simplified video constraints
        audio: false
      });
      
      console.log('Camera access granted, setting up video element...');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing...');
          videoRef.current?.play().catch(e => console.error('Error playing video:', e));
        };
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
        console.log('Camera setup complete');
      } else {
        console.error('Video element reference not found');
        throw new Error('Video element not initialized');
      }
    } catch (error) {
      console.error('Detailed camera error:', error);
      setError(error instanceof Error ? error.message : 'Failed to access camera');
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setIsStreaming(false);
      console.log('Camera stopped successfully');
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      if (event.key.toLowerCase() === 'c') {
        console.log('C key detected, current streaming state:', isStreaming);
        if (!isStreaming) {
          await startCamera();
        } else {
          stopCamera();
        }
      } else if (event.key === 'Escape') {
        console.log('Escape key detected, streaming state:', isStreaming);
        if (isStreaming) {
          console.log('Stopping camera due to Escape key');
          stopCamera();
        }
      }
    };

    console.log('Adding keydown event listener');
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      console.log('Component unmounting, cleaning up...');
      window.removeEventListener('keydown', handleKeyPress);
      if (isStreaming) {
        stopCamera();
      }
    };
  }, [isStreaming]); // Add isStreaming to dependencies to ensure we have the current state

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: isStreaming ? 'block' : 'none' }}
        className="w-full h-full object-cover"
      />
      
      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-gray-600">Press C to start camera</p>
              <p className="text-sm text-gray-400">Camera is inactive</p>
            </div>
          </div>
        </div>
      )}

      {isStreaming && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs">Live</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white p-2 rounded text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
} 
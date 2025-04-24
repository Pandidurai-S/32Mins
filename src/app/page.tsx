'use client';

import Image from 'next/image';
import Chatbot from './components/Chatbot';
import TalkingHead from './components/TalkingHead';
import ScreenRecorder from './components/ScreenRecorder';
import CameraFeed from './components/CameraFeed';
import { useState } from 'react';
import './styles/chatbot.css';

export default function Home() {
  const [ttsText, setTtsText] = useState<string>('');

  // Function to handle chatbot messages
  const handleChatbotMessage = (message: string) => {
    setTtsText(message);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="navbar text-white py-4 relative">
        <div className="max mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center relative">
            <div className="w-16 h-16 bg-white flex items-center justify-center absolute -top-5 shadow-lg">
              <Image
                src="/32Mins_01.png"
                alt="32Mins Logo"
                width={48}
                height={48}
                priority
                className="transform hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="w-16"></div> {/* Spacer to maintain layout */}
          </div>
          <div className="text-xl font-semibold">
            32Mins Learning Partner Device - User Testing
          </div>
          <div className="w-12"></div> {/* Empty div for balance */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full h-[calc(100vh-5rem-3rem)] flex" style={{ backgroundColor: '#E2E9F1' }}>
        {/* Left Column - 70% */}
        <div className="w-[70%] flex flex-col">
          {/* Top Row - Screen Recording and Chatbot - 70% height */}
          <div className="flex h-[60%]">
            {/* Screen Recording - 70% */}
            <div className="w-[70%] p-4">
              <div className="border-2 border-black p-4 h-full bg-gray-50" style={{ backgroundColor: '#E2E9F1' }}>
                <ScreenRecorder />
              </div>
            </div>
            {/* Chatbot - 30% */}
            <div className="w-[30%] p-4">
              <div className="h-full">
                <Chatbot onMessage={handleChatbotMessage} />
              </div>
            </div>
          </div>

          {/* Bottom Row - Camera Feed, Emotion Analysis, and Icons - 30% height */}
          <div className="flex h-[40%]">
            {/* Camera Feed and Emotion Analysis */}
            <div className="w-1/2 p-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Camera Feed */}
                <div className="border-2 border-black p-4 flex items-center justify-center bg-gray-50" style={{ backgroundColor: '#E2E9F1' }}>
                  <CameraFeed />
                </div>
                {/* Emotion Analysis */}
                <div className="border-2 border-gray-300 rounded-lg p-4 emotion-text" style={{ backgroundColor: 'white' }}>
                  <h3 className="text-lg font-semibold text-black mb-2">Emotion: neutral</h3>
                  <div className="space-y-2">
                    <div className='flex flex-row items-center gap-2'>
                      <div className="flex justify-between mb-1">
                        <span className="text-black">Neutral</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-progress h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <div className="flex justify-between mb-1">
                        <span className="text-black">Confusion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-progress h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <div className="flex justify-between mb-1">
                        <span className="text-black">Engagement</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-progress h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <div className="flex justify-between mb-1">
                        <span className="text-black">Frustration</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-progress h-2.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className='gaze-direction'>
                    <div className='gaze-direction-text font-bold'>
                    <h3 className="text-lg font-semibold text-black mb-2">Gaze: Center</h3>
                    </div>
                    <div className='gaze-direction-text'>
                    <span className="text-black mb-2">Looking at the screen : yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Icons Section */}
            <div className="w-1/2 p-4 flex flex-col justify-end">
              <div className="flex gap-4 h-fit bg-black rounded-lg p-2">
                {/* First Icons Column */}
                <div className="flex-1 flex flex-row gap-2 justify-start">
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </button>
                </div>
                
                {/* Second Icons Column */}
                <div className="flex-1 flex flex-row gap-2 justify-center">
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                </div>
                
                {/* Third Icons Column */}
                <div className="flex-1 flex flex-row gap-2 justify-end">
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <button className="w-fit p-2 border border-white/20 rounded-full hover:bg-white group transition-all duration-200">
                    <svg className="w-5 h-6 mx-auto text-white group-hover:text-black transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 3D Model Viewer */}
        <div className="w-[30%] p-4">
          <div className="border-2 border-gray-300 rounded-lg p-4 h-full">
            <TalkingHead text={ttsText} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-12 bg-[#101727] text-white/80">
        <div className="max mx-auto px-4 h-full flex items-center">
          <p className="text-sm font-light">&copy; 2025 32mins.com - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

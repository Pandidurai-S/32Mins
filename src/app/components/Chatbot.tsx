"use client";

import { useState, useRef, useEffect } from "react";
import Avatar3D from './Avatar3D';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

interface ChatbotProps {
  onMessage: (message: string) => void;
}

const Chatbot = ({ onMessage }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentBotMessage, setCurrentBotMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        text: input,
        isUser: true,
        time: getCurrentTime(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput("");

      // Clear previous bot message
      setCurrentBotMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse = `I received your message: "${input}". How can I help you further?`;
        const botMessage: Message = {
          text: botResponse,
          isUser: false,
          time: getCurrentTime(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        // Set the current bot message for the Avatar3D component
        setCurrentBotMessage(botResponse);
        // Send bot's response to TTS
        onMessage(botResponse);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full mx-auto max-w-[1400px]">

<div className="w-[600px]  display-none h-full relative " style={{ backgroundColor: '#E2E9F1' }} >
        <Avatar3D message={currentBotMessage} />
      </div>
      <div
        className="w-[400px] h-2/3 flex flex-col shadow-lg bg-white"
        style={{
          minWidth: "400px",
          position: "absolute",
        }}
      >
        <div className="header-chatbot p-3 flex items-start justify-between bg-gray-800">
          <h3 className="text-xl text-white font-semibold">AI Assistant</h3>
        </div>

        <div className="flex-1 chatbot-body p-4 flex flex-col bg-gray-50 overflow-hidden">
          <div 
            className="message-container flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" 
            style={{ 
              height: 'calc(100% - 100px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9CA3AF #F3F4F6'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`message-bubble ${
                    message.isUser 
                      ? 'user-message bg-blue-500 text-white' 
                      : 'bot-message bg-gray-100'
                  } p-3 rounded-lg max-w-[80%] shadow-sm`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`timestamp text-right mt-1 text-xs ${
                    message.isUser ? 'text-blue-200' : 'text-gray-200'
                  }`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex input-chatbot items-center space-x-2 bg-white p-3 rounded-lg shadow-sm" style={{ color: 'black' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="chat-input flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-grey-500"
            />
            <button
              className="send-button p-2 text-white focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-opacity-50 transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={handleSendMessage}
            >
              <svg 
                className="w-6 h-6 text-white transform rotate-45" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 
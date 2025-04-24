import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TalkingHead } from '../lib/TalkingHead';

interface Avatar3DProps {
  message: string;
}

const TALKING_HEAD_MODEL_PATH = '/models/talking-head.glb';

const Avatar3D = ({ message }: Avatar3DProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const talkingHeadRef = useRef<TalkingHead | null>(null);
  const [isBrowserReady, setIsBrowserReady] = useState(false);
  const [modelLoadError, setModelLoadError] = useState(false);

  // Initialize browser-specific features after mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isBrowserReady) {
      speechSynthRef.current = window.speechSynthesis;
      setIsBrowserReady(true);
    }
  }, [isBrowserReady]);

  useEffect(() => {
    const loadModel = async () => {
      if (!containerRef.current || !isBrowserReady) return;

      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(TALKING_HEAD_MODEL_PATH);
        
        if (modelRef.current) {
          sceneRef.current?.remove(modelRef.current);
        }

        modelRef.current = gltf.scene;
        sceneRef.current?.add(modelRef.current);
        
        // Initialize TalkingHead with the loaded GLTF
        talkingHeadRef.current = new TalkingHead(gltf);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelLoadError(true);
      }
    };

    loadModel();
  }, [isBrowserReady]);

  useEffect(() => {
    if (message && isBrowserReady && !modelLoadError) {
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthRef.current?.speak(utterance);
    }
  }, [message, isBrowserReady, modelLoadError]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {modelLoadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100">
          <p className="text-red-600">Error loading 3D model</p>
        </div>
      )}
    </div>
  );
};

export default Avatar3D; 
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface TalkingHeadProps {
  text?: string;
}

// Using the built-in types without redeclaring Window interface
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

// Viseme mapping based on Oculus visemes
const _VISEMES = {
  'sil': 0,   // silence
  'PP': 1,    // p, b, m
  'FF': 2,    // f, v
  'TH': 3,    // th
  'DD': 4,    // d, t, n
  'kk': 5,    // k, g
  'CH': 6,    // ch, j
  'SS': 7,    // s, z
  'nn': 8,    // n
  'RR': 9,    // r
  'aa': 10,   // a
  'E': 11,    // e
  'I': 12,    // i
  'O': 13,    // o
  'U': 14,    // u
};

class TalkingHeadModel {
  private model: GLTF;
  private currentViseme: string = 'sil';
  private targetViseme: string = 'sil';
  private blendAmount: number = 0;
  private transitionSpeed: number = 5.0;
  private morphTargets: THREE.Mesh[] = [];
  private hasValidMorphTargets: boolean = false;

  constructor(gltf: GLTF) {
    this.model = gltf;
    this.initializeMorphTargets();
  }

  private initializeMorphTargets() {
    this.morphTargets = [];
    this.model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.morphTargetDictionary && node.morphTargetInfluences) {
        console.log('Found mesh with morph targets:', node.name);
        console.log('Available morph targets:', Object.keys(node.morphTargetDictionary));
        this.morphTargets.push(node);
      }
    });
    
    this.hasValidMorphTargets = this.morphTargets.length > 0;
    if (!this.hasValidMorphTargets) {
      console.error('No valid morph targets found in the model');
    } else {
      console.log(`Found ${this.morphTargets.length} meshes with morph targets`);
    }
  }
  
  update(deltaTime: number): void {
    if (!this.hasValidMorphTargets) return;

    // Smoothly interpolate between visemes
    if (this.currentViseme !== this.targetViseme) {
      this.blendAmount += deltaTime * this.transitionSpeed;
      if (this.blendAmount >= 1.0) {
        this.blendAmount = 0;
        this.currentViseme = this.targetViseme;
      }
    }

    // Apply the current viseme to all morph targets
    this.morphTargets.forEach(mesh => {
      if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        // Reset all visemes
        for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
          mesh.morphTargetInfluences[i] = 0;
        }

        // Set the current viseme
        const currentIndex = mesh.morphTargetDictionary[this.currentViseme];
        const targetIndex = mesh.morphTargetDictionary[this.targetViseme];
        
        // Only apply morphs if they exist
        if (currentIndex !== undefined) {
          mesh.morphTargetInfluences[currentIndex] = 1.0 - this.blendAmount;
        }
        
        if (targetIndex !== undefined) {
          mesh.morphTargetInfluences[targetIndex] = this.blendAmount;
        }

        // If neither viseme exists, maintain neutral expression
        if (currentIndex === undefined && targetIndex === undefined) {
          // Find neutral or default expression if available
          const neutralIndex = mesh.morphTargetDictionary['neutral'] || 0;
          if (neutralIndex !== undefined) {
            mesh.morphTargetInfluences[neutralIndex] = 1.0;
          }
        }
      }
    });
  }
  
  speak(text: string): void {
    // This is a simplified version - in a real implementation,
    // you would receive phoneme timing data from your TTS system
    const words = text.split(' ');
    let allPhonemes: string[] = [];
    
    words.forEach(word => {
      const wordPhonemes = this.textToPhonemes(word);
      allPhonemes = [...allPhonemes, ...wordPhonemes, 'sil']; // Add silence between words
    });

    this.animatePhonemes(allPhonemes);
  }

  private textToPhonemes(text: string): string[] {
    const phonemes: string[] = [];
    const chars = text.toLowerCase().split('');
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      
      // Enhanced phoneme mapping
      if (char === 'p' || char === 'b' || char === 'm') {
        phonemes.push('PP');
      } else if (char === 'f' || char === 'v') {
        phonemes.push('FF');
      } else if (char === 't' || char === 'd' || char === 'n') {
        phonemes.push('DD');
      } else if (char === 'k' || char === 'g') {
        phonemes.push('kk');
      } else if (char === 's' || char === 'z') {
        phonemes.push('SS');
      } else if (char === 'r') {
        phonemes.push('RR');
      } else if (char === 'a') {
        phonemes.push('aa');
      } else if (char === 'e') {
        phonemes.push('E');
      } else if (char === 'i') {
        phonemes.push('I');
      } else if (char === 'o') {
        phonemes.push('O');
      } else if (char === 'u') {
        phonemes.push('U');
      } else {
        phonemes.push('sil');
      }
    }
    
    return phonemes;
  }

  private animatePhonemes(phonemes: string[]) {
    let currentIndex = 0;
    const phonemeDuration = 120; // Adjust timing (milliseconds)
    
    const animate = () => {
      if (currentIndex < phonemes.length) {
        this.targetViseme = phonemes[currentIndex];
        currentIndex++;
        setTimeout(animate, phonemeDuration);
      } else {
        this.targetViseme = 'sil';
      }
    };
    animate();
  }

  getModel(): GLTF {
    return this.model;
  }
}

const MODEL_PATH = '/models/32Mins_model_male_01.glb';
const FALLBACK_MODEL_PATH = '/models/32Mins_model_female_01.glb';

const TalkingHead: React.FC<TalkingHeadProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitlesRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const talkingHeadRef = useRef<TalkingHeadModel | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isBrowserReady, setIsBrowserReady] = useState(false);

  const loadModel = useCallback((modelPath: string) => {
    console.log('Loading model from path:', modelPath);
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf: GLTF) => {
        console.log('Model loaded successfully:', gltf);
        
        if (sceneRef.current) {
          // Remove any existing model
          if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
          }
          
          sceneRef.current.add(gltf.scene);
          modelRef.current = gltf.scene;
          
          try {
            talkingHeadRef.current = new TalkingHeadModel(gltf);
            console.log('TalkingHeadModel initialized successfully');
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            gltf.scene.position.sub(center);
            
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 0.4 / maxDim;
            gltf.scene.scale.multiplyScalar(scale);
            
            // Rotate model to face camera
            gltf.scene.rotation.y = Math.PI;
          } catch (error) {
            console.error('Error initializing TalkingHeadModel:', error);
            setModelLoadError(true);
          }
        } else {
          console.error('Scene reference is null');
        }
      },
      (progress: { loaded: number; total: number }) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading model progress: ${percent.toFixed(2)}%`);
      },
      (error: unknown) => {
        console.error('Error loading model:', error);
        if (modelPath === MODEL_PATH) {
          console.log('Attempting to load fallback model...');
          loadModel(FALLBACK_MODEL_PATH);
        } else {
          console.error('Both primary and fallback models failed to load');
          setModelLoadError(true);
        }
      }
    );
  }, []);

  // Initialize browser-specific features after mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isBrowserReady) {
      setIsBrowserReady(true);
    }
  }, [isBrowserReady]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !isBrowserReady) return;

    console.log('Initializing Three.js scene');
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xE2E9F1); // Light blue-gray background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    console.log('Starting model loading from:', MODEL_PATH);
    loadModel(MODEL_PATH);

    // Animation loop
    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (container && cameraRef.current && rendererRef.current) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      console.log('Cleaning up Three.js scene');
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, [isBrowserReady, loadModel]);

  // Effect to handle text changes
  useEffect(() => {
    if (text && talkingHeadRef.current) {
      // Generate speech
      if (synth) {
        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        // Customize voice settings
        utterance.rate = 0.9;  // Slightly slower for better sync
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Start mouth animation when speech starts
        utterance.onstart = () => {
          if (talkingHeadRef.current) {
            talkingHeadRef.current.speak(text);
          }
        };

        // Get available voices and set a natural sounding voice if available
        const voices = synth.getVoices();
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0];
        }

        // Update subtitles
        if (subtitlesRef.current) {
          subtitlesRef.current.textContent = text;
        }

        synth.speak(utterance);
      }
    }
  }, [text]);

  return (
    <div className="h-full flex flex-col relative">
      <div ref={containerRef} className="flex-1 bg-[#E2E9F1]" />
      {modelLoadError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          Error loading 3D model
        </div>
      )}
      <div
        ref={subtitlesRef}
        className="h-16 bg-black/50 text-white p-2 text-center"
      />
    </div>
  );
};

export default TalkingHead; 
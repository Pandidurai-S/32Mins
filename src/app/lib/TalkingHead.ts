import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface LipSyncData {
  visemeIndex: number;
  weight: number;
  duration: number;
}

export class TalkingHead {
  private mesh: THREE.SkinnedMesh | null = null;
  private morphTargetDictionary: { [key: string]: number } = {};
  private morphTargetInfluences: number[] = [];
  private currentViseme: number = 0;
  private targetViseme: number = 0;
  private transitionSpeed: number = 0.1;

  // Viseme mapping for English phonemes
  private static VISEMES = {
    'sil': 0,  // silence
    'PP': 1,   // p, b, m
    'FF': 2,   // f, v
    'TH': 3,   // th
    'DD': 4,   // d, t, n
    'kk': 5,   // k, g
    'CH': 6,   // ch, j, sh
    'SS': 7,   // s, z
    'nn': 8,   // n
    'RR': 9,   // r
    'aa': 10,  // a
    'E':  11,  // e
    'ih': 12,  // i
    'oh': 13,  // o
    'ou': 14   // u
  };

  constructor(model: GLTF) {
    this.setupMesh(model);
  }

  private setupMesh(model: GLTF) {
    model.scene.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        this.mesh = child;
        if (child.morphTargetDictionary) {
          this.morphTargetDictionary = child.morphTargetDictionary;
        }
        if (child.morphTargetInfluences) {
          this.morphTargetInfluences = child.morphTargetInfluences;
        }
        console.log('Found talking head mesh:', {
          name: child.name,
          morphTargets: this.morphTargetDictionary,
          influences: this.morphTargetInfluences.length
        });
      }
    });
  }

  public async processText(_text: string): Promise<LipSyncData[]> {
    // TODO: Implement text to phoneme conversion
    // For now, return a simple test pattern
    return [
      { visemeIndex: 0, weight: 1, duration: 100 },
      { visemeIndex: 10, weight: 0.8, duration: 200 },
      { visemeIndex: 4, weight: 0.6, duration: 150 },
      { visemeIndex: 0, weight: 1, duration: 100 }
    ];
  }

  public update(_deltaTime: number) {
    if (!this.mesh || !this.morphTargetInfluences) return;

    // Smoothly interpolate between current and target visemes
    this.currentViseme += (this.targetViseme - this.currentViseme) * this.transitionSpeed;

    // Update morph targets
    for (let i = 0; i < this.morphTargetInfluences.length; i++) {
      this.morphTargetInfluences[i] = 0;
    }

    // Set the current viseme
    if (this.currentViseme >= 0 && this.currentViseme < this.morphTargetInfluences.length) {
      this.morphTargetInfluences[Math.floor(this.currentViseme)] = 1 - (this.currentViseme % 1);
      this.morphTargetInfluences[Math.ceil(this.currentViseme)] = this.currentViseme % 1;
    }
  }

  public setViseme(visemeIndex: number) {
    this.targetViseme = visemeIndex;
  }

  public reset() {
    if (!this.mesh || !this.morphTargetInfluences) return;
    
    for (let i = 0; i < this.morphTargetInfluences.length; i++) {
      this.morphTargetInfluences[i] = 0;
    }
    this.currentViseme = 0;
    this.targetViseme = 0;
  }
} 
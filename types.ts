export enum GameMode {
  PECK_THE_BUG = 'PECK_THE_BUG',
  FALLING_FRUIT = 'FALLING_FRUIT',
  SCREENSAVER = 'SCREENSAVER',
}

export enum DetectionMode {
  TOUCH = 'TOUCH',
  SOUND = 'SOUND',
  VIBRATION = 'VIBRATION',
  MIXED = 'MIXED' // Sound + Vibration
}

export interface BackgroundSetting {
  type: 'color' | 'image';
  value: string;
  name: string;
}

export interface AppSettings {
  soundThreshold: number; // 0.0 to 1.0
  vibrationThreshold: number; // 1.0 to 20.0 (m/s^2)
  detectionMode: DetectionMode;
  debugMode: boolean;
}

export interface GameAssets {
  bugImages: string[];
  fruitImages: string[];
  background: BackgroundSetting;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number; // 0 to 1
  decay: number;
}
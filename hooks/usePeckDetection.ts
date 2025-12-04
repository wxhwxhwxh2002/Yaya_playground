import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSettings, DetectionMode } from '../types';

interface PeckHookProps {
  settings: AppSettings;
  onPeck: (source: 'touch' | 'sound' | 'motion') => void;
  isActive: boolean;
}

export const usePeckDetection = ({ settings, onPeck, isActive }: PeckHookProps) => {
  const [micPermission, setMicPermission] = useState<PermissionState>('prompt');
  const [motionPermission, setMotionPermission] = useState<PermissionState>('prompt');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const lastPeckTime = useRef<number>(0);
  const rafId = useRef<number>(0);

  // --- Helpers ---

  // Debounce to prevent machine-gun triggering from one peck
  const triggerPeck = (source: 'touch' | 'sound' | 'motion') => {
    const now = Date.now();
    if (now - lastPeckTime.current > 150) { // 150ms debounce
      lastPeckTime.current = now;
      onPeck(source);
    }
  };

  // --- Touch Logic ---
  const handleTouch = useCallback(() => {
    if (settings.detectionMode === DetectionMode.TOUCH || settings.debugMode) {
      triggerPeck('touch');
    }
  }, [settings.detectionMode, settings.debugMode]);


  // --- Motion Logic ---
  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        setMotionPermission(permissionState);
        return permissionState === 'granted';
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    setMotionPermission('granted');
    return true;
  };

  useEffect(() => {
    if (!isActive) return;
    if (settings.detectionMode !== DetectionMode.VIBRATION && settings.detectionMode !== DetectionMode.MIXED) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!event.acceleration) return;
      const z = Math.abs(event.acceleration.z || 0);
      // Z-axis spike check
      if (z > settings.vibrationThreshold) {
         triggerPeck('motion');
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isActive, settings.detectionMode, settings.vibrationThreshold]);


  // --- Audio Logic ---
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.fftSize) as Uint8Array<ArrayBuffer>;
      setMicPermission('granted');
      startListening();
    } catch (err) {
      console.error("Mic Error:", err);
      setMicPermission('denied');
    }
  };

  const startListening = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const checkAudio = () => {
      if (!isActive) return;
      
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);
      
      // Calculate RMS (Volume)
      let sum = 0;
      for(let i = 0; i < dataArrayRef.current!.length; i++) {
        sum += dataArrayRef.current![i];
      }
      const average = sum / dataArrayRef.current!.length;
      
      // Normalize 0-255 to 0.0-1.0 roughly for comparison
      const normalizedVol = average / 128; 

      if (
        (settings.detectionMode === DetectionMode.SOUND || settings.detectionMode === DetectionMode.MIXED) &&
        normalizedVol > settings.soundThreshold
      ) {
        triggerPeck('sound');
      }

      rafId.current = requestAnimationFrame(checkAudio);
    };
    checkAudio();
  };

  useEffect(() => {
    if (isActive && (settings.detectionMode === DetectionMode.SOUND || settings.detectionMode === DetectionMode.MIXED)) {
      if (!audioContextRef.current) {
        // Must be initialized by user gesture ideally, handle via UI button
      } else {
        startListening();
      }
    }
    return () => cancelAnimationFrame(rafId.current);
  }, [isActive, settings.detectionMode, settings.soundThreshold]);

  return {
    handleTouch,
    requestMotionPermission,
    initAudio,
    micPermission,
    motionPermission
  };
};
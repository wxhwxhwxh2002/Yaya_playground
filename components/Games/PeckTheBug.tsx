import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameAssets, Particle } from '../../types';

interface Props {
  assets: GameAssets;
  peckTrigger: number;
}

export const PeckTheBug: React.FC<Props> = ({ assets, peckTrigger }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [currentBug, setCurrentBug] = useState(assets.bugImages[0]);
  const [isHit, setIsHit] = useState(false);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>(0);
  
  // Track the last processed peck to prevent infinite loops when other state changes
  const lastProcessedPeck = useRef(peckTrigger);

  // Helper to pick random bug
  const pickRandomBug = useCallback(() => {
    const idx = Math.floor(Math.random() * assets.bugImages.length);
    setCurrentBug(assets.bugImages[idx]);
  }, [assets.bugImages]);

  // Move bug randomly
  const moveBug = useCallback(() => {
    const x = 15 + Math.random() * 70;
    const y = 15 + Math.random() * 70;
    setPosition({ x, y });
    setIsHit(false);
  }, []);

  useEffect(() => {
    // Initial bug
    pickRandomBug();
    const interval = setInterval(moveBug, 2500); 
    return () => clearInterval(interval);
  }, [moveBug, pickRandomBug]);

  // Spawn particles
  const spawnParticles = (xPct: number, yPct: number) => {
    const newParticles: Particle[] = [];
    const count = 20; // Increased count for better effect
    const colors = ['#F59E0B', '#FCD34D', '#FFFFFF', '#000000', '#EF4444'];
    
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.0;
        newParticles.push({
            id: Date.now() + i + Math.random(),
            x: xPct, 
            y: yPct,
            vx: Math.cos(angle) * speed, 
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 4 + Math.random() * 12,
            life: 1.0,
            decay: 0.02 + Math.random() * 0.03
        });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Particle Loop
  useEffect(() => {
    const loop = () => {
        setParticles(prev => prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - p.decay,
            vy: p.vy + 0.05 // Gravity
        })).filter(p => p.life > 0));
        animationRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // React to peck
  useEffect(() => {
    // Only trigger if peckTrigger has incremented since last time
    if (peckTrigger > lastProcessedPeck.current) {
        lastProcessedPeck.current = peckTrigger;

        if (!isHit) {
            setIsHit(true);
            setScore(s => s + 1);
            spawnParticles(position.x, position.y);
            
            // Move after delay
            setTimeout(() => {
                pickRandomBug();
                moveBug();
            }, 400); 
        }
    }
  }, [peckTrigger, moveBug, position, isHit, pickRandomBug]);

  return (
    <div className="relative w-full h-full overflow-hidden">
        {/* Score Display */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-xl font-bold text-white z-10 pointer-events-none border border-white/10">
            🐛 {score}
        </div>

        {/* Particles */}
        {particles.map(p => (
            <div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    opacity: p.life,
                    transform: 'translate(-50%, -50%)'
                }}
            />
        ))}

        {/* The Bug */}
        <div
            className={`absolute w-32 h-32 transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2
                ${isHit ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
            `}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
            <img 
                src={currentBug} 
                alt="Bug" 
                className={`w-full h-full object-contain drop-shadow-2xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] ${!isHit ? 'animate-float' : ''}`} 
            />
            {/* Hit Flash */}
            {isHit && (
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            )}
        </div>
    </div>
  );
};
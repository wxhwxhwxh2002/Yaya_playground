import React, { useState, useEffect, useRef } from 'react';
import { GameAssets, Particle } from '../../types';
import { FRUIT_COLORS } from '../../constants';

interface Props {
  assets: GameAssets;
  peckTrigger: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  speed: number;
  rot: number;
  rotSpeed: number;
  img: string;
  color: string;
  isBroken: boolean;
}

export const FallingFruit: React.FC<Props> = ({ assets, peckTrigger }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shake, setShake] = useState(false);

  // Extract color from filename roughly (using the constant map)
  const getColor = (url: string) => {
      for (const key in FRUIT_COLORS) {
          if (url.includes(key)) return FRUIT_COLORS[key];
      }
      return '#FFF';
  };

  // Spawner
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const randImg = assets.fruitImages[Math.floor(Math.random() * assets.fruitImages.length)];
        const newItem: Item = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: -15,
          speed: 0.3 + Math.random() * 0.8,
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 5,
          img: randImg,
          color: getColor(randImg),
          isBroken: false
        };
        // Cleanup old items
        const filtered = prev.filter(i => i.y < 110 && !i.isBroken);
        return [...filtered, newItem];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [assets.fruitImages]);

  // Particle Spawner
  const explodeItem = (item: Item) => {
      const newParticles: Particle[] = [];
      const count = 12;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        newParticles.push({
            id: Date.now() + Math.random(),
            x: item.x,
            y: item.y,
            vx: Math.cos(angle) * speed * 0.5, // X velocity (percent-ish)
            vy: Math.sin(angle) * speed * 0.5, // Y velocity
            color: item.color,
            size: 4 + Math.random() * 8,
            life: 1.0,
            decay: 0.02 + Math.random() * 0.02
        });
      }
      setParticles(p => [...p, ...newParticles]);
  };

  // Game Loop
  useEffect(() => {
    let loopId: number;
    const loop = () => {
      // Update Items
      setItems(prev => prev.map(item => ({
        ...item,
        y: item.y + item.speed,
        rot: item.rot + item.rotSpeed
      })).filter(i => i.y < 120)); // Cull off screen

      // Update Particles
      setParticles(prev => prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.05, // Gravity
          life: p.life - p.decay
      })).filter(p => p.life > 0));

      loopId = requestAnimationFrame(loop);
    };
    loopId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopId);
  }, []);

  // React to peck
  useEffect(() => {
    if (peckTrigger > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 200);

      // Effect: Break nearby items or random items
      setItems(prev => {
          const nextItems: Item[] = [];
          prev.forEach(item => {
              // 60% chance to break an item on screen shake (stimulating chaos)
              // Or check if it's "close" to a hypothetical impact point? 
              // Since peck location is unknown for sound/vib, we use random chaos.
              if (item.y > 10 && item.y < 90 && Math.random() > 0.4) {
                  explodeItem(item); // Spawn particles
                  // Item is removed (don't push to nextItems)
              } else {
                  // Bounce remaining items
                  nextItems.push({
                      ...item,
                      y: item.y - 5,
                      speed: item.speed * 0.5
                  });
              }
          });
          return nextItems;
      });
    }
  }, [peckTrigger]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${shake ? 'animate-shake' : ''}`} ref={containerRef}>
        {/* Particles */}
        {particles.map(p => (
            <div
                key={p.id}
                className="absolute rounded-full"
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

        {/* Fruit Items */}
        {items.map(item => (
            <img
            key={item.id}
            src={item.img}
            alt="Fruit"
            className="absolute w-24 h-24 object-contain drop-shadow-xl transition-transform will-change-transform"
            style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rot}deg)`
            }}
            />
        ))}
    </div>
  );
};
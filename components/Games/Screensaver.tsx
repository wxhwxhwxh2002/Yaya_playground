import React, { useEffect, useRef } from 'react';
import { GameAssets } from '../../types';

interface Props {
  assets: GameAssets;
  peckTrigger: number;
}

export const Screensaver: React.FC<Props> = ({ assets, peckTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{x: number, y: number, vx: number, vy: number, color: string, radius: number}>>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init particles
    const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];
    for (let i = 0; i < 40; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 10 + Math.random() * 20
      });
    }

    // Animation Loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle Peck
  useEffect(() => {
    if (peckTrigger > 0 && canvasRef.current) {
        // Random explosion force from a random point (simulating a peck somewhere)
        const cx = Math.random() * canvasRef.current.width;
        const cy = Math.random() * canvasRef.current.height;

        particles.current.forEach(p => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 400) {
                // Push away
                const force = (400 - dist) / 20;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        });
    }
  }, [peckTrigger]);

  return (
    <canvas ref={canvasRef} className="w-full h-full block" />
  );
};
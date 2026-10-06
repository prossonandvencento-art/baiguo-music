import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface CosmicCanvasProps {
  isPlaying: boolean;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle setup
    const starCount = 80;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      pulseSpeed: number;
      phase: number;
    }> = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const freqData = new Uint8Array(16);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Get subtle audio boost if playing
      let energy = 0;
      if (isPlaying) {
        audioEngine.getFrequencyData(freqData);
        const sum = freqData.reduce((acc, v) => acc + v, 0);
        energy = sum / (freqData.length * 255);
      }

      stars.forEach((star, idx) => {
        star.phase += star.pulseSpeed;
        const currentOpacity = Math.min(
          1,
          star.opacity + Math.sin(star.phase) * 0.2 + energy * 0.3
        );
        const currentSize = star.size * (1 + energy * 0.4);

        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);

        // Color variation: cool blue-white stardust
        if (idx % 4 === 0) {
          ctx.fillStyle = `rgba(137, 170, 204, ${currentOpacity})`;
        } else {
          ctx.fillStyle = `rgba(235, 240, 255, ${currentOpacity * 0.8})`;
        }
        ctx.fill();

        // Slow upward drift
        star.y -= star.speed * (1 + energy * 0.5);
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-1000"
    />
  );
};

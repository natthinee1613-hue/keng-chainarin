import React, { useEffect, useRef } from 'react';
import { CoverTheme } from '../types/cover';

interface CoverCanvasAnimationProps {
  theme: CoverTheme;
  enableParticles: boolean;
  enableRadar: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export const CoverCanvasAnimation: React.FC<CoverCanvasAnimationProps> = ({
  theme,
  enableParticles,
  enableRadar,
  animationSpeed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = enableParticles ? Math.floor((width * height) / 18000) + 20 : 0;
    const speedMult = animationSpeed === 'slow' ? 0.4 : animationSpeed === 'fast' ? 1.8 : 1.0;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7 * speedMult,
        vy: (Math.random() - 0.5) * 0.7 * speedMult,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Radar state
    let radarAngle = 0;
    let pulseRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Radar sweep & concentric rings (positioned on right side or center)
      if (enableRadar) {
        const cx = width > 768 ? width * 0.78 : width * 0.5;
        const cy = height * 0.5;
        const maxRadius = Math.min(width, height) * 0.65;

        // Concentric range circles
        ctx.save();
        ctx.strokeStyle = theme.radarColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        for (let r = 50; r <= maxRadius; r += 55) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radar crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxRadius, cy);
        ctx.lineTo(cx + maxRadius, cy);
        ctx.moveTo(cx, cy - maxRadius);
        ctx.lineTo(cx, cy + maxRadius);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulse ring expanding
        pulseRadius += 0.8 * speedMult;
        if (pulseRadius > maxRadius) pulseRadius = 0;
        const pulseAlpha = Math.max(0, 1 - pulseRadius / maxRadius) * 0.4;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = theme.radarColor.replace(/[\d.]+\)$/, `${pulseAlpha})`);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Radar sweep gradient wedge
        const sweepGrad = ctx.createConicGradient(radarAngle, cx, cy);
        sweepGrad.addColorStop(0, theme.radarColor);
        sweepGrad.addColorStop(0.12, theme.radarColor.replace(/[\d.]+\)$/, '0.01)'));
        sweepGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxRadius, radarAngle, radarAngle + Math.PI * 0.4);
        ctx.closePath();
        ctx.fill();

        // Tactical blips in the radar area
        const blips = [
          { r: 70, a: 0.8, size: 3 },
          { r: 110, a: 2.2, size: 2.5 },
          { r: 160, a: 3.8, size: 3.5 },
          { r: 210, a: 5.1, size: 2.8 },
        ];
        blips.forEach((blip) => {
          if (blip.r <= maxRadius) {
            const bx = cx + Math.cos(blip.a) * blip.r;
            const by = cy + Math.sin(blip.a) * blip.r;
            ctx.beginPath();
            ctx.arc(bx, by, blip.size, 0, Math.PI * 2);
            ctx.fillStyle = theme.accentColor;
            ctx.shadowColor = theme.accentColor;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        ctx.restore();

        // Increment angle
        radarAngle += 0.02 * speedMult;
        if (radarAngle > Math.PI * 2) radarAngle -= Math.PI * 2;
      }

      // 2. Particle network
      if (enableParticles && particles.length > 0) {
        ctx.save();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = theme.accentColor;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          // Connect nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = theme.accentColor;
              ctx.globalAlpha = (1 - dist / 110) * 0.15;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, enableParticles, enableRadar, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

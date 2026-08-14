import { useEffect, useRef } from 'react';

type Particle = {
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

class Petal implements Particle {
  x = 0;
  y = 0;
  size = 0;
  speedY = 0;
  speedX = 0;
  rotation = 0;
  rotationSpeed = 0;
  color = '#8B0000';
  w: number;
  h: number;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.reset();
    this.y = Math.random() * h;
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = -20;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.color = Math.random() > 0.5 ? '#8B0000' : '#F4A0A0';
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
    this.rotation += this.rotationSpeed;
    if (this.y > this.h) this.reset();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size, -this.size, this.size * 2, 0, 0, this.size * 2);
    ctx.bezierCurveTo(-this.size * 2, 0, -this.size, -this.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

class Sparkle implements Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  direction: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 1;
    this.alpha = Math.random();
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.direction = 1;
  }

  update() {
    this.alpha += this.pulseSpeed * this.direction;
    if (this.alpha >= 1 || this.alpha <= 0.1) this.direction *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px Arial';
    ctx.fillText('✦', this.x, this.y);
    ctx.restore();
  }
}

class BurstPetal implements Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  gravity = 0.1;
  rotation: number;
  rotationSpeed: number;
  alpha = 1;
  decay: number;
  color = '#F4A0A0';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 4;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity - 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 5;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size, -this.size, this.size * 2, 0, 0, this.size * 2);
    ctx.bezierCurveTo(-this.size * 2, 0, -this.size, -this.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

export default function ParticleCanvas({ onReady }: { onReady?: (burst: (x: number, y: number) => void) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const burstRef = useRef<BurstPetal[]>([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    for (let i = 0; i < 20; i++) particles.push(new Petal(width, height));
    for (let i = 0; i < 30; i++) particles.push(new Sparkle(width, height));

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      const burst = burstRef.current;
      for (let i = burst.length - 1; i >= 0; i--) {
        const p = burst[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) burst.splice(i, 1);
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onDocClick = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('button')) {
        for (let i = 0; i < 5; i++) burstRef.current.push(new BurstPetal(e.clientX, e.clientY));
      }
    };
    document.addEventListener('click', onDocClick);

    onReady?.((x: number, y: number) => {
      for (let i = 0; i < 30; i++) burstRef.current.push(new BurstPetal(x, y));
    });

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', onDocClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} id="particleCanvas" className="fixed inset-0 pointer-events-none z-50" />;
}

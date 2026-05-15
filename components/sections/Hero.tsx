'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Users, CalendarDays, MapPin } from 'lucide-react';

const WORDS = ['Musicians', 'DJs', 'Producers', 'Venues', 'Promoters', 'Creatives'];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      radius: number; opacity: number; color: string;
    }> = [];

    const colors = ['#a855f7', '#06b6d4', '#f43f5e', '#6366f1'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = '#a855f7';
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;

      animFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-purple-600/20 top-[-100px] left-[-200px] z-0" />
      <div className="orb w-[400px] h-[400px] bg-cyan-500/15 bottom-[-100px] right-[-100px] z-0" />
      <div className="orb w-[300px] h-[300px] bg-pink-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">
            Now Live in 24 Cities
          </span>
        </div>

        {/* Headline */}
        <h1 className="display-xl text-white mb-2">
          Built for the
        </h1>
        <h1 className="display-xl mb-6">
          <span
            className={`gradient-text-purple inline-block transition-all duration-400 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
          >
            {WORDS[wordIndex]}
          </span>
          <span className="text-white"> Who</span>
        </h1>
        <h1 className="display-xl text-white mb-8">
          Build the Scene.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Stagefront is the professional network powering local music culture —
          connecting artists, venues, promoters, and creatives to collaborate,
          perform, and build something real.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/signup"
            className="group relative flex items-center gap-3 font-semibold text-white px-8 py-4 rounded-xl overflow-hidden text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)' }} />
            <span className="relative">Create Your Profile</span>
            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#"
            className="flex items-center gap-3 font-semibold text-white glass px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            Watch the Demo
          </a>
        </div>

        {/* Stats ticker */}
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {[
            { icon: Users, value: '14,200+', label: 'Artists & Venues' },
            { icon: CalendarDays, value: '3,800+', label: 'Events Booked' },
            { icon: MapPin, value: '24', label: 'Cities & Growing' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-xl leading-none">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent animate-pulse" />
        <span className="text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060608] to-transparent z-10" />
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 14200, suffix: '+', label: 'Artists & Creatives', description: 'Professional profiles across 24 cities' },
  { value: 3800, suffix: '+', label: 'Events Booked', description: 'Through the Stagefront platform' },
  { value: 640, suffix: '+', label: 'Active Venues', description: 'Nightclubs, bars, theaters & festivals' },
  { value: 2100, suffix: '+', label: 'Collaborations', description: 'Artist-to-artist connections made' },
];

function useCountUp(target: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, enabled]);
  return count;
}

function StatItem({ value, suffix, label, description, enabled }: typeof stats[0] & { enabled: boolean }) {
  const count = useCountUp(value, 2000, enabled);
  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-black text-white mb-2 tabular-nums tracking-tight">
        <span className="gradient-text-purple">
          {count.toLocaleString()}{suffix}
        </span>
      </div>
      <div className="text-white font-semibold text-lg mb-1">{label}</div>
      <div className="text-slate-500 text-sm">{description}</div>
    </div>
  );
}

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      <div className="orb w-[800px] h-[400px] bg-purple-600/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mb-4">
            The Numbers Behind the Scene
          </p>
          <h2 className="display-md text-white">
            A Platform Built on <br />
            <span className="gradient-text-purple">Real Culture</span>
          </h2>
        </div>

        <div className="glass rounded-3xl p-10 md:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label}>
                {i > 0 && (
                  <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-px bg-white/[0.06]" style={{ position: 'relative' }} />
                )}
                <StatItem {...stat} enabled={visible} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

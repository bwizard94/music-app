'use client';

import {
  Music, Headphones, Mic2, Drum, Camera, Video,
  Lightbulb, Megaphone, Palette, Radio, Users, Star,
} from 'lucide-react';

const roles = [
  { icon: Headphones, label: 'DJs', count: '4,200+', color: '#a855f7' },
  { icon: Mic2, label: 'Vocalists', count: '2,100+', color: '#ec4899' },
  { icon: Music, label: 'Bands', count: '890+', color: '#06b6d4' },
  { icon: Drum, label: 'Drummers', count: '1,300+', color: '#f59e0b' },
  { icon: Camera, label: 'Photographers', count: '760+', color: '#10b981' },
  { icon: Video, label: 'Videographers', count: '540+', color: '#f43f5e' },
  { icon: Lightbulb, label: 'Lighting Designers', count: '320+', color: '#8b5cf6' },
  { icon: Megaphone, label: 'Promoters', count: '1,100+', color: '#06b6d4' },
  { icon: Palette, label: 'Visual Artists', count: '680+', color: '#ec4899' },
  { icon: Radio, label: 'Producers', count: '2,900+', color: '#a855f7' },
  { icon: Users, label: 'Bands & Groups', count: '450+', color: '#f59e0b' },
  { icon: Star, label: 'Venues', count: '640+', color: '#f43f5e' },
];

export default function CreativeRoles() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="scene-divider mb-24" />
      <div className="orb w-[500px] h-[500px] bg-pink-600/10 top-0 left-1/2 -translate-x-1/2 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-pink-500" />
            <span className="text-pink-400 text-xs font-semibold tracking-widest uppercase">
              For Every Creative
            </span>
            <div className="w-6 h-px bg-pink-500" />
          </div>
          <h2 className="display-md text-white mb-4">
            One Platform. <br />
            <span className="gradient-text-purple">Every Role in the Room.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Stagefront isn&apos;t just for musicians. It&apos;s the full professional
            ecosystem of live entertainment — built for everyone who makes the show happen.
          </p>
        </div>

        {/* Role grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <a
                key={role.label}
                href="/signup"
                className="group card-hover"
              >
                <div className="glass rounded-xl p-4 text-center hover:border-white/15 transition-all duration-300">
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: `${role.color}15`,
                      border: `1px solid ${role.color}25`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: role.color }} />
                  </div>
                  <div className="text-white font-semibold text-sm mb-0.5">{role.label}</div>
                  <div className="text-slate-600 text-xs">{role.count}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="scene-divider mt-24" />
    </section>
  );
}

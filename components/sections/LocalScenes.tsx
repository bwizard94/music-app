'use client';

import { MapPin, TrendingUp, Users, Music } from 'lucide-react';

const scenes = [
  {
    city: 'Chicago',
    state: 'IL',
    artists: 1240,
    venues: 87,
    events: 340,
    trending: 'Techno & Industrial',
    color: '#a855f7',
    bgColor: 'from-purple-900/40 to-purple-900/10',
    image: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=600&q=80',
  },
  {
    city: 'New York',
    state: 'NY',
    artists: 3870,
    venues: 220,
    events: 890,
    trending: 'Hip-Hop & Jazz Fusion',
    color: '#06b6d4',
    bgColor: 'from-cyan-900/40 to-cyan-900/10',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
  },
  {
    city: 'Los Angeles',
    state: 'CA',
    artists: 2950,
    venues: 165,
    events: 670,
    trending: 'Indie & R&B',
    color: '#f43f5e',
    bgColor: 'from-rose-900/40 to-rose-900/10',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    city: 'Austin',
    state: 'TX',
    artists: 1680,
    venues: 140,
    events: 520,
    trending: 'Country & Americana',
    color: '#f59e0b',
    bgColor: 'from-amber-900/40 to-amber-900/10',
    image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600&q=80',
  },
  {
    city: 'Portland',
    state: 'OR',
    artists: 890,
    venues: 72,
    events: 280,
    trending: 'Ambient & Experimental',
    color: '#10b981',
    bgColor: 'from-emerald-900/40 to-emerald-900/10',
    image: 'https://images.unsplash.com/photo-1548793901-8f7c5673f4de?w=600&q=80',
  },
  {
    city: 'Detroit',
    state: 'MI',
    artists: 760,
    venues: 54,
    events: 210,
    trending: 'Techno (Origin)',
    color: '#8b5cf6',
    bgColor: 'from-violet-900/40 to-violet-900/10',
    image: 'https://images.unsplash.com/photo-1555399096-25fcd8d39527?w=600&q=80',
  },
];

export default function LocalScenes() {
  return (
    <section id="scenes" className="py-24 relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-purple-600/10 top-0 right-0 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-purple-500" />
            <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
              Local Scenes
            </span>
            <div className="w-6 h-px bg-purple-500" />
          </div>
          <h2 className="display-md text-white mb-4">
            Your City. <br />
            <span className="gradient-text-purple">Your Scene. Your Network.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Stagefront is rooted in local culture. Discover who&apos;s building the scene in
            your city — and plug in directly.
          </p>
        </div>

        {/* Scene grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenes.map((scene) => (
            <a
              key={scene.city}
              href="/scene"
              className="group card-hover block"
            >
              <div className="relative glass rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={scene.image}
                    alt={scene.city}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${scene.bgColor}`} />
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-white font-black text-2xl tracking-tight">{scene.city}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        {scene.state}
                      </div>
                    </div>
                    <div
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${scene.color}15`,
                        color: scene.color,
                        border: `1px solid ${scene.color}30`,
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-400 text-sm mb-4 font-medium">
                    {scene.trending}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Users, value: scene.artists.toLocaleString(), label: 'Artists' },
                      { icon: MapPin, value: scene.venues, label: 'Venues' },
                      { icon: Music, value: scene.events, label: 'Events/Mo' },
                    ].map(({ icon: Icon, value, label }) => (
                      <div
                        key={label}
                        className="text-center p-3 rounded-xl"
                        style={{ backgroundColor: `${scene.color}10`, border: `1px solid ${scene.color}15` }}
                      >
                        <Icon className="w-3 h-3 mx-auto mb-1.5" style={{ color: scene.color }} />
                        <div className="text-white font-bold text-sm">{value}</div>
                        <div className="text-slate-600 text-xs">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* More cities teaser */}
        <div className="text-center mt-10">
          <p className="text-slate-600 text-sm mb-4">
            + Atlanta, Seattle, Denver, Miami, Nashville, and 12 more cities
          </p>
          <a
            href="/scene"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            View all scenes
            <span className="text-purple-600">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

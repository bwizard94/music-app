'use client';

import Link from 'next/link';
import { MapPin, Users, CalendarDays, Music2, TrendingUp, ChevronRight, Zap, LayoutDashboard } from 'lucide-react';
import { SCENES } from '@/components/scene/sceneData';

const GENRE_HUBS = [
  { name: 'Techno', color: '#06b6d4', count: 3840, icon: '⬡' },
  { name: 'Industrial', color: '#f59e0b', count: 1290, icon: '◼' },
  { name: 'House', color: '#10b981', count: 4210, icon: '◆' },
  { name: 'EBM', color: '#f43f5e', count: 870, icon: '▲' },
  { name: 'Ambient', color: '#a855f7', count: 2100, icon: '◯' },
  { name: 'Experimental', color: '#ec4899', count: 1680, icon: '✦' },
  { name: 'Noise', color: '#8b5cf6', count: 620, icon: '◩' },
  { name: 'Minimal', color: '#14b8a6', count: 1450, icon: '▪' },
];

export default function SceneIndexPage() {
  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-3">
        <Link href="/" className="font-black text-lg tracking-tight gradient-text-purple mr-auto">STAGEFRONT</Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <LayoutDashboard className="w-4 h-4" /><span className="hidden sm:block">Dashboard</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold">Scene Hubs</span>
      </nav>

      <div className="pt-14">
        {/* Hero */}
        <div className="relative overflow-hidden px-6 py-16 text-center">
          <div className="absolute inset-0">
            <div className="orb w-96 h-96 -top-20 left-1/4 opacity-20" style={{ background: '#a855f7' }} />
            <div className="orb w-96 h-96 -bottom-20 right-1/4 opacity-15" style={{ background: '#06b6d4' }} />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">Scene Hubs</span>
            </div>
            <h1 className="text-white font-black text-4xl sm:text-5xl mb-4 leading-tight">
              Your Scene.<br />Your Sound.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
              Hyper-local hubs for every city's underground. Find your people, discover your city's events, post opportunities, and grow the scene together.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-12">
          {/* Scene of the week */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-bold">Scene of the Week</h2>
              <span className="text-slate-600 text-xs ml-auto">Jun 15 – Jun 21</span>
            </div>
            <Link href="/scene/chicago" className="group block relative rounded-2xl overflow-hidden h-64 border border-white/[0.07] hover:border-white/[0.14] transition-all">
              <img src={SCENES[0].coverImage} alt="Chicago" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/90 via-[#060608]/50 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
                    ★ Scene of the Week
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#a855f720', color: '#a855f7', border: '1px solid #a855f730' }}>
                    Chicago, US
                  </span>
                </div>
                <h3 className="text-white font-black text-3xl mb-1">{SCENES[0].name}</h3>
                <p className="text-slate-300 text-sm max-w-lg">{SCENES[0].tagline}</p>
                <div className="flex gap-4 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{SCENES[0].stats.artists.toLocaleString()} artists</span>
                  <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{SCENES[0].stats.eventsMonth} events this month</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400" />{SCENES[0].trending}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* All scenes */}
          <div>
            <h2 className="text-white font-bold mb-4">Active Scenes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENES.map((scene) => (
                <Link
                  key={scene.id}
                  href={`/scene/${scene.slug}`}
                  className="group glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all duration-200 card-hover"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={scene.coverImage} alt={scene.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-[#060608]/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scene.accentColor }} />
                        <span className="text-xs text-slate-300">{scene.country}</span>
                      </div>
                      <h3 className="text-white font-black text-xl">{scene.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-slate-500 text-xs italic mb-3">"{scene.tagline}"</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {scene.topGenres.slice(0, 3).map((g) => (
                        <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500 border border-white/[0.05]">{g}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { val: scene.stats.artists, label: 'Artists' },
                        { val: scene.stats.eventsMonth, label: 'Events/mo' },
                        { val: scene.stats.collectives, label: 'Collectives' },
                      ].map(({ val, label }) => (
                        <div key={label}>
                          <div className="text-white font-bold text-sm">{val}</div>
                          <div className="text-slate-600 text-[10px]">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Genre hubs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Music2 className="w-4 h-4 text-purple-400" />
              <h2 className="text-white font-bold">Genre Communities</h2>
              <span className="text-slate-600 text-xs ml-auto">Cross-city networks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GENRE_HUBS.map((genre) => (
                <button
                  key={genre.name}
                  className="glass rounded-xl p-4 border border-white/[0.07] hover:border-white/[0.14] transition-all group text-left card-hover"
                >
                  <div
                    className="text-2xl mb-3 w-10 h-10 rounded-xl flex items-center justify-center font-black"
                    style={{ backgroundColor: `${genre.color}15`, color: genre.color, border: `1px solid ${genre.color}25` }}
                  >
                    {genre.icon}
                  </div>
                  <div className="text-white font-bold text-sm">{genre.name}</div>
                  <div className="text-slate-600 text-xs mt-0.5">{genre.count.toLocaleString()} members</div>
                  <div className="flex items-center gap-1 mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: genre.color }}>
                    <span>Enter hub</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

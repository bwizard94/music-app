'use client';

import { Music, Headphones, Mic2, Drum, ChevronRight, MapPin, Star } from 'lucide-react';

const artists = [
  {
    name: 'NOVA VEGA',
    handle: '@novavega',
    genre: 'Electronic / Techno',
    city: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    role: 'DJ / Producer',
    icon: Headphones,
    color: '#a855f7',
    stats: { shows: 47, following: '2.1k', rating: 4.9 },
    tags: ['Techno', 'Dark Electro', 'Resident DJ'],
    available: true,
  },
  {
    name: 'LUNA CROSS',
    handle: '@lunacross',
    genre: 'Ambient / Experimental',
    city: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
    role: 'Artist / Vocalist',
    icon: Mic2,
    color: '#06b6d4',
    stats: { shows: 31, following: '1.4k', rating: 5.0 },
    tags: ['Ambient', 'Live Loops', 'Vocalist'],
    available: true,
  },
  {
    name: 'CAIRO BANKS',
    handle: '@cairobanks',
    genre: 'Hip-Hop / Trap',
    city: 'Atlanta, GA',
    image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&q=80',
    role: 'Rapper / Producer',
    icon: Music,
    color: '#f43f5e',
    stats: { shows: 89, following: '8.3k', rating: 4.8 },
    tags: ['Hip-Hop', 'Trap', 'Producer'],
    available: false,
  },
  {
    name: 'RAVI STORM',
    handle: '@ravistorm',
    genre: 'Jazz / Fusion',
    city: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    role: 'Drummer / Composer',
    icon: Drum,
    color: '#f59e0b',
    stats: { shows: 124, following: '3.7k', rating: 4.9 },
    tags: ['Jazz', 'Fusion', 'Live Drummer'],
    available: true,
  },
];

export default function FeaturedArtists() {
  return (
    <section id="artists" className="py-24 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-purple-600/10 top-0 right-0 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-purple-500" />
              <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
                Featured Artists
              </span>
            </div>
            <h2 className="display-md text-white">
              The Talent <br />
              <span className="gradient-text-purple">Shaping the Scene</span>
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            Browse all artists
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Artist grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {artists.map((artist) => {
            const Icon = artist.icon;
            return (
              <div key={artist.name} className="group card-hover cursor-pointer">
                <div className="glass rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Availability badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
                          artist.available
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {artist.available ? 'Available' : 'Booked'}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${artist.color}25`, border: `1px solid ${artist.color}40` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: artist.color }} />
                    </div>

                    {/* Name on image */}
                    <div className="absolute bottom-3 left-4">
                      <div className="text-white font-bold text-lg tracking-tight leading-none">
                        {artist.name}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{artist.handle}</div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-500 text-xs">{artist.city}</span>
                      <span className="text-slate-600 mx-1">·</span>
                      <span className="text-slate-500 text-xs">{artist.role}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {artist.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{artist.stats.shows} shows</span>
                        <span>{artist.stats.following} network</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-400">{artist.stats.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Artist CTA */}
        <div className="mt-12 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-pink-900/30" />
          <div className="absolute inset-0 border border-purple-500/20 rounded-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">
                Are you an artist? Your profile starts here.
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Build your professional profile, set your availability, connect with venues,
                and get booked for gigs that match your sound and vision.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#"
                className="relative flex items-center gap-2 font-semibold text-white px-8 py-4 rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
                <span className="relative">Create Artist Profile</span>
                <ChevronRight className="relative w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { MapPin, Users, Star, Calendar, ChevronRight, Building2 } from 'lucide-react';

const venues = [
  {
    name: 'The Blind Pig',
    city: 'Chicago, IL',
    type: 'Underground Club',
    capacity: 300,
    rating: 4.9,
    eventsThisMonth: 18,
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&q=80',
    tags: ['Techno', 'Electronic', 'Dark Atmosphere'],
    verified: true,
    color: '#a855f7',
    description: 'Chicago\'s premier underground techno venue. Known for its immersive sound system and dark industrial aesthetic.',
  },
  {
    name: 'Echoplex',
    city: 'Los Angeles, CA',
    type: 'Live Music Venue',
    capacity: 500,
    rating: 4.7,
    eventsThisMonth: 22,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    tags: ['Indie', 'Alternative', 'Hip-Hop'],
    verified: true,
    color: '#06b6d4',
    description: 'Historic East LA venue that\'s hosted everyone from emerging local acts to Grammy-winning artists.',
  },
  {
    name: 'Elsewhere Zone One',
    city: 'Brooklyn, NY',
    type: 'Multi-Room Club',
    capacity: 600,
    rating: 4.8,
    eventsThisMonth: 31,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    tags: ['House', 'Afrobeat', 'Experimental'],
    verified: true,
    color: '#f43f5e',
    description: 'Bushwick\'s crown jewel. Three floors of music, a rooftop, and a commitment to underground culture.',
  },
  {
    name: 'The Chapel',
    city: 'San Francisco, CA',
    type: 'Intimate Venue',
    capacity: 400,
    rating: 4.9,
    eventsThisMonth: 14,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    tags: ['Jazz', 'Folk', 'Ambient'],
    verified: false,
    color: '#f59e0b',
    description: 'A converted Victorian chapel turned concert hall. Exceptional acoustics and intimate atmosphere.',
  },
];

export default function FeaturedVenues() {
  return (
    <section id="venues" className="py-24 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-rose-600/10 top-0 left-0 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-rose-500" />
              <span className="text-rose-400 text-xs font-semibold tracking-widest uppercase">
                Featured Venues
              </span>
            </div>
            <h2 className="display-md text-white">
              The Rooms That <br />
              <span className="gradient-text-fire">Define the Night</span>
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            Explore venues
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Venue grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {venues.map((venue) => (
            <div key={venue.name} className="group card-hover cursor-pointer">
              <div className="glass rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
                <div className="flex">
                  {/* Image */}
                  <div className="relative w-40 flex-shrink-0">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-base">{venue.name}</h3>
                          {venue.verified && (
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                              style={{ backgroundColor: venue.color }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <MapPin className="w-3 h-3" />
                          {venue.city} · {venue.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-300 font-medium">{venue.rating}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                      {venue.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.06] text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {venue.capacity} cap
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {venue.eventsThisMonth} events/mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Venue CTA */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 to-amber-900/20" />
          <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-2xl mb-2">
                  Own a venue? Fill your calendar.
                </h3>
                <p className="text-slate-400 text-sm max-w-md">
                  List your venue, manage booking requests, connect with top-tier local talent,
                  and build a loyal community of artists and fans.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#"
                className="relative flex items-center gap-2 font-semibold text-white px-8 py-4 rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-amber-600 group-hover:from-amber-600 group-hover:to-rose-600 transition-all duration-500" />
                <span className="relative">List Your Venue</span>
                <ChevronRight className="relative w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

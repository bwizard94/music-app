'use client';

import { Users, Star, MapPin, ChevronRight, Music2, Zap } from 'lucide-react';
import type { VenueData } from './venueData';
import Link from 'next/link';

interface Props { venue: VenueData; }

export default function VenueArtists({ venue }: Props) {
  const color = venue.accentColor;

  const DISCOVERED_ARTISTS = [
    { name: 'LUX', role: 'DJ / Dark Electro', city: 'Chicago', shows: 18, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&q=80' },
    { name: 'MOANA SHIFT', role: 'Producer / DJ', city: 'Milwaukee', shows: 11, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    { name: 'ADAN BOOLEAN', role: 'Electronic Artist', city: 'Detroit', shows: 7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { name: 'STATIC FORMA', role: 'DJ / Noise', city: 'Chicago', shows: 14, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  ];

  return (
    <div className="space-y-5">
      {/* Residents */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
          <Zap className="w-4 h-4" style={{ color }} />
          <h3 className="text-white font-bold text-sm">Resident Artists</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {venue.residents.map((resident) => (
            <Link
              key={resident.name}
              href={`/profile/${resident.slug}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="relative w-14 h-14 flex-shrink-0">
                <img src={resident.image} alt={resident.name}
                  className="w-full h-full rounded-xl object-cover" />
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ boxShadow: `inset 0 0 0 2px ${color}` }}
                />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-base">{resident.name}</div>
                <div className="text-slate-500 text-xs">{resident.role}</div>
                <div className="text-slate-600 text-xs mt-0.5">Resident since {resident.since}</div>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs">
                <span className="hidden sm:block">View profile</span>
                <ChevronRight className="w-4 h-4 group-hover:text-slate-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Artists we've helped launch */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-bold text-sm">Artists We&apos;ve Launched</h3>
          </div>
          <span className="text-slate-500 text-xs">Started here, went global</span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DISCOVERED_ARTISTS.map((artist) => (
            <div
              key={artist.name}
              className="flex items-center gap-3 glass rounded-xl p-3 border border-white/[0.05] hover:border-white/[0.12] transition-colors group cursor-pointer"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <img src={artist.image} alt={artist.name}
                  className="w-full h-full rounded-lg object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{artist.name}</div>
                <div className="text-slate-500 text-xs truncate">{artist.role} · {artist.city}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white font-bold text-sm">{artist.shows}</div>
                <div className="text-slate-700 text-xs">shows</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notable international bookings */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
          <Star className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-bold text-sm">International Artists We&apos;ve Hosted</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {venue.notableBookings.map((a) => (
              <div
                key={a.name}
                className="glass rounded-xl p-3 text-center border border-white/[0.05] hover:border-white/[0.12] transition-all card-hover cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}22` }}
                >
                  <Users className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-white font-bold text-sm">{a.name}</div>
                <div className="flex items-center justify-center gap-1 text-slate-600 text-xs mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {a.origin}
                </div>
                <div className="text-slate-700 text-xs mt-1">{a.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open call for new artists */}
      <div
        className="rounded-2xl p-6 border relative overflow-hidden"
        style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl"
          style={{ backgroundColor: color, opacity: 0.08 }} />
        <div className="relative">
          <h3 className="text-white font-bold text-lg mb-2">
            Are you an artist or promoter?
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-lg">
            The Blind Pig actively seeks emerging local talent and independent promoters
            whose aesthetic aligns with our programming. Techno, industrial, dark electro,
            experimental — if that sounds like you, we want to hear it.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="relative font-semibold text-white px-6 py-3 rounded-xl overflow-hidden text-sm"
            >
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
              <span className="relative">Submit Your Demo</span>
            </button>
            <button className="glass rounded-xl px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors border border-white/[0.08]">
              View Open Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

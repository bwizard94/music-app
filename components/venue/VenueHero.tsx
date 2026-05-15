'use client';

import { useState } from 'react';
import {
  MapPin, Check, Star, Users, CalendarDays, Zap,
  Share2, Bookmark, MessageSquare, ExternalLink,
  Globe, Building2, ChevronRight,
} from 'lucide-react';
import type { VenueData } from './venueData';

interface Props {
  venue: VenueData;
  isOwner?: boolean;
  onBook: () => void;
}

export default function VenueHero({ venue, isOwner, onBook }: Props) {
  const [saved, setSaved] = useState(false);
  const color = venue.accentColor;

  return (
    <div className="relative">
      {/* ── Cinematic Banner ──────────────────────────────────────────── */}
      <div className="relative h-72 md:h-[480px] overflow-hidden">
        <img
          src={venue.banner}
          alt={venue.name}
          className="w-full h-full object-cover"
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/60 to-transparent" />
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 60%)` }}
        />

        {/* Scan-line texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
            backgroundSize: '100% 3px',
          }}
        />

        {/* Floating badges top-right */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
          {venue.verified && (
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/[0.1]">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Verified Venue</span>
            </div>
          )}
          <div className="glass rounded-full px-3 py-1.5 border border-white/[0.1]">
            <span className="text-slate-300 text-xs font-medium">{venue.type}</span>
          </div>
        </div>

        {/* Atmosphere tags — bottom left */}
        <div className="absolute bottom-8 left-6 flex flex-wrap gap-2 max-w-sm hidden md:flex">
          {venue.atmosphere.slice(0, 4).map((a) => (
            <span
              key={a}
              className="glass text-[11px] font-semibold px-2.5 py-1 rounded-full border"
              style={{ color: `${color}cc`, borderColor: `${color}30` }}
            >
              {a}
            </span>
          ))}
        </div>

        {/* Edit button for owner */}
        {isOwner && (
          <button className="absolute top-6 left-6 glass rounded-xl px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors">
            Edit Banner
          </button>
        )}
      </div>

      {/* ── Identity Section ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-16 md:-mt-20 mb-6 relative z-10">

          {/* Logo / Icon */}
          <div className="relative flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-[#060608] flex items-center justify-center"
              style={{ boxShadow: `0 0 0 2px ${color}50, 0 0 50px ${color}25` }}
            >
              <img
                src={venue.logo}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/30 to-transparent" />
            </div>
            {venue.pro && (
              <div className="absolute -top-2 -right-2 glass rounded-full px-2 py-0.5 border border-amber-500/30">
                <span className="text-amber-400 text-[10px] font-bold tracking-wider">PRO</span>
              </div>
            )}
          </div>

          {/* Name + info */}
          <div className="flex-1 pb-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1
                  className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none mb-1"
                  style={{ textShadow: `0 0 80px ${color}25` }}
                >
                  {venue.name}
                </h1>
                <p
                  className="font-semibold text-base mb-2"
                  style={{ color }}
                >
                  {venue.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    {venue.neighborhood} · {venue.city}, {venue.state}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-600" />
                    {venue.subtype}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    {venue.stats.capacity} cap
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-amber-400 font-semibold text-sm">{venue.stats.rating}</span>
                  <span className="text-slate-600 text-xs">({venue.stats.reviewCount} reviews from artists)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {!isOwner && (
                  <>
                    <button
                      onClick={onBook}
                      className="relative flex items-center gap-2 font-bold text-white px-6 py-3 rounded-xl overflow-hidden group text-sm"
                    >
                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                      />
                      <Zap className="relative w-4 h-4 fill-white" />
                      <span className="relative">Book This Venue</span>
                    </button>

                    <a
                      href="#"
                      className="flex items-center gap-2 glass rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Message</span>
                    </a>
                  </>
                )}
                <button
                  onClick={() => setSaved(!saved)}
                  className={`glass rounded-xl p-3 transition-colors hover:bg-white/10 ${saved ? '' : 'text-slate-400'}`}
                  style={saved ? { color } : undefined}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button className="glass rounded-xl p-3 text-slate-400 hover:text-white transition-colors hover:bg-white/10">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ─────────────────────────────────────────────── */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07] mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-white/[0.06]">
            {[
              { label: 'Capacity', value: venue.stats.capacity.toString() },
              { label: 'Shows / Month', value: venue.stats.eventsPerMonth.toString() },
              { label: 'Artists Hosted', value: `${venue.stats.artistsHosted}+` },
              { label: 'Avg Occupancy', value: venue.analytics.avgOccupancy },
              { label: 'Tickets Sold', value: `${(venue.stats.ticketsSold / 1000).toFixed(0)}K` },
              { label: 'Years Active', value: venue.stats.yearsActive.toString() },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 text-center">
                <div className="text-white font-bold text-xl tracking-tight">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick links ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Resident Advisor', icon: ExternalLink },
            { label: 'Instagram', icon: Globe },
            { label: 'Website', icon: Globe },
            { label: 'Mixcloud', icon: ExternalLink },
          ].map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <Icon className="w-3 h-3" />
              {label}
            </a>
          ))}

          {/* Open slots badge */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold border"
            style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ backgroundColor: color }} />
            {venue.openSlots.length} Open Slots This Month
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

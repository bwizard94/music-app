'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Check, Star, Users, CalendarDays, Eye,
  Share2, Bookmark, MessageSquare, Plus, ExternalLink,
  Music2, Globe, ExternalLink as ExtLink,
} from 'lucide-react';
import type { ArtistData } from './artistData';

function StatPill({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="text-center px-4">
      <div className="font-bold text-white text-xl md:text-2xl tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
    </div>
  );
}

interface Props {
  artist: ArtistData;
  isOwner?: boolean;
  onTabChange: (tab: string) => void;
}

export default function ProfileHero({ artist, isOwner, onTabChange }: Props) {
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const color = artist.accentColor;

  return (
    <div className="relative">
      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={artist.banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/40 to-transparent" />

        {/* Cinematic tint */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `linear-gradient(135deg, ${color}30, transparent 60%)` }}
        />

        {/* Floating genre tags */}
        <div className="absolute top-6 right-6 flex gap-2 flex-wrap justify-end">
          {artist.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="glass text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ color, borderColor: `${color}40` }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Owner edit button */}
        {isOwner && (
          <Link
            href="/profile/settings"
            className="absolute top-6 left-6 flex items-center gap-2 glass rounded-xl px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Edit Profile
          </Link>
        )}
      </div>

      {/* ── Identity row ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-20 mb-6 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-[#060608]"
              style={{ boxShadow: `0 0 0 2px ${color}60, 0 0 40px ${color}30` }}
            >
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Verified badge */}
            {artist.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center border-2 border-[#060608]"
                style={{ backgroundColor: color }}
                title="Verified Artist"
              >
                <Check className="w-3.5 h-3.5 text-white font-bold" />
              </div>
            )}

            {/* Pro badge */}
            {artist.pro && (
              <div className="absolute -top-2 -right-2 glass rounded-full px-2 py-0.5 border border-amber-500/30">
                <span className="text-amber-400 text-[10px] font-bold tracking-wider">PRO</span>
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1
                  className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none mb-1"
                  style={{ textShadow: `0 0 60px ${color}30` }}
                >
                  {artist.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
                  <span
                    className="font-semibold"
                    style={{ color }}
                  >
                    {artist.role}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    {artist.city}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-500 text-xs">Since {artist.memberSince}</span>
                </div>
                {/* Rating row */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-amber-400 font-semibold text-sm">{artist.stats.rating}</span>
                  <span className="text-slate-600 text-xs">({artist.stats.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {!isOwner && (
                  <>
                    <button
                      onClick={() => setFollowing(!following)}
                      className="relative flex items-center gap-2 font-semibold text-sm text-white px-5 py-2.5 rounded-xl overflow-hidden group"
                    >
                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                          background: following
                            ? 'rgba(255,255,255,0.06)'
                            : `linear-gradient(135deg, ${color}, ${color}99)`,
                        }}
                      />
                      {following ? (
                        <>
                          <Check className="relative w-3.5 h-3.5" />
                          <span className="relative">Following</span>
                        </>
                      ) : (
                        <>
                          <Plus className="relative w-3.5 h-3.5" />
                          <span className="relative">Follow</span>
                        </>
                      )}
                    </button>

                    <a
                      href="/messages"
                      className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Message</span>
                    </a>

                    <a
                      href="/proposals/new"
                      className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
                      style={{ color }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Collaborate</span>
                    </a>
                  </>
                )}

                <button
                  onClick={() => setSaved(!saved)}
                  className={`glass rounded-xl p-2.5 transition-colors hover:bg-white/10 ${saved ? '' : 'text-slate-400'}`}
                  style={saved ? { color } : undefined}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <button className="glass rounded-xl p-2.5 text-slate-400 hover:text-white transition-colors hover:bg-white/10">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────────────────────── */}
        <div className="glass rounded-2xl flex flex-wrap justify-around divide-x divide-white/[0.06] mb-6 overflow-hidden border border-white/[0.07]">
          <StatPill value={artist.stats.followers.toLocaleString()} label="Followers" color={color} />
          <StatPill value={artist.stats.following} label="Following" color={color} />
          <StatPill value={artist.stats.shows} label="Shows Played" color={color} />
          <StatPill value={artist.stats.connections} label="Connections" color={color} />
          <div className="text-center px-4 py-4 hidden sm:block">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-xl tracking-tight">{artist.stats.rating}</span>
            </div>
            <div className="text-slate-500 text-xs mt-0.5">Rating</div>
          </div>
          <div className="text-center px-4 py-4 hidden md:block">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-white text-xl tracking-tight">
                {(artist.stats.profileViews / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="text-slate-500 text-xs mt-0.5">Profile Views</div>
          </div>
        </div>

        {/* ── Quick social links ─────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {artist.socialLinks?.soundcloud && (
            <a
              href={`https://${artist.socialLinks.soundcloud}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <Music2 className="w-3 h-3" />
              SoundCloud
            </a>
          )}
          {artist.socialLinks?.mixcloud && (
            <a
              href={`https://${artist.socialLinks.mixcloud}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <Globe className="w-3 h-3" />
              Mixcloud
            </a>
          )}
          {artist.socialLinks?.instagram && (
            <a
              href={`https://instagram.com/${artist.socialLinks.instagram.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <Globe className="w-3 h-3" />
              Instagram
            </a>
          )}
          {artist.socialLinks?.spotify && (
            <a
              href={`https://${artist.socialLinks.spotify}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <Music2 className="w-3 h-3" />
              Spotify
            </a>
          )}
          {artist.socialLinks?.residentAdvisor && (
            <a
              href={`https://${artist.socialLinks.residentAdvisor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all"
            >
              <ExtLink className="w-3 h-3" />
              Resident Advisor
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

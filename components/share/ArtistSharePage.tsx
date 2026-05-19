'use client'

import Link from 'next/link'
import { Zap, MapPin, CheckCircle2, Star, ArrowRight, Music2, Headphones, Radio, Users } from 'lucide-react'
import ShareBar from './ShareBar'
import type { ArtistData } from '@/components/profile/artistData'

interface Props {
  artist: ArtistData
}

const ROLE_COLORS: Record<string, string> = {
  headliner: '#f43f5e',
  support: '#a855f7',
  opener: '#06b6d4',
  b2b: '#f59e0b',
  'live-act': '#10b981',
  'visual-artist': '#ec4899',
}

export default function ArtistSharePage({ artist }: Props) {
  const color = artist.accentColor
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://stagefront.io/share/artist/${artist.slug}`

  const bioParas = artist.bio.split('\n\n').filter(Boolean)

  return (
    <div style={{ background: '#060608', minHeight: '100vh', color: '#f1f5f9' }}>
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">STAGEFRONT</span>
        </Link>
        <ShareBar url={shareUrl} title={`${artist.name} on Stagefront`} accentColor={color} />
        <Link
          href="/signup"
          className="ml-3 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
        >
          Join Free
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div className="relative h-[60vh] min-h-[400px] pt-14">
        {/* cover image */}
        <img
          src={artist.banner}
          alt={artist.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* gradient overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, #060608 0%, rgba(6,6,8,0.6) 50%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}20, transparent 60%)`,
          }}
        />

        {/* genre tags top-right */}
        <div
          className="absolute top-20 right-4 sm:right-6 flex flex-col gap-2 items-end"
          style={{ zIndex: 10 }}
        >
          {artist.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="glass px-3 py-1 rounded-full text-xs font-bold"
              style={{ color, borderColor: `${color}40` }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* bottom-left artist info */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-4xl mx-auto flex items-end gap-5">
            <img
              src={artist.avatar}
              alt={artist.name}
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                objectFit: 'cover',
                border: `2px solid ${color}`,
                flexShrink: 0,
              }}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                {artist.verified && (
                  <CheckCircle2 style={{ width: 16, height: 16, color }} />
                )}
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                  {artist.pro ? 'Pro Member' : 'Member'}
                </span>
              </div>
              <h1
                className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-1"
              >
                {artist.name}
              </h1>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span>{artist.role}</span>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1">
                  <MapPin style={{ width: 12, height: 12 }} />
                  <span>{artist.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-1 mb-10">
        <div
          className="glass rounded-2xl border border-white/[0.06]"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {[
            { label: 'Monthly Listeners', value: artist.stats.followers.toLocaleString(), icon: <Headphones style={{ width: 14, height: 14 }} /> },
            { label: 'Shows', value: artist.stats.shows.toLocaleString(), icon: <Music2 style={{ width: 14, height: 14 }} /> },
            { label: 'Avg Rating', value: `${artist.stats.rating}/5`, icon: <Star style={{ width: 14, height: 14 }} /> },
            { label: 'Connections', value: artist.stats.connections.toLocaleString(), icon: <Users style={{ width: 14, height: 14 }} /> },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-2" style={{ color }}>
                {stat.icon}
                <span className="text-xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content columns ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: bio + genres + social */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">About</h2>
              <div className="space-y-4">
                {bioParas.map((para, i) => (
                  <p key={i} className="text-slate-300 leading-relaxed text-[15px]">{para}</p>
                ))}
              </div>
            </section>

            {/* Genres */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}30`,
                      color,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </section>

            {/* Social links */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Find Online</h2>
              <div className="flex flex-wrap gap-3">
                {artist.socialLinks.soundcloud && (
                  <a
                    href={`https://${artist.socialLinks.soundcloud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <Radio style={{ width: 14, height: 14 }} />
                    SoundCloud
                  </a>
                )}
                {artist.socialLinks.residentAdvisor && (
                  <a
                    href={`https://${artist.socialLinks.residentAdvisor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <Music2 style={{ width: 14, height: 14 }} />
                    Resident Advisor
                  </a>
                )}
                {artist.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <Users style={{ width: 14, height: 14 }} />
                    Instagram
                  </a>
                )}
                {artist.socialLinks.spotify && (
                  <a
                    href={`https://${artist.socialLinks.spotify}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <Headphones style={{ width: 14, height: 14 }} />
                    Spotify
                  </a>
                )}
              </div>
            </section>

            {/* Inline booking CTA */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${color}12, transparent)`,
                border: `1px solid ${color}25`,
              }}
            >
              <p className="text-white font-bold text-base mb-1">
                Want to book {artist.name} for your event?
              </p>
              <p className="text-slate-400 text-sm mb-4">
                Create a show proposal on Stagefront and connect directly with artists like {artist.name}.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
              >
                Create a Proposal
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>

          {/* Right: quick stats card */}
          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/[0.06] p-5 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Stats</h2>

              {/* Social Score bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Social Score</span>
                  <span className="text-xs font-bold" style={{ color }}>{artist.stats.profileViews.toLocaleString()} views</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: '84%',
                      background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                    }}
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-2">
                {artist.verified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 style={{ width: 14, height: 14, color }} />
                    <span className="text-xs text-slate-300 font-medium">Verified Artist</span>
                  </div>
                )}
                {artist.pro && (
                  <div className="flex items-center gap-2">
                    <Zap style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />
                    <span className="text-xs text-slate-300 font-medium">Pro Member</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    style={{
                      width: 14,
                      height: 14,
                      color: s <= Math.round(artist.stats.rating) ? '#f59e0b' : '#334155',
                      fill: s <= Math.round(artist.stats.rating) ? '#f59e0b' : 'none',
                    }}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">
                  {artist.stats.rating} · {artist.stats.reviewCount} reviews
                </span>
              </div>

              {/* Member since */}
              <div className="pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-600">Member since {artist.memberSince}</p>
              </div>
            </div>

            {/* Collaboration badges */}
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Collaborations</h2>
              <div className="space-y-2">
                {artist.collaborationBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{badge.label}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${badge.color}20`, color: badge.color }}
                    >
                      {badge.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #a855f720, #7c3aed15)' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            The professional network for music culture
          </h2>
          <p className="text-slate-400 mb-8">
            Connect with artists, venues, and promoters. Build your scene. Book your shows.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            Join Stagefront Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-slate-600 text-xs mt-4">Free forever · No credit card</p>
        </div>
      </section>
    </div>
  )
}

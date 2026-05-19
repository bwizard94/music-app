'use client'

import Link from 'next/link'
import { Zap, MapPin, CheckCircle2, Star, ArrowRight, Music2, Users, Volume2, Layers } from 'lucide-react'
import ShareBar from './ShareBar'
import type { VenueData } from '@/components/venue/venueData'

interface Props {
  venue: VenueData
}

export default function VenueSharePage({ venue }: Props) {
  const color = venue.accentColor
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://stagefront.io/share/venue/${venue.slug}`

  const descParas = venue.description.split('\n\n').filter(Boolean)

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
        <ShareBar url={shareUrl} title={`${venue.name} on Stagefront`} accentColor={color} />
        <Link
          href="/signup"
          className="ml-3 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
        >
          Join Free
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div className="relative h-[50vh] min-h-[360px] pt-14">
        <img
          src={venue.banner}
          alt={venue.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #060608 0%, rgba(6,6,8,0.55) 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}18, transparent 60%)`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              {venue.verified && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
                >
                  <CheckCircle2 style={{ width: 12, height: 12 }} />
                  Verified Venue
                </div>
              )}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold glass"
              >
                <Star style={{ width: 12, height: 12, color: '#f59e0b', fill: '#f59e0b' }} />
                <span className="text-white">{venue.stats.rating}</span>
                <span className="text-slate-400">({venue.stats.reviewCount})</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-2">
              {venue.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <span className="font-medium" style={{ color }}>{venue.type}</span>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1">
                <MapPin style={{ width: 12, height: 12 }} />
                <span>{venue.city}, {venue.state} · {venue.neighborhood}</span>
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
            { label: 'Capacity', value: venue.stats.capacity.toString(), icon: <Users style={{ width: 14, height: 14 }} /> },
            { label: 'Events / Month', value: venue.stats.eventsPerMonth.toString(), icon: <Music2 style={{ width: 14, height: 14 }} /> },
            { label: 'Artists Hosted', value: `${(venue.stats.artistsHosted / 1000).toFixed(1)}k`, icon: <Layers style={{ width: 14, height: 14 }} /> },
            { label: 'Avg Rating', value: `${venue.stats.rating}/5`, icon: <Star style={{ width: 14, height: 14 }} /> },
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

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 space-y-10">
        {/* Description */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">About</h2>
          <div className="space-y-4">
            {descParas.slice(0, 2).map((para, i) => (
              <p key={i} className="text-slate-300 leading-relaxed text-[15px]">{para}</p>
            ))}
          </div>
        </section>

        {/* Atmosphere */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Atmosphere</h2>
          <div className="flex flex-wrap gap-2">
            {venue.atmosphere.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Sound system + specs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sound system card */}
          <div className="glass rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 style={{ width: 16, height: 16, color }} />
              <h2 className="text-sm font-bold text-white">Sound System</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'System', value: venue.specs.sound.system },
                { label: 'Subwoofers', value: venue.specs.sound.subwoofers },
                { label: 'Monitors', value: venue.specs.sound.monitors },
                { label: 'Mixer', value: venue.specs.sound.mixer },
                { label: 'DJ Booth', value: venue.specs.sound.djBooth },
                { label: 'Backline', value: venue.specs.sound.backline },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500 shrink-0">{label}</span>
                  <span className="text-xs text-slate-200 text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs grid */}
          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Main Room</h3>
              <div className="space-y-2">
                {[
                  { label: 'Capacity', value: `${venue.specs.mainRoom.capacity} guests` },
                  { label: 'Stage', value: venue.specs.mainRoom.stageDimensions },
                  { label: 'Dance Floor', value: venue.specs.mainRoom.danceFloor },
                  { label: 'Ceiling', value: venue.specs.mainRoom.ceilingHeight },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl border border-white/[0.06] p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Basement</h3>
              <div className="space-y-2">
                {[
                  { label: 'Capacity', value: `${venue.specs.basement.capacity} guests` },
                  { label: 'Stage', value: venue.specs.basement.stageDimensions },
                  { label: 'Dance Floor', value: venue.specs.basement.danceFloor },
                  { label: 'Ceiling', value: venue.specs.basement.ceilingHeight },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Residents */}
        {venue.residents.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Residents</h2>
            <div className="flex flex-wrap gap-4">
              {venue.residents.map((r) => (
                <Link
                  key={r.slug}
                  href={`/share/artist/${r.slug}`}
                  className="glass flex items-center gap-3 px-4 py-3 rounded-xl hover:border-white/20 transition-colors"
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.role} · Since {r.since}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Inline proposal CTA */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg, ${color}12, transparent)`,
            border: `1px solid ${color}25`,
          }}
        >
          <p className="text-white font-bold text-base mb-1">
            Submit a show proposal to {venue.name}
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Join Stagefront and pitch directly to venues like {venue.name}. Build your lineup. Make it happen.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            Submit a Proposal
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
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

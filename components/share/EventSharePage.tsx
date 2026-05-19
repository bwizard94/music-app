'use client'

import Link from 'next/link'
import { Zap, MapPin, Clock, ArrowRight, Users, DollarSign } from 'lucide-react'
import ShareBar from './ShareBar'
import type { EventBuild, LineupSlot } from '@/lib/types'
import { estimateTurnout } from '@/lib/utils'

interface Props {
  event: EventBuild
}

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  headliner: { label: 'Headliner', color: '#f43f5e' },
  support: { label: 'Support', color: '#a855f7' },
  opener: { label: 'Opener', color: '#06b6d4' },
  b2b: { label: 'B2B', color: '#f59e0b' },
  'live-act': { label: 'Live Act', color: '#10b981' },
  'visual-artist': { label: 'Visual', color: '#ec4899' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#64748b' },
  pitching: { label: 'Pitching', color: '#06b6d4' },
  confirmed: { label: 'Confirmed', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#f43f5e' },
  completed: { label: 'Completed', color: '#64748b' },
}

export default function EventSharePage({ event }: Props) {
  const color = event.accentColor
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://stagefront.io/share/event/${event.id}`

  const turnout = estimateTurnout(event.lineup, event.venueCapacity)
  const headliner = event.lineup.find((s) => s.role === 'headliner')
  const statusConfig = STATUS_CONFIG[event.status] ?? { label: event.status, color: '#64748b' }

  // Sort lineup: opener → support → b2b → headliner
  const roleOrder = ['opener', 'support', 'b2b', 'live-act', 'visual-artist', 'headliner']
  const sortedLineup = [...event.lineup].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  )

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
        <ShareBar url={shareUrl} title={`${event.name} — ${event.venue}`} accentColor={color} />
        <Link
          href="/signup"
          className="ml-3 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
        >
          Join Free
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div className="relative h-[55vh] min-h-[400px] pt-14">
        <img
          src={event.coverImage}
          alt={event.name}
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
            background: 'linear-gradient(to top, #060608 0%, rgba(6,6,8,0.65) 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}25, transparent 60%)`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* status badge */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: `${statusConfig.color}20`, color: statusConfig.color, border: `1px solid ${statusConfig.color}30` }}
              >
                {statusConfig.label}
              </span>
              <span
                className="glass px-3 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <Clock style={{ width: 11, height: 11 }} />
                {event.date}
              </span>
              <span
                className="glass px-3 py-1 rounded-full text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <MapPin style={{ width: 11, height: 11 }} />
                {event.venue}
              </span>
            </div>

            <h1
              className="text-5xl sm:text-7xl font-black leading-none tracking-tighter mb-2"
              style={{
                background: `linear-gradient(135deg, #fff 40%, ${color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {event.name}
            </h1>
            <p className="text-slate-300 text-lg font-medium">{event.tagline}</p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* Lineup section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">The Lineup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLineup.map((slot) => {
              const isHeadliner = slot.role === 'headliner'
              const rc = ROLE_CONFIG[slot.role] ?? { label: slot.role, color: '#94a3b8' }

              return (
                <div
                  key={slot.id}
                  className="glass rounded-2xl overflow-hidden"
                  style={isHeadliner
                    ? { border: `1px solid ${color}50`, gridColumn: 'span 1' }
                    : { border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {/* Artist photo */}
                  <div
                    className="relative"
                    style={{ height: isHeadliner ? 200 : 160 }}
                  >
                    <img
                      src={slot.artist.image}
                      alt={slot.artist.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to top, rgba(6,6,8,0.9) 0%, transparent 60%)`,
                      }}
                    />
                    {isHeadliner && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(135deg, ${color}20, transparent)`,
                        }}
                      />
                    )}
                    {/* Role badge */}
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: `${rc.color}25`, color: rc.color, border: `1px solid ${rc.color}40` }}
                    >
                      {rc.label}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-black text-white text-base mb-1">{slot.artist.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">{slot.artist.role}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock style={{ width: 11, height: 11 }} />
                        <span>{slot.startTime}</span>
                        <span className="text-slate-700">·</span>
                        <span>{slot.duration}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users style={{ width: 11, height: 11 }} />
                        <span>~{slot.artist.draw}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Event details grid */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">Event Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Doors', value: event.doorsTime },
              { label: 'End Time', value: event.endTime },
              { label: 'Tickets', value: event.ticketPrice },
              { label: 'Est. Attendance', value: `${turnout.mid}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="glass rounded-xl p-4 text-center border border-white/[0.06]"
              >
                <p className="text-lg font-black text-white mb-1">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Venue fill bar */}
          <div className="glass rounded-xl p-5 mt-4 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users style={{ width: 14, height: 14, color }} />
                <span className="text-sm font-bold text-white">Projected Fill</span>
              </div>
              <span className="text-sm font-bold" style={{ color }}>
                {turnout.pct}% · {event.venueCapacity} cap
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, turnout.pct)}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Low {turnout.low} · Mid {turnout.mid} · High {turnout.high} est.
            </p>
          </div>
        </section>

        {/* Genres */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {event.genres.map((g) => (
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

        {/* Revenue snapshot */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${color}10, transparent)`,
            border: `1px solid ${color}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <DollarSign style={{ width: 18, height: 18, color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Estimated Revenue</p>
              <p className="text-xs text-slate-500">Before artist fees and production</p>
            </div>
          </div>
          <p className="text-xl font-black" style={{ color }}>{event.estimatedRevenue}</p>
        </div>

        {/* Inline CTA */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: `linear-gradient(135deg, #a855f712, #7c3aed08)`,
            border: '1px solid rgba(168,85,247,0.15)',
          }}
        >
          <p className="text-white font-bold text-base mb-1">Build your own event on Stagefront</p>
          <p className="text-slate-400 text-sm mb-4">
            Use the Show Builder to create lineups, pitch venues, and manage your events — all in one place.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            Start Building
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

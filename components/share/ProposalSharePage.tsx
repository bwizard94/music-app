'use client'

import Link from 'next/link'
import { Zap, MapPin, Clock, ArrowRight, Users, Lock, DollarSign, Calendar } from 'lucide-react'
import ShareBar from './ShareBar'
import type { ShowProposal } from '@/lib/data/proposals'
import { PROPOSAL_STATUS_CONFIG } from '@/lib/data/proposals'

interface Props {
  proposal: ShowProposal
}

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  headliner: { label: 'Headliner', color: '#f43f5e' },
  support: { label: 'Support', color: '#a855f7' },
  opener: { label: 'Opener', color: '#06b6d4' },
  b2b: { label: 'B2B', color: '#f59e0b' },
  'live-act': { label: 'Live Act', color: '#10b981' },
  'visual-artist': { label: 'Visual', color: '#ec4899' },
}

export default function ProposalSharePage({ proposal }: Props) {
  const color = proposal.accentColor
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://stagefront.io/share/proposal/${proposal.id}`

  const statusConfig = PROPOSAL_STATUS_CONFIG[proposal.status]

  // Sort lineup by role
  const roleOrder = ['opener', 'support', 'b2b', 'live-act', 'visual-artist', 'headliner']
  const sortedLineup = [...proposal.lineup].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  )

  const totalBudget = proposal.totalArtistFees + proposal.productionBudget + proposal.marketingBudget
  const ticketPriceNum = parseInt(proposal.ticketPrice.replace(/[^0-9]/g, ''), 10) || 15
  const revenueEstimate = proposal.estimatedDraw * ticketPriceNum

  const proposedDateFormatted = new Date(proposal.proposedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
        <ShareBar url={shareUrl} title={`${proposal.name} — Show Proposal`} accentColor={color} />
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
          src={proposal.coverImage}
          alt={proposal.name}
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
            background: `linear-gradient(135deg, ${color}22, transparent 60%)`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* label row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Show Proposal
              </span>
              <span className="text-slate-600">·</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${statusConfig.color}20`,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.color}30`,
                }}
              >
                {statusConfig.label}
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
              {proposal.name}
            </h1>
            <p className="text-slate-300 text-lg font-medium mb-4">{proposal.tagline}</p>

            {/* Submitted by */}
            <div className="flex items-center gap-3">
              <img
                src={proposal.submittedByImage}
                alt={proposal.submittedByName}
                style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }}
              />
              <span className="text-sm text-slate-400">
                A show proposal by{' '}
                <span className="text-white font-bold">{proposal.submittedByName}</span>
                {' '}·{' '}{proposal.submittedByRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* Concept section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">The Concept</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Event type */}
            <div className="glass rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-slate-500 mb-1">Event Type</p>
              <p className="text-sm font-bold text-white capitalize">{proposal.eventType.replace('-', ' ')}</p>
            </div>

            {/* Proposed date */}
            <div className="glass rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-slate-500 mb-1">Proposed Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar style={{ width: 13, height: 13, color }} />
                <p className="text-sm font-bold text-white">{proposedDateFormatted}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="glass rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-slate-500 mb-1">Venue</p>
              <div className="flex items-center gap-1.5">
                <MapPin style={{ width: 13, height: 13, color }} />
                <p className="text-sm font-bold text-white">{proposal.venueName}, {proposal.venueCity}</p>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="mt-4 flex flex-wrap gap-2">
            {proposal.genres.map((g) => (
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

        {/* Doors + End time */}
        <div className="flex gap-4">
          {[
            { label: 'Doors', value: proposal.doorsTime },
            { label: 'End Time', value: proposal.endTime },
            { label: 'Capacity', value: `${proposal.venueCapacity}` },
            { label: 'Est. Draw', value: `~${proposal.estimatedDraw}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 glass rounded-xl p-4 text-center border border-white/[0.06]"
            >
              <p className="text-lg font-black text-white mb-0.5">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Lineup section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">Lineup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLineup.map((artist) => {
              const isHeadliner = artist.role === 'headliner'
              const rc = ROLE_CONFIG[artist.role] ?? { label: artist.role, color: '#94a3b8' }

              return (
                <div
                  key={artist.artistId}
                  className="glass rounded-2xl overflow-hidden"
                  style={{ border: isHeadliner ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="relative" style={{ height: isHeadliner ? 180 : 140 }}>
                    <img
                      src={artist.image}
                      alt={artist.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(6,6,8,0.9) 0%, transparent 60%)',
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
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: `${rc.color}25`, color: rc.color, border: `1px solid ${rc.color}40` }}
                    >
                      {rc.label}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-white text-base mb-0.5">{artist.name}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock style={{ width: 11, height: 11 }} />
                        <span>{artist.startTime} · {artist.duration}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users style={{ width: 11, height: 11 }} />
                        <span>~{artist.draw}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Budget snapshot — blurred/preview feel */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">Budget Preview</h2>
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign style={{ width: 14, height: 14, color }} />
                  <span className="text-sm font-bold text-white">Total Budget</span>
                </div>
                <span className="text-lg font-black" style={{ color }}>
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Ticket Price</span>
                <span className="text-sm font-bold text-white">{proposal.ticketPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Revenue Estimate</span>
                <span className="text-sm font-bold text-white">~${revenueEstimate.toLocaleString()}</span>
              </div>

              {/* blurred financials row */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ filter: 'blur(4px)', userSelect: 'none' }}
              >
                <div className="p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Revenue Split</span>
                    <span className="text-xs text-slate-200">{proposal.revenueSplit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Artist Fees</span>
                    <span className="text-xs text-slate-200">${proposal.totalArtistFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Lock style={{ width: 12, height: 12, color: '#64748b' }} />
                <p className="text-xs text-slate-600">Full financials visible to venue only</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promo channels */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Promo Channels</h2>
          <div className="flex flex-wrap gap-2">
            {proposal.promoChannels.map((ch) => (
              <span
                key={ch}
                className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 border border-white/[0.06]"
              >
                {ch}
              </span>
            ))}
          </div>
        </section>

        {/* Inline submit CTA */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${color}12, transparent)`,
            border: `1px solid ${color}25`,
          }}
        >
          <p className="text-white font-bold text-base mb-1">
            This proposal was built on Stagefront
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Create your own show proposal, build a killer lineup, and pitch directly to venues.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            Create Yours Free
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

'use client';

import { use, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import {
  Zap,
  ChevronRight,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Globe,
  ExternalLink,
} from 'lucide-react';
import {
  MOCK_PROPOSALS,
  PROPOSAL_STATUS_CONFIG,
  type ProposalStatus,
  type ShowProposal,
} from '@/lib/data/proposals';
import { updateProposalStatus } from '@/lib/services/proposals';

// ─── Types ────────────────────────────────────────────────────────────────────

type VenueAction = 'idle' | 'accepted' | 'rejected' | 'changes-requested';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function daysAgo(iso: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

function initialVenueAction(proposal: ShowProposal): VenueAction {
  if (proposal.status === 'accepted') return 'accepted';
  if (proposal.status === 'rejected') return 'rejected';
  if (proposal.status === 'changes-requested') return 'changes-requested';
  return 'idle';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProposalStatus }) {
  const cfg = PROPOSAL_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider"
      style={{ background: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
      {children}
    </h2>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProposalReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const proposal = MOCK_PROPOSALS.find((p) => p.id === id);

  const [venueAction, setVenueAction] = useState<VenueAction>(
    proposal ? initialVenueAction(proposal) : 'idle'
  );
  const [changeNotes, setChangeNotes] = useState(
    proposal?.changeRequests?.join('\n') ?? ''
  );
  const [declineReason, setDeclineReason] = useState(proposal?.venueNote ?? '');
  const [expandChanges, setExpandChanges] = useState(false);
  const [expandDecline, setExpandDecline] = useState(false);
  const { toast } = useToast();

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Proposal not found.</p>
          <Link
            href="/venue/proposals"
            className="text-purple-400 text-sm underline"
          >
            Back to inbox
          </Link>
        </div>
      </div>
    );
  }

  const totalBudget =
    proposal.totalArtistFees + proposal.productionBudget + proposal.marketingBudget;
  const fillPct = Math.min(100, (proposal.estimatedDraw / proposal.venueCapacity) * 100);
  const headliner = proposal.lineup.find((l) => l.role === 'headliner');
  const submittedAgo = proposal.submittedAt ? daysAgo(proposal.submittedAt) : '—';

  const confidenceColors: Record<string, string> = {
    low: '#f43f5e',
    medium: '#f59e0b',
    high: '#10b981',
  };

  function handleAccept() {
    setVenueAction('accepted');
    setExpandChanges(false);
    setExpandDecline(false);
    toast({ type: 'success', title: 'Proposal accepted', message: 'The artist has been notified. Build your event workspace.' });
    updateProposalStatus(id, 'accepted', { venue_response: 'Proposal accepted.' }).catch(() => {});
  }

  function handleSendChanges() {
    if (!changeNotes.trim()) return;
    setVenueAction('changes-requested');
    setExpandChanges(false);
    toast({ type: 'warning', title: 'Changes requested', message: 'The artist will be notified to revise their proposal.' });
    updateProposalStatus(id, 'changes-requested', {
      change_requests: changeNotes.split('\n').filter(Boolean),
    }).catch(() => {});
  }

  function handleDecline() {
    setVenueAction('rejected');
    setExpandDecline(false);
    toast({ type: 'error', title: 'Proposal declined', message: 'The artist has been notified.' });
    updateProposalStatus(id, 'rejected', { venue_note: declineReason }).catch(() => {});
  }

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Sticky top nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-6 gap-2">
        <Link href="/" className="flex items-center gap-1.5 mr-1">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="font-black text-sm gradient-text-purple">STAGEFRONT</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Venue Dashboard</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <Link
          href="/venue/proposals"
          className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block"
        >
          Proposal Inbox
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700 hidden sm:block" />
        <span className="text-slate-300 text-sm font-semibold truncate max-w-[160px]">
          {proposal.name}
        </span>
      </nav>

      <main className="pt-14">
        {/* Hero section */}
        <div
          className="relative pt-12 pb-10 px-6"
          style={{
            background: `linear-gradient(180deg, ${proposal.accentColor}25 0%, ${proposal.accentColor}08 60%, transparent 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <StatusBadge status={proposal.status} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
                  {proposal.name}
                </h1>
                {proposal.tagline && (
                  <p className="text-slate-400 text-lg">{proposal.tagline}</p>
                )}
              </div>
            </div>

            {/* Submitted by */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={proposal.submittedByImage}
                alt={proposal.submittedByName}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <div className="text-sm font-bold text-white">
                  {proposal.submittedByName}
                </div>
                <div className="text-xs text-slate-500">
                  {proposal.submittedByRole} · Submitted {submittedAgo}
                </div>
              </div>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  Icon: MapPin,
                  text: `${proposal.venueName} · ${proposal.venueCity}`,
                },
                {
                  Icon: Clock,
                  text: formatDate(proposal.proposedDate),
                },
                {
                  Icon: Users,
                  text: `${proposal.lineup.length} artists`,
                },
                {
                  Icon: Users,
                  text: `Est. draw ${proposal.estimatedDraw}`,
                },
              ].map(({ Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/[0.08] bg-white/[0.04]"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: detail sections (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Event Concept */}
              <section className="glass rounded-2xl p-6">
                <SectionHeading>Event Concept</SectionHeading>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0">Type</span>
                    <span className="text-white capitalize">{proposal.eventType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0">Genres</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proposal.genres.map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: `${proposal.accentColor}15`,
                            color: proposal.accentColor,
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  {proposal.dateNotes && (
                    <div className="flex gap-4">
                      <span className="text-slate-500 w-24 shrink-0">Notes</span>
                      <span className="text-slate-300">{proposal.dateNotes}</span>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 shrink-0">Doors</span>
                    <span className="text-white">
                      {proposal.doorsTime} – {proposal.endTime}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. Lineup */}
              <section className="glass rounded-2xl p-6">
                <SectionHeading>Proposed Lineup</SectionHeading>
                <div className="space-y-3 mb-5">
                  {proposal.lineup.map((artist) => (
                    <div
                      key={artist.artistId}
                      className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                      <div
                        className="w-1 h-12 rounded-full shrink-0"
                        style={{ background: artist.accentColor }}
                      />
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-black text-white">{artist.name}</span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize"
                            style={{
                              background: `${artist.accentColor}20`,
                              color: artist.accentColor,
                            }}
                          >
                            {artist.role}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {artist.genres.slice(0, 2).map((g) => (
                            <span key={g} className="text-[10px] text-slate-500">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-white">
                          ${artist.fee.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ~{artist.draw} draw
                        </div>
                      </div>
                      <Link
                        href={`/profile/${artist.artistId}`}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Total Lineup Fee</div>
                    <div className="text-lg font-black text-white">
                      ${proposal.totalArtistFees.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Est. Turnout Range</div>
                    <div className="text-lg font-black text-white">
                      {Math.round(proposal.estimatedDraw * 0.7)}–
                      {Math.round(proposal.estimatedDraw * 1.15)}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Crew */}
              {proposal.collaborators.length > 0 && (
                <section className="glass rounded-2xl p-6">
                  <SectionHeading>Crew &amp; Collaborators</SectionHeading>
                  <div className="flex flex-wrap gap-2">
                    {proposal.collaborators.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]"
                      >
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: 'rgba(168,85,247,0.12)',
                            color: '#c084fc',
                          }}
                        >
                          {c.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 4. Estimated Draw */}
              <section className="glass rounded-2xl p-6">
                <SectionHeading>Estimated Draw</SectionHeading>
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-5xl font-black"
                    style={{ color: proposal.accentColor }}
                  >
                    {proposal.estimatedDraw}
                  </span>
                  <span className="text-slate-400 text-sm">
                    attendees · {proposal.venueCapacity} cap venue
                  </span>
                  <span
                    className="ml-auto text-xs font-bold px-3 py-1 rounded-lg capitalize"
                    style={{
                      background: `${confidenceColors[proposal.drawConfidence]}20`,
                      color: confidenceColors[proposal.drawConfidence],
                    }}
                  >
                    {proposal.drawConfidence} confidence
                  </span>
                </div>
                <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fillPct}%`,
                      background: `linear-gradient(90deg, ${proposal.accentColor}, ${proposal.accentColor}99)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mb-3">
                  <span>Empty</span>
                  <span className="font-semibold text-slate-400">
                    {Math.round(fillPct)}% of capacity
                  </span>
                  <span>Sold Out</span>
                </div>
                {proposal.drawNotes && (
                  <p className="text-sm text-slate-400 mt-3">{proposal.drawNotes}</p>
                )}
              </section>

              {/* 5. Promotional Plan */}
              <section className="glass rounded-2xl p-6">
                <SectionHeading>Promotional Plan</SectionHeading>
                <div className="space-y-4">
                  {proposal.promoChannels.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">Channels</div>
                      <div className="flex flex-wrap gap-2">
                        {proposal.promoChannels.map((c) => (
                          <span
                            key={c}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-white/[0.08] text-slate-300"
                          >
                            <Globe className="w-3 h-3 text-cyan-500" />
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {proposal.promoTimeline && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">Timeline</div>
                      <p className="text-sm text-slate-300">{proposal.promoTimeline}</p>
                    </div>
                  )}
                  {proposal.promoNotes && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">Notes</div>
                      <p className="text-sm text-slate-300">{proposal.promoNotes}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 6. Budget Breakdown */}
              <section className="glass rounded-2xl p-6">
                <SectionHeading>Budget Breakdown</SectionHeading>
                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Artist Fees', value: proposal.totalArtistFees },
                    { label: 'Production', value: proposal.productionBudget },
                    { label: 'Marketing', value: proposal.marketingBudget },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className="text-sm font-semibold text-white">
                        ${value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-slate-200">Total Expenses</span>
                    <span
                      className="text-lg font-black"
                      style={{ color: proposal.accentColor }}
                    >
                      ${totalBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Ticket Price</div>
                    <div className="text-sm font-bold text-white">{proposal.ticketPrice || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Revenue Model</div>
                    <div className="text-sm font-bold text-white">{proposal.revenueSplit || '—'}</div>
                  </div>
                </div>
                {proposal.budgetNotes && (
                  <p className="text-sm text-slate-400 mt-4">{proposal.budgetNotes}</p>
                )}
              </section>
            </div>

            {/* Right: sticky decision panel (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="glass rounded-2xl p-5 border border-white/[0.08]">
                  <h2 className="text-sm font-black text-white mb-1">Venue Decision</h2>
                  <div className="mb-4">
                    <StatusBadge status={proposal.status} />
                  </div>

                  {venueAction === 'idle' && (
                    <div className="space-y-3">
                      {/* Accept */}
                      <button
                        onClick={handleAccept}
                        className="btn-press w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept Proposal
                      </button>

                      {/* Request Changes */}
                      <button
                        onClick={() => {
                          setExpandChanges((e) => !e);
                          setExpandDecline(false);
                        }}
                        className="btn-press w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all"
                        style={{
                          borderColor: '#f59e0b',
                          color: '#f59e0b',
                          background: expandChanges ? 'rgba(245,158,11,0.08)' : 'transparent',
                        }}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Request Changes
                      </button>
                      {expandChanges && (
                        <div className="space-y-2">
                          <textarea
                            value={changeNotes}
                            onChange={(e) => setChangeNotes(e.target.value)}
                            placeholder="Describe the changes you need..."
                            rows={4}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50 resize-none transition-colors"
                          />
                          <button
                            onClick={handleSendChanges}
                            disabled={!changeNotes.trim()}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 transition-all"
                            style={{ background: 'rgba(245,158,11,0.3)' }}
                          >
                            Send Request
                          </button>
                        </div>
                      )}

                      {/* Decline */}
                      <button
                        onClick={() => {
                          setExpandDecline((e) => !e);
                          setExpandChanges(false);
                        }}
                        className="btn-press w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all"
                        style={{
                          borderColor: '#f43f5e',
                          color: '#f43f5e',
                          background: expandDecline ? 'rgba(244,63,94,0.08)' : 'transparent',
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        Decline Proposal
                      </button>
                      {expandDecline && (
                        <div className="space-y-2">
                          <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="Reason for declining (optional)..."
                            rows={3}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-rose-500/50 resize-none transition-colors"
                          />
                          <button
                            onClick={handleDecline}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                            style={{ background: 'rgba(244,63,94,0.3)' }}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {venueAction === 'accepted' && (
                    <div
                      className="rounded-xl p-4 border space-y-3"
                      style={{
                        background: 'rgba(16,185,129,0.08)',
                        borderColor: 'rgba(16,185,129,0.25)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-sm font-bold text-green-400">
                          Proposal Accepted
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-500">
                        The proposer has been notified.
                      </p>
                      <Link
                        href="/show-builder"
                        className="w-full block text-center py-2.5 rounded-xl font-bold text-sm text-white mt-3 transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        Build Event Workspace
                      </Link>
                    </div>
                  )}

                  {venueAction === 'rejected' && (
                    <div
                      className="rounded-xl p-4 border space-y-3"
                      style={{
                        background: 'rgba(244,63,94,0.08)',
                        borderColor: 'rgba(244,63,94,0.25)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span className="text-sm font-bold text-rose-400">
                          Proposal Declined
                        </span>
                      </div>
                      {declineReason && (
                        <p className="text-xs text-slate-400">{declineReason}</p>
                      )}
                      <button
                        onClick={() => setVenueAction('idle')}
                        className="text-xs text-slate-500 hover:text-white transition-colors underline"
                      >
                        Undo decision
                      </button>
                    </div>
                  )}

                  {venueAction === 'changes-requested' && (
                    <div
                      className="rounded-xl p-4 border space-y-3"
                      style={{
                        background: 'rgba(245,158,11,0.08)',
                        borderColor: 'rgba(245,158,11,0.25)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <span className="text-sm font-bold text-amber-400">
                          Changes Requested
                        </span>
                      </div>
                      {changeNotes && (
                        <div className="space-y-1">
                          {changeNotes.split('\n').filter(Boolean).map((line, i) => (
                            <p key={i} className="text-xs text-slate-400 flex gap-1.5">
                              <span className="text-amber-600 shrink-0">·</span>
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setVenueAction('idle')}
                        className="text-xs text-slate-500 hover:text-white transition-colors underline"
                      >
                        Undo decision
                      </button>
                    </div>
                  )}
                </div>

                {/* Headliner quick view */}
                {headliner && (
                  <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">
                      Headliner
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={headliner.image}
                        alt={headliner.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-white truncate">
                          {headliner.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          ~{headliner.draw} draw · ${headliner.fee.toLocaleString()} fee
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {headliner.genres.map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: `${headliner.accentColor}15`,
                            color: headliner.accentColor,
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/profile/${headliner.artistId}`}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

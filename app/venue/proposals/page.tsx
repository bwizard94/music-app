'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getVenueProposals } from '@/lib/services/proposals';
import Link from 'next/link';
import {
  Zap,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Users,
  ChevronDown,
} from 'lucide-react';
import { MOCK_PROPOSALS, PROPOSAL_STATUS_CONFIG, type ProposalStatus } from '@/lib/data/proposals';
import { VENUES } from '@/lib/data/venues';
import { EmptyState } from '@/components/ui/EmptyState';

// ─── Tab / sort types ─────────────────────────────────────────────────────────

type InboxTab = 'all' | 'pending' | 'under-review' | 'accepted' | 'rejected';
type SortOption = 'newest' | 'oldest' | 'draw-high' | 'draw-low';

const INBOX_TABS: { id: InboxTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'rejected', label: 'Rejected' },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'draw-high', label: 'Draw: High → Low' },
  { id: 'draw-low', label: 'Draw: Low → High' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function tabMatchesStatus(tab: InboxTab, status: ProposalStatus): boolean {
  if (tab === 'all') return true;
  if (tab === 'pending') return status === 'submitted';
  return status === tab;
}

function sortProposals(
  proposals: typeof MOCK_PROPOSALS,
  sort: SortOption
) {
  return [...proposals].sort((a, b) => {
    if (sort === 'newest')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === 'oldest')
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === 'draw-high') return b.estimatedDraw - a.estimatedDraw;
    if (sort === 'draw-low') return a.estimatedDraw - b.estimatedDraw;
    return 0;
  });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProposalStatus }) {
  const cfg = PROPOSAL_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{ background: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-2xl font-black mb-0.5" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenueProposalInboxPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<InboxTab>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);

  useEffect(() => {
    if (!user) return;
    getVenueProposals('the-blind-pig').then(({ data }) => {
      if (data && data.length > 0) {
        setProposals(data as unknown as typeof MOCK_PROPOSALS);
      }
    });
  }, [user]);

  const venue = VENUES.find((v) => v.id === 'the-blind-pig') ?? VENUES[0];

  const filtered = sortProposals(
    proposals.filter((p) => tabMatchesStatus(activeTab, p.status)),
    sort
  );

  // Hardcoded stats as specified
  const stats = {
    total: 5,
    underReview: 1,
    accepted: 1,
    rejected: 1,
    changesRequested: 1,
  };

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Top nav */}
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
        <span className="text-slate-300 text-sm font-semibold">Proposal Inbox</span>
      </nav>

      <main className="pt-14">
        {/* Venue identity header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#060608]" />
          <div className="absolute bottom-0 inset-x-0 px-6 pb-5 flex items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-black text-white">{venue.name}</h1>
                {venue.verified && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${venue.accentColor}25`, color: venue.accentColor }}
                  >
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">Proposal Inbox</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-16 max-w-5xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard label="Total" value={stats.total} color={venue.accentColor} />
            <StatCard label="Under Review" value={stats.underReview} color="#f59e0b" />
            <StatCard label="Accepted" value={stats.accepted} color="#10b981" />
            <StatCard label="Rejected" value={stats.rejected} color="#f43f5e" />
            <StatCard label="Changes Req." value={stats.changesRequested} color="#a855f7" />
          </div>

          {/* Tabs + sort */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {INBOX_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all"
                    style={{
                      borderColor: active
                        ? venue.accentColor
                        : 'rgba(255,255,255,0.06)',
                      background: active ? `${venue.accentColor}15` : 'transparent',
                      color: active ? venue.accentColor : '#64748b',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/[0.08] text-slate-400 hover:text-white transition-all"
              >
                {SORT_OPTIONS.find((s) => s.id === sort)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 glass rounded-xl border border-white/[0.08] overflow-hidden z-20">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSort(s.id);
                        setSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Proposal list */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <EmptyState kind="inbox" compact />
            ) : (
              filtered.map((proposal) => {
                const totalBudget =
                  proposal.totalArtistFees +
                  proposal.productionBudget +
                  proposal.marketingBudget;
                const fillPct = Math.min(
                  100,
                  (proposal.estimatedDraw / proposal.venueCapacity) * 100
                );
                const headliner = proposal.lineup.find((l) => l.role === 'headliner');

                return (
                  <div
                    key={proposal.id}
                    className="glass card-interactive rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    <div className="flex">
                      {/* Accent bar */}
                      <div
                        className="w-1 shrink-0"
                        style={{ background: proposal.accentColor }}
                      />
                      <div className="flex-1 p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
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
                                {proposal.submittedByRole}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={proposal.status} />
                        </div>

                        {/* Event info */}
                        <div className="mb-4">
                          <h3 className="text-xl font-black text-white mb-0.5">
                            {proposal.name}
                          </h3>
                          {proposal.tagline && (
                            <p className="text-slate-400 text-sm mb-2 line-clamp-1">
                              {proposal.tagline}
                            </p>
                          )}
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

                        {/* Date + lineup row */}
                        <div className="flex flex-wrap gap-4 mb-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(proposal.proposedDate)} · {proposal.doorsTime}–
                            {proposal.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {proposal.lineup.length} artist
                            {proposal.lineup.length !== 1 ? 's' : ''}
                            {headliner && ` · ${headliner.name}`}
                          </span>
                        </div>

                        {/* Lineup avatars */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex -space-x-2">
                            {proposal.lineup.slice(0, 5).map((a) => (
                              <img
                                key={a.artistId}
                                src={a.image}
                                alt={a.name}
                                className="w-7 h-7 rounded-lg object-cover border-2 border-[#060608]"
                              />
                            ))}
                          </div>
                          {proposal.lineup.length > 5 && (
                            <span className="text-xs text-slate-500">
                              +{proposal.lineup.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Draw bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Est. draw</span>
                            <span>
                              {proposal.estimatedDraw} / {proposal.venueCapacity} cap
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${fillPct}%`,
                                background: proposal.accentColor,
                              }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Budget{' '}
                            <span className="text-white font-bold">
                              ${totalBudget.toLocaleString()}
                            </span>
                          </span>
                          <Link
                            href={`/venue/proposals/${proposal.id}`}
                            className="btn-press px-4 py-2 rounded-xl text-xs font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${proposal.accentColor}, ${proposal.accentColor}aa)`,
                            }}
                          >
                            Review Proposal
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

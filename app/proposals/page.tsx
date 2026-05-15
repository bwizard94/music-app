'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  ChevronRight,
  Plus,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react';
import {
  MOCK_PROPOSALS,
  PROPOSAL_STATUS_CONFIG,
  type ProposalStatus,
  type ShowProposal,
} from '@/lib/data/proposals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/components/providers/AuthProvider';
import { getMyProposals } from '@/lib/services/proposals';

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabFilter = 'all' | ProposalStatus;

const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'changes-requested', label: 'Changes Requested' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

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

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  onWithdraw,
  onSubmit,
  onRevise,
}: {
  proposal: ShowProposal;
  onWithdraw?: (id: string) => void;
  onSubmit?: (id: string) => void;
  onRevise?: (id: string) => void;
}) {
  const statusCfg = PROPOSAL_STATUS_CONFIG[proposal.status];
  const totalBudget =
    proposal.totalArtistFees + proposal.productionBudget + proposal.marketingBudget;
  const fillPct = Math.min(100, (proposal.estimatedDraw / proposal.venueCapacity) * 100);

  return (
    <div className="glass card-interactive rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all">
      <div className="flex">
        {/* Accent bar */}
        <div className="w-1 shrink-0" style={{ background: proposal.accentColor }} />

        <div className="flex-1 p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-white tracking-tight truncate">
                {proposal.name}
              </h3>
              {proposal.tagline && (
                <p className="text-slate-400 text-sm mt-0.5 line-clamp-1">{proposal.tagline}</p>
              )}
            </div>
            <StatusBadge status={proposal.status} />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {proposal.venueName} · {proposal.venueCity}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(proposal.proposedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {proposal.lineup.length} artist{proposal.lineup.length !== 1 ? 's' : ''}
            </span>
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

          {/* Budget */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">Total budget</span>
            <span className="text-sm font-bold text-white">
              ${totalBudget.toLocaleString()}
            </span>
          </div>

          {/* Changes requested alert */}
          {proposal.status === 'changes-requested' && proposal.changeRequests && (
            <div
              className="rounded-xl p-3 mb-4 border"
              style={{
                background: 'rgba(168,85,247,0.08)',
                borderColor: 'rgba(168,85,247,0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Venue Requested Changes
                </span>
              </div>
              <ul className="space-y-1">
                {proposal.changeRequests.map((req, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                    <span className="text-purple-500 shrink-0">·</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Venue note for rejected */}
          {proposal.status === 'rejected' && proposal.venueNote && (
            <div
              className="rounded-xl p-3 mb-4 border"
              style={{
                background: 'rgba(244,63,94,0.08)',
                borderColor: 'rgba(244,63,94,0.2)',
              }}
            >
              <span className="text-xs text-rose-400 font-semibold">Venue: </span>
              <span className="text-xs text-slate-300">{proposal.venueNote}</span>
            </div>
          )}

          {/* Venue response for accepted */}
          {proposal.status === 'accepted' && proposal.venueResponse && (
            <div
              className="rounded-xl p-3 mb-4 border"
              style={{
                background: 'rgba(16,185,129,0.08)',
                borderColor: 'rgba(16,185,129,0.2)',
              }}
            >
              <span className="text-xs text-green-400 font-semibold">Venue: </span>
              <span className="text-xs text-slate-300">{proposal.venueResponse}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {proposal.status === 'draft' && (
              <>
                <button className="btn-press px-4 py-2 rounded-xl text-xs font-bold border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  Edit
                </button>
                <button
                  onClick={() => onSubmit?.(proposal.id)}
                  className="btn-press px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
                >
                  Submit
                </button>
              </>
            )}
            {proposal.status === 'submitted' && (
              <button
                onClick={() => onWithdraw?.(proposal.id)}
                className="btn-press px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/30 text-rose-400 hover:border-rose-500/60 transition-all"
              >
                Withdraw
              </button>
            )}
            {proposal.status === 'under-review' && (
              <span className="text-xs text-slate-500">
                Awaiting venue response...
              </span>
            )}
            {proposal.status === 'accepted' && (
              <Link
                href="/show-builder"
                className="btn-press px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                Build Event Workspace
              </Link>
            )}
            {proposal.status === 'rejected' && (
              <Link
                href="/proposals/new"
                className="btn-press px-4 py-2 rounded-xl text-xs font-bold border border-white/[0.08] text-slate-300 hover:text-white transition-all"
              >
                Resubmit with Changes
              </Link>
            )}
            {proposal.status === 'changes-requested' && (
              <button
                onClick={() => onRevise?.(proposal.id)}
                className="btn-press px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                Revise Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div className="glass rounded-xl p-4 flex flex-col gap-1">
      <span className="text-2xl font-black" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);

  useEffect(() => {
    if (!user) return;
    getMyProposals(user.id).then(({ data }) => {
      if (data && data.length > 0) {
        setProposals(data as unknown as typeof MOCK_PROPOSALS);
      }
    });
  }, [user]);

  const filteredProposals =
    activeTab === 'all'
      ? proposals
      : proposals.filter((p) => p.status === activeTab);

  const stats = {
    total: proposals.length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    underReview: proposals.filter((p) => p.status === 'under-review').length,
    changesNeeded: proposals.filter((p) => p.status === 'changes-requested').length,
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
        <span className="text-slate-300 text-sm font-semibold">Proposals</span>
        <div className="ml-auto">
          <Link
            href="/proposals/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            <Plus className="w-4 h-4" />
            New Proposal
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page header */}
          <div>
            <h1 className="text-4xl font-black text-white mb-1">My Proposals</h1>
            <p className="text-slate-400">
              Track your show proposals and respond to venue feedback.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total" value={stats.total} color="#a855f7" />
            <StatCard label="Accepted" value={stats.accepted} color="#10b981" />
            <StatCard label="Under Review" value={stats.underReview} color="#f59e0b" />
            <StatCard label="Changes Needed" value={stats.changesNeeded} color="#a855f7" />
          </div>

          {/* Tab filters */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              const count =
                tab.id === 'all'
                  ? proposals.length
                  : proposals.filter((p) => p.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all"
                  style={{
                    borderColor: active ? '#a855f7' : 'rgba(255,255,255,0.06)',
                    background: active ? 'rgba(168,85,247,0.12)' : 'transparent',
                    color: active ? '#d8b4fe' : '#64748b',
                  }}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                      style={{
                        background: active ? '#a855f7' : '#1e293b',
                        color: 'white',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Proposal list */}
          <div className="space-y-4">
            {filteredProposals.length === 0 ? (
              <EmptyState kind="proposals" compact />
            ) : (
              filteredProposals.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  onWithdraw={(id) => setWithdrawTarget(id)}
                  onSubmit={() =>
                    toast({ type: 'success', title: 'Proposal submitted', message: 'The venue will review it shortly.' })
                  }
                  onRevise={() =>
                    toast({ type: 'info', title: 'Opening revision mode', message: 'Address the requested changes and resubmit.' })
                  }
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Withdraw confirmation modal */}
      <Modal
        open={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        title="Withdraw proposal?"
        description="This will remove the proposal from the venue's inbox. You can resubmit at any time."
        confirmLabel="Withdraw"
        confirmVariant="danger"
        onConfirm={() => {
          setWithdrawTarget(null);
          toast({ type: 'warning', title: 'Proposal withdrawn', message: 'Removed from the venue inbox.' });
        }}
        icon="danger"
      />
    </div>
  );
}

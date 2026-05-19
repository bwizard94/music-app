'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { MOCK_PROPOSALS } from '@/lib/data/proposals';
import type { ShowProposal, ProposalStatus } from '@/lib/data/proposals';

type TabFilter = 'all' | ProposalStatus;

const STATUS_COLOR: Record<ProposalStatus, string> = {
  draft: '#64748b',
  submitted: '#06b6d4',
  'under-review': '#f59e0b',
  accepted: '#10b981',
  rejected: '#f43f5e',
  'changes-requested': '#a855f7',
};

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'under-review': 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  'changes-requested': 'Changes Req.',
};

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Pending' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

export default function ProposalsPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ShowProposal[]>(MOCK_PROPOSALS);
  const [tab, setTab] = useState<TabFilter>('all');

  const filtered = useMemo(() =>
    proposals.filter((p) => tab === 'all' || p.status === tab),
    [proposals, tab]
  );

  const counts = useMemo(() => ({
    total: proposals.length,
    pending: proposals.filter((p) => p.status === 'submitted').length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    reviewed: proposals.filter((p) => p.status === 'under-review').length,
  }), [proposals]);

  const flagForReview = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: 'under-review' as ProposalStatus } : p)
    );
    toast({ type: 'info', title: 'Proposal flagged for review' });
  };

  return (
    <>
      <AdminTopBar title="Proposals" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="flex items-center gap-8">
          {[
            { label: 'Total', value: counts.total },
            { label: 'Pending Review', value: counts.pending },
            { label: 'Under Review', value: counts.reviewed },
            { label: 'Accepted', value: counts.accepted },
            { label: 'Avg Response', value: '3.2d' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-white font-bold text-xl">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={tab === key
                ? { backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
                : { color: '#64748b', border: '1px solid transparent' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.05]">
            {['Proposal', 'Venue', 'Submitted By', 'Date', 'Status', 'Actions'].map((h) => (
              <div key={h} className="text-xs text-slate-600 font-semibold uppercase tracking-wide">{h}</div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-slate-600 text-sm text-center py-10">No proposals match this filter</div>
          )}

          {filtered.map((proposal) => (
            <div
              key={proposal.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] items-center transition-colors"
            >
              {/* Name */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{proposal.name}</span>
                  <span className="text-slate-600 text-xs capitalize">{proposal.eventType.replace('-', ' ')}</span>
                </div>
                <div className="text-slate-600 text-xs mt-0.5">{proposal.genres.slice(0, 2).join(', ')}</div>
              </div>

              {/* Venue */}
              <div className="text-slate-400 text-xs whitespace-nowrap">{proposal.venueName}</div>

              {/* Submitted by */}
              <div className="flex items-center gap-2">
                <img src={proposal.submittedByImage} alt={proposal.submittedByName} className="w-6 h-6 rounded-lg object-cover" />
                <span className="text-slate-400 text-xs whitespace-nowrap">{proposal.submittedByName}</span>
              </div>

              {/* Date */}
              <div className="text-slate-500 text-xs whitespace-nowrap">
                {proposal.submittedAt
                  ? new Date(proposal.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : new Date(proposal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              </div>

              {/* Status */}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: `${STATUS_COLOR[proposal.status]}18`,
                  color: STATUS_COLOR[proposal.status],
                }}
              >
                {STATUS_LABELS[proposal.status]}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => flagForReview(proposal.id)}
                  disabled={proposal.status === 'under-review'}
                  className="px-2 py-1 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-white disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  Flag
                </button>
                <button
                  onClick={() => toast({ type: 'success', title: 'Event added to featured' })}
                  className="px-2 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                  style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                >
                  Feature
                </button>
                <Link
                  href={`/venue/proposals/${proposal.id}`}
                  className="px-2 py-1 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

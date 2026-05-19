'use client';

import { useState } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { REPORTS } from '@/lib/data/admin';
import type { Report, ReportType, ReportStatus } from '@/lib/data/admin';

type TabFilter = 'all' | ReportType;
type StatusFilter = 'pending' | 'all';

const SEVERITY_COLOR = { high: '#f43f5e', medium: '#f59e0b', low: '#475569' };
const TYPE_COLOR: Record<ReportType, string> = {
  profile: '#a855f7', content: '#06b6d4', proposal: '#10b981', message: '#f97316',
};

export default function ReportsPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [tab, setTab] = useState<TabFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);

  const TABS: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'profile', label: 'Profiles' },
    { key: 'content', label: 'Content' },
    { key: 'proposal', label: 'Proposals' },
    { key: 'message', label: 'Messages' },
  ];

  const filtered = reports.filter((r) => {
    const matchesType = tab === 'all' || r.type === tab;
    const matchesStatus = statusFilter === 'all' || r.status === 'pending';
    return matchesType && matchesStatus;
  });

  const updateStatus = (id: string, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const handleReview = (report: Report) => {
    setExpanded(expanded === report.id ? null : report.id);
    if (report.status === 'pending') {
      updateStatus(report.id, 'reviewed');
      toast({ type: 'info', title: `Report marked as reviewed` });
    }
  };

  const handleDismiss = (report: Report) => {
    updateStatus(report.id, 'dismissed');
    if (expanded === report.id) setExpanded(null);
    toast({ type: 'warning', title: `Report dismissed` });
  };

  const handleSuspend = (report: Report) => {
    toast({ type: 'warning', title: `${report.reportedName} suspended`, message: 'User account has been suspended.' });
    updateStatus(report.id, 'reviewed');
  };

  return (
    <>
      <AdminTopBar title="Reports" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
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
          <div className="flex gap-1">
            {(['pending', 'all'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={statusFilter === s
                  ? { backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }
                  : { color: '#64748b' }
                }
              >
                {s === 'all' ? 'Show All' : 'Pending Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-slate-600 text-sm text-center py-12">No reports match current filters</div>
          )}
          {filtered.map((report) => (
            <div
              key={report.id}
              className="glass rounded-2xl border border-white/[0.07] overflow-hidden"
              style={{ borderLeft: `3px solid ${SEVERITY_COLOR[report.severity]}` }}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={report.reportedImage}
                    alt={report.reportedName}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                        style={{ backgroundColor: `${TYPE_COLOR[report.type]}18`, color: TYPE_COLOR[report.type] }}
                      >
                        {report.type}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                        style={{ backgroundColor: `${SEVERITY_COLOR[report.severity]}18`, color: SEVERITY_COLOR[report.severity] }}
                      >
                        {report.severity}
                      </span>
                      <span className="text-slate-600 text-xs">{report.submittedAt}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-white text-sm font-medium">Reported: {report.reportedName}</span>
                      <span className="text-slate-500 text-xs ml-2">· By: {report.reportedBy}</span>
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      <span className="font-medium">{report.reason}</span>
                      {' · '}
                      <span className="text-slate-600">{report.description.slice(0, 80)}…</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs capitalize font-medium"
                      style={{
                        color: report.status === 'pending' ? '#f59e0b'
                          : report.status === 'reviewed' ? '#10b981' : '#475569',
                      }}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => handleReview(report)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                    >
                      {expanded === report.id ? 'Collapse' : 'Review'}
                    </button>
                    <button
                      onClick={() => handleDismiss(report)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ color: '#64748b' }}
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleSuspend(report)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}
                    >
                      Suspend
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === report.id && (
                  <div
                    className="mt-4 pt-4 border-t border-white/[0.06] space-y-3"
                  >
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Full Description</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{report.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { updateStatus(report.id, 'reviewed'); setExpanded(null); toast({ type: 'success', title: 'Report resolved' }); }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ backgroundColor: '#10b981', color: '#fff' }}
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleSuspend(report)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ backgroundColor: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}
                      >
                        Suspend User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

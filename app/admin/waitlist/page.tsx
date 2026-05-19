'use client';

import { useState, useMemo } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { ADMIN_WAITLIST, ADMIN_CITIES } from '@/lib/data/admin';
import type { AdminWaitlistEntry } from '@/lib/data/admin';

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function genCode() {
  return Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

export default function WaitlistPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<AdminWaitlistEntry[]>(ADMIN_WAITLIST);
  const [batchCount, setBatchCount] = useState('10');
  const [batchCity, setBatchCity] = useState('all');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const stats = useMemo(() => ({
    total: entries.length,
    invited: entries.filter((e) => e.status === 'invited').length,
    joined: entries.filter((e) => e.status === 'joined').length,
    pending: entries.filter((e) => e.status === 'pending').length,
    topReferrer: [...entries].sort((a, b) => b.referralCount - a.referralCount)[0],
  }), [entries]);

  const conversionRate = stats.invited + stats.joined > 0
    ? Math.round((stats.joined / (stats.invited + stats.joined)) * 100)
    : 0;

  const sendInvite = (entry: AdminWaitlistEntry) => {
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: 'invited' } : e));
    toast({ type: 'success', title: `Invite sent to ${entry.email}` });
  };

  const bumpToFront = (entry: AdminWaitlistEntry) => {
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, position: 1 } : e));
    toast({ type: 'success', title: `${entry.name} bumped to position 1` });
  };

  const removeEntry = (entry: AdminWaitlistEntry) => {
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    toast({ type: 'warning', title: `${entry.name} removed from waitlist` });
  };

  const handleGenerate = () => {
    const codes = Array.from({ length: Number(batchCount) || 10 }, genCode);
    setGeneratedCodes(codes);
    toast({ type: 'success', title: `${codes.length} invite codes generated` });
  };

  const STATUS_COLOR = { pending: '#64748b', invited: '#f59e0b', joined: '#10b981' };

  return (
    <>
      <AdminTopBar title="Waitlist" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total on Waitlist', value: stats.total },
            { label: 'Invites Sent', value: stats.invited },
            { label: 'Conversion Rate', value: `${conversionRate}%` },
            { label: 'Top Referrer', value: stats.topReferrer?.name ?? '—', sub: `${stats.topReferrer?.referralCount ?? 0} referrals` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="glass rounded-2xl border border-white/[0.07] p-4">
              <div className="text-white font-bold text-xl">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              {sub && <div className="text-slate-600 text-xs mt-0.5">{sub}</div>}
            </div>
          ))}
        </div>

        {/* Section 1: Waitlist entries */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Waitlist Entries</h3>
          <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto] gap-3 px-4 py-2.5 border-b border-white/[0.05] text-xs text-slate-600 font-semibold uppercase tracking-wide">
              {['#', 'Name', 'City', 'Role', 'Refs', 'Joined', 'Status', 'Actions'].map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto] gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] items-center transition-colors"
              >
                <span className="text-slate-500 text-xs w-6 text-right">{entry.position}</span>
                <div>
                  <div className="text-white text-sm font-medium">{entry.name}</div>
                  <div className="text-slate-600 text-xs">{entry.email}</div>
                </div>
                <span className="text-slate-400 text-xs whitespace-nowrap">{entry.city}</span>
                <span className="text-slate-500 text-xs whitespace-nowrap">{entry.role}</span>
                <span className="text-slate-400 text-xs">{entry.referralCount}</span>
                <span className="text-slate-500 text-xs whitespace-nowrap">{entry.joinedAt}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize whitespace-nowrap"
                  style={{
                    backgroundColor: `${STATUS_COLOR[entry.status]}18`,
                    color: STATUS_COLOR[entry.status],
                  }}
                >
                  {entry.status}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => sendInvite(entry)}
                    disabled={entry.status !== 'pending'}
                    className="px-2 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-40 whitespace-nowrap"
                    style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                  >
                    Invite
                  </button>
                  <button
                    onClick={() => bumpToFront(entry)}
                    className="px-2 py-1 rounded-lg text-xs border border-white/[0.08] text-slate-500 hover:text-white transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => removeEntry(entry)}
                    className="px-2 py-1 rounded-lg text-xs border border-white/[0.08] text-slate-600 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Generate invite batch */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm">Generate Invite Batch</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={batchCount}
              onChange={(e) => setBatchCount(e.target.value)}
              min="1" max="100"
              placeholder="Count (default 10)"
              className="w-36 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
            />
            <select
              value={batchCity}
              onChange={(e) => setBatchCity(e.target.value)}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
            >
              <option value="all">All cities</option>
              {ADMIN_CITIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
            >
              Generate
            </button>
          </div>
          {generatedCodes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">{generatedCodes.length} codes generated</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCodes.join('\n'));
                    toast({ type: 'success', title: 'Codes copied to clipboard' });
                  }}
                  className="text-xs font-semibold"
                  style={{ color: '#f59e0b' }}
                >
                  Copy All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {generatedCodes.map((code) => (
                  <div
                    key={code}
                    className="font-mono text-xs text-slate-300 bg-white/[0.04] rounded-lg px-2 py-1.5 text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Invite code stats */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Invite Code Stats</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Total codes issued', value: '234' },
              { label: 'Total used', value: '189' },
              { label: 'Conversion rate', value: '81%' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-white font-bold text-2xl">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <p className="text-slate-500 text-xs">Top referrer: <span className="text-white font-medium">{stats.topReferrer?.name}</span> with {stats.topReferrer?.referralCount} invites</p>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { VERIFICATION_QUEUE } from '@/lib/data/admin';
import type { VerificationRequest } from '@/lib/data/admin';

export default function VerificationPage() {
  const { toast } = useToast();
  const [queue, setQueue] = useState<VerificationRequest[]>(VERIFICATION_QUEUE);
  const [selected, setSelected] = useState<VerificationRequest | null>(null);

  const pending = queue.filter((v) => v.status === 'pending');
  const decided = queue.filter((v) => v.status !== 'pending');

  const decide = (item: VerificationRequest, decision: 'approved' | 'rejected' | 'info') => {
    if (decision === 'info') {
      toast({ type: 'info', title: `More info requested from ${item.name}` });
      return;
    }
    setQueue((prev) =>
      prev.map((v) =>
        v.id === item.id
          ? { ...v, status: decision, decidedBy: 'stagefront2025', decidedAt: 'May 18, 2025' }
          : v
      )
    );
    if (selected?.id === item.id) setSelected(null);
    toast({
      type: decision === 'approved' ? 'success' : 'warning',
      title: decision === 'approved' ? `${item.name} verified` : `${item.name} rejected`,
    });
  };

  return (
    <>
      <AdminTopBar title="Verification" />
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Left: queue */}
        <div className="w-80 flex-shrink-0 border-r border-white/[0.05] overflow-y-auto p-4 space-y-3">
          <p className="text-slate-400 text-sm font-semibold">{pending.length} pending</p>

          {pending.length === 0 && (
            <div className="text-slate-600 text-sm text-center py-8">Queue clear</div>
          )}

          {pending.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="w-full text-left glass rounded-xl border p-3 transition-all"
              style={{
                borderColor: selected?.id === item.id ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)',
                backgroundColor: selected?.id === item.id ? 'rgba(245,158,11,0.06)' : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">{item.name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 capitalize"
                      style={{
                        backgroundColor: item.type === 'artist' ? 'rgba(168,85,247,0.15)' : 'rgba(6,182,212,0.15)',
                        color: item.type === 'artist' ? '#a855f7' : '#06b6d4',
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="text-slate-500 text-xs">{item.city}</div>
                  <div className="text-slate-600 text-xs mt-0.5">{item.submittedAt}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Recent decisions */}
          {decided.length > 0 && (
            <>
              <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold pt-4">Recent Decisions</p>
              {decided.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-2 py-2 rounded-xl">
                  <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0 opacity-60" />
                  <div className="flex-1 min-w-0">
                    <span className="text-slate-400 text-xs font-medium truncate block">{item.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className="text-xs font-semibold capitalize"
                        style={{ color: item.status === 'approved' ? '#10b981' : '#f43f5e' }}
                      >
                        {item.status}
                      </span>
                      {item.decidedBy && (
                        <span className="text-slate-700 text-xs">· by {item.decidedBy}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-600 text-sm">Select a request to review</p>
            </div>
          ) : (
            <div className="max-w-lg space-y-6">
              <div className="flex items-start gap-5">
                <img
                  src={selected.avatar}
                  alt={selected.name}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div>
                  <h2 className="text-white text-xl font-bold">{selected.name}</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{selected.role}</p>
                  <p className="text-slate-500 text-sm">{selected.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                      style={{
                        backgroundColor: selected.type === 'artist' ? 'rgba(168,85,247,0.15)' : 'rgba(6,182,212,0.15)',
                        color: selected.type === 'artist' ? '#a855f7' : '#06b6d4',
                      }}
                    >
                      {selected.type}
                    </span>
                    <span className="text-slate-600 text-xs">Submitted {selected.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/[0.07] p-4 space-y-3">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Reason for Verification</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{selected.reason}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Social Links</p>
                  <div className="space-y-1">
                    {selected.socialLinks.map((link) => (
                      <div key={link} className="text-sm" style={{ color: '#f59e0b' }}>{link}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Draw Estimate</p>
                  <p className="text-slate-300 text-sm">{selected.drawEstimate} per show</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => decide(selected, 'approved')}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#10b981', color: '#fff' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => decide(selected, 'info')}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-90"
                  style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)' }}
                >
                  Request More Info
                </button>
                <button
                  onClick={() => decide(selected, 'rejected')}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-90"
                  style={{ borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.06)' }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

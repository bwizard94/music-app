'use client';

import { useState } from 'react';
import { Users, Activity, TrendingUp, FileText, CalendarDays, Clock } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import StatCard from '@/components/admin/StatCard';
import { useToast } from '@/components/ui/Toast';
import { PLATFORM_METRICS, DAILY_SIGNUPS, ADMIN_CITIES } from '@/lib/data/admin';
import type { AdminCity } from '@/lib/data/admin';

type SortKey = 'name' | 'artists' | 'events';

const CHART_HEIGHT = 140;
const maxCount = Math.max(...DAILY_SIGNUPS.map((d) => d.count));
const periodTotal = DAILY_SIGNUPS.reduce((s, d) => s + d.count, 0);

function SignupChart() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Daily Signups — Last 14 Days</h3>
          <p className="text-slate-500 text-xs mt-0.5">{periodTotal.toLocaleString()} total this period</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${DAILY_SIGNUPS.length * 44} ${CHART_HEIGHT + 24}`} className="w-full" style={{ height: CHART_HEIGHT + 24 }}>
        {/* Grid lines */}
        {[0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={0} y1={CHART_HEIGHT - CHART_HEIGHT * pct}
            x2={DAILY_SIGNUPS.length * 44} y2={CHART_HEIGHT - CHART_HEIGHT * pct}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}
          />
        ))}
        {DAILY_SIGNUPS.map((d, i) => {
          const barH = Math.max(4, (d.count / maxCount) * CHART_HEIGHT);
          const isToday = i === DAILY_SIGNUPS.length - 1;
          const x = i * 44 + 8;
          return (
            <g key={d.date}>
              <rect
                x={x} y={CHART_HEIGHT - barH}
                width={28} height={barH}
                rx={4}
                fill={isToday ? '#f59e0b' : 'rgba(245, 158, 11, 0.45)'}
              />
              {i % 2 === 0 && (
                <text
                  x={x + 14} y={CHART_HEIGHT + 16}
                  textAnchor="middle" fontSize={9}
                  fill="#475569"
                >
                  {d.date.replace('May ', '')}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CityTable() {
  const [sortKey, setSortKey] = useState<SortKey>('artists');
  const cities = [...ADMIN_CITIES]
    .filter((c) => c.status !== 'waitlist' || c.waitlistCount > 0)
    .slice(0, 8)
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      return (b[sortKey] as number) - (a[sortKey] as number);
    });

  const statusDot = (status: AdminCity['status']) => {
    if (status === 'active') return '#10b981';
    if (status === 'launching') return '#f59e0b';
    return '#475569';
  };

  const Col = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => setSortKey(k)}
      className="text-xs font-semibold uppercase tracking-wide transition-colors"
      style={{ color: sortKey === k ? '#f59e0b' : '#475569' }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h3 className="text-white font-semibold text-sm mb-3">City Activity</h3>
      <div className="flex items-center gap-6 mb-2 px-1">
        <Col k="name" label="City" />
        <div className="flex-1" />
        <Col k="artists" label="Artists" />
        <Col k="events" label="Events" />
        <span className="text-xs text-slate-700 uppercase tracking-wide w-16 text-right">Status</span>
      </div>
      <div className="space-y-1">
        {cities.map((city) => (
          <div
            key={city.id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusDot(city.status) }}
            />
            <span className="text-white text-sm flex-1">{city.name}</span>
            <span className="text-slate-400 text-xs w-14 text-right">{city.artists.toLocaleString()}</span>
            <span className="text-slate-400 text-xs w-10 text-right">{city.events.toLocaleString()}</span>
            <span
              className="text-xs capitalize w-16 text-right"
              style={{ color: statusDot(city.status) }}
            >
              {city.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const { toast } = useToast();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteCount, setInviteCount] = useState('10');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const handleGenerateCodes = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const codes = Array.from({ length: Number(inviteCount) || 10 }, () =>
      Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    );
    setGeneratedCodes(codes);
  };

  const systemLog = [
    '892 new signups this month',
    '7 verifications pending',
    '3 reports need review',
    '341 active Pro subscriptions',
    '2 cities launching next month',
    '8,412 users on waitlist',
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-sm">Quick Actions</h3>
      <div className="space-y-2">
        {[
          { label: 'Send Platform Announcement', action: () => toast({ type: 'warning', title: 'Not connected to email service' }) },
          { label: 'Export User CSV', action: () => toast({ type: 'success', title: 'Exported 14,287 users' }) },
          { label: 'Clear Feature Cache', action: () => toast({ type: 'success', title: 'Cache cleared' }) },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowInviteForm((v) => !v)}
          className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all border"
          style={{
            color: '#f59e0b',
            borderColor: 'rgba(245,158,11,0.2)',
            backgroundColor: 'rgba(245,158,11,0.06)',
          }}
        >
          Generate Invite Batch
        </button>
        {showInviteForm && (
          <div className="space-y-2 pl-1">
            <input
              type="number"
              value={inviteCount}
              onChange={(e) => setInviteCount(e.target.value)}
              min="1" max="100"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm outline-none"
              placeholder="Count (default 10)"
            />
            <button
              onClick={handleGenerateCodes}
              className="w-full py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
            >
              Generate
            </button>
            {generatedCodes.length > 0 && (
              <div className="glass rounded-xl border border-white/[0.07] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{generatedCodes.length} codes generated</span>
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
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {generatedCodes.map((c) => (
                    <div key={c} className="text-xs font-mono text-slate-300">{c}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">System Activity</h4>
        <div className="space-y-2">
          {systemLog.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
              <span className="text-slate-500 text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const m = PLATFORM_METRICS;

  return (
    <>
      <AdminTopBar title="Overview" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Users}       label="Total Users"      value={m.totalUsers}    change={`+${m.userGrowth}% wk`} />
          <StatCard icon={Activity}    label="Active This Week" value={m.activeThisWeek} />
          <StatCard icon={TrendingUp}  label="New This Month"   value={m.newThisMonth}  change="+892" />
          <StatCard icon={FileText}    label="Total Proposals"  value={m.totalProposals} change={`+${m.proposalGrowth}% wk`} />
          <StatCard icon={CalendarDays}label="Total Events"     value={m.totalEvents}   change={`+${m.eventGrowth}% wk`} />
          <StatCard icon={Clock}       label="Waitlist Size"    value={m.waitlistTotal} />
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5">
          <SignupChart />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-6">
          <div className="glass rounded-2xl border border-white/[0.07] p-5">
            <CityTable />
          </div>
          <div className="glass rounded-2xl border border-white/[0.07] p-5">
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { Eye, TrendingUp, Users, Lock, BarChart3, Music2 } from 'lucide-react';
import type { ArtistData } from './artistData';

interface Props {
  artist: ArtistData;
  isOwner?: boolean;
}

export default function AnalyticsPreview({ artist, isOwner }: Props) {
  const color = artist.accentColor;

  const metrics = [
    {
      label: 'Profile Views',
      value: artist.analytics.profileViews.value.toLocaleString(),
      change: artist.analytics.profileViews.change,
      period: artist.analytics.profileViews.period,
      icon: Eye,
      positive: true,
    },
    {
      label: 'Booking Inquiries',
      value: artist.analytics.bookingInquiries.value,
      change: artist.analytics.bookingInquiries.change,
      period: artist.analytics.bookingInquiries.period,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: 'Followers',
      value: artist.analytics.followersGrowth.value.toLocaleString(),
      change: artist.analytics.followersGrowth.change,
      period: artist.analytics.followersGrowth.period,
      icon: Users,
      positive: true,
    },
    {
      label: 'Stream Plays',
      value: artist.analytics.streamPlays.value,
      change: artist.analytics.streamPlays.change,
      period: artist.analytics.streamPlays.period,
      icon: Music2,
      positive: true,
    },
  ];

  // Fake chart data
  const chartData = [22, 35, 28, 45, 38, 52, 48, 61, 55, 70, 64, 80, 74, 88, 82, 95, 89, 100];

  if (!isOwner) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/[0.07] text-center relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col">
          {/* Blurred preview */}
          <div className="flex-1 grid grid-cols-2 gap-3 p-5 filter blur-[6px] pointer-events-none select-none">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4">
                <div className="w-7 h-7 rounded-lg bg-white/10 mb-3" />
                <div className="text-white font-bold text-xl">{value}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 py-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Analytics are private</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Profile analytics are visible only to the artist. Connect with NOVA VEGA to access collaboration data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" style={{ color }} />
          <h3 className="text-white font-bold text-sm">Your Analytics</h3>
        </div>
        <span className="text-slate-600 text-xs">Last 30 days</span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ label, value, change, icon: Icon, positive }) => (
          <div
            key={label}
            className="glass rounded-xl p-4 border border-white/[0.07] hover:border-white/[0.12] transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-white font-bold text-xl tracking-tight">{value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            <div
              className="text-xs font-semibold mt-1"
              style={{ color: positive ? '#10b981' : '#f43f5e' }}
            >
              {change}
            </div>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold text-sm">Profile Views</span>
          <span className="text-green-400 text-xs font-semibold">+18% this month</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {chartData.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-100 opacity-80"
              style={{
                height: `${h}%`,
                backgroundColor: i === chartData.length - 1 ? color : `${color}40`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-700 mt-2">
          <span>May 1</span>
          <span>Today</span>
        </div>
      </div>

      {/* Upgrade nudge */}
      <div
        className="rounded-xl p-4 border text-center"
        style={{
          backgroundColor: `${color}08`,
          borderColor: `${color}20`,
        }}
      >
        <p className="text-xs text-slate-500 mb-2">
          Unlock audience demographics, top discovery sources, and booking intent data
        </p>
        <button
          className="text-xs font-semibold py-1.5 px-4 rounded-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          Upgrade to Pro Analytics
        </button>
      </div>
    </div>
  );
}

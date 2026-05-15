'use client';

import { TrendingUp, Users, Ticket, Eye, BarChart3, Lock, Calendar, DollarSign } from 'lucide-react';
import type { VenueData } from './venueData';

interface Props { venue: VenueData; isOwner?: boolean; }

export default function VenueAnalytics({ venue, isOwner }: Props) {
  const color = venue.accentColor;

  // Bar chart sparkline data
  const occupancyData = [72, 85, 91, 78, 94, 88, 96, 82, 90, 87, 93, 88, 95, 91, 97, 89, 94, 88];
  const ticketData = [240, 280, 295, 255, 300, 275, 300, 265, 288, 278, 296, 284, 298, 291, 300, 279, 293, 285];

  if (!isOwner) {
    // Public analytics preview — partial reveal
    return (
      <div className="space-y-5 max-w-3xl">
        {/* Public stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Occupancy', value: venue.analytics.avgOccupancy, icon: TrendingUp, public: true },
            { label: 'Monthly Events', value: venue.stats.eventsPerMonth.toString(), icon: Calendar, public: true },
            { label: 'Avg Ticket Price', value: venue.analytics.avgTicketPrice, icon: Ticket, public: true },
            { label: 'Repeat Visitors', value: venue.analytics.repeatVisitors, icon: Users, public: true },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-4 border border-white/[0.07]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-white font-bold text-xl">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Audience demographics — public partial */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
            <Users className="w-4 h-4" style={{ color }} />
            <h3 className="text-white font-bold text-sm">Audience Profile</h3>
            <span className="text-slate-600 text-xs ml-auto">Public Data</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-slate-600 text-xs uppercase tracking-widest mb-3">Top Age Range</p>
              <div className="text-white font-bold text-2xl">{venue.analytics.topDemographic}</div>
              <div className="text-slate-500 text-xs">Primary age bracket</div>
            </div>
            <div>
              <p className="text-slate-600 text-xs uppercase tracking-widest mb-3">Repeat Visitors</p>
              <div className="text-white font-bold text-2xl">{venue.analytics.repeatVisitors}</div>
              <div className="text-slate-500 text-xs">Return to the venue</div>
            </div>
            <div>
              <p className="text-slate-600 text-xs uppercase tracking-widest mb-3">Peak Nights</p>
              <div className="text-white font-bold text-xl">{venue.analytics.peakNights}</div>
              <div className="text-slate-500 text-xs">Highest attendance</div>
            </div>
          </div>
        </div>

        {/* Locked private analytics */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07] relative">
          <div className="absolute inset-0 bg-[#060608]/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Full analytics are private</p>
              <p className="text-slate-500 text-xs mt-1 max-w-xs">
                Revenue, ticket demographics, and traffic sources are visible to venue owners only.
              </p>
            </div>
          </div>
          {/* Blurred preview content */}
          <div className="p-5 filter blur-sm select-none pointer-events-none">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['$18,420', '$924/night', '64%'].map((v) => (
                <div key={v} className="bg-white/5 rounded-xl p-4">
                  <div className="text-white font-bold text-xl">{v}</div>
                  <div className="text-slate-500 text-xs mt-1">Revenue metric</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Owner view — full analytics
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" style={{ color }} />
          <h3 className="text-white font-bold text-sm">Venue Analytics</h3>
        </div>
        <span className="text-slate-600 text-xs">Last 30 days</span>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg Occupancy', value: venue.analytics.avgOccupancy, change: '+4%', icon: TrendingUp },
          { label: 'Monthly Impressions', value: venue.analytics.monthlyImpressions, change: '+12%', icon: Eye },
          { label: 'Ticket Revenue', value: '$18,420', change: '+8%', icon: DollarSign },
          { label: 'Repeat Visitors', value: venue.analytics.repeatVisitors, change: '+2%', icon: Users },
        ].map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4 border border-white/[0.07]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-white font-bold text-xl">{value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            <div className="text-green-400 text-xs font-semibold mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Occupancy chart */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold text-sm">Nightly Occupancy Rate</span>
          <span className="text-green-400 text-xs font-semibold">Avg {venue.analytics.avgOccupancy}</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {occupancyData.map((h, i) => (
            <div key={i}
              className="flex-1 rounded-t-sm transition-all hover:opacity-100 opacity-80 cursor-pointer group relative"
              style={{ height: `${h}%`, backgroundColor: h >= 90 ? color : `${color}60` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 glass rounded px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {h}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-700 mt-2">
          <span>May 1</span><span>Today</span>
        </div>
      </div>

      {/* Tickets sold */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold text-sm">Tickets Sold Per Event</span>
          <span className="text-slate-500 text-xs">Last 18 events</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {ticketData.map((v, i) => (
            <div key={i}
              className="flex-1 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ height: `${(v / 300) * 100}%`, backgroundColor: `${color}80` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-700 mt-2">
          <span>Oldest</span><span>Latest</span>
        </div>
      </div>

      {/* Audience demographics */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <h3 className="text-white font-bold text-sm mb-4">Audience Demographics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Top Age', value: venue.analytics.topDemographic, sub: 'Primary bracket' },
            { label: 'Peak Night', value: venue.analytics.peakNights, sub: 'Highest volume' },
            { label: 'Avg Ticket', value: venue.analytics.avgTicketPrice, sub: 'Per person' },
            { label: 'Repeat Rate', value: venue.analytics.repeatVisitors, sub: 'Return visitors' },
            { label: 'Gender Split', value: '52/48', sub: 'M/F approx' },
            { label: 'Top Source', value: 'Instagram', sub: 'Discovery channel' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-slate-600 text-xs mb-0.5">{label}</div>
              <div className="text-white font-bold text-lg">{value}</div>
              <div className="text-slate-600 text-xs">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

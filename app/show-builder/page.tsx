'use client';

import Link from 'next/link';
import { Plus, LayoutDashboard, Zap, Calendar, MapPin, Users, TrendingUp, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { EVENT_BUILDS } from '@/components/show-builder/showData';

const STATUS_CONFIG = {
  draft:     { color: '#64748b', label: 'Draft',     bg: '#64748b20' },
  pitching:  { color: '#f59e0b', label: 'Pitching',  bg: '#f59e0b20' },
  confirmed: { color: '#10b981', label: 'Confirmed', bg: '#10b98120' },
  cancelled: { color: '#f43f5e', label: 'Cancelled', bg: '#f43f5e20' },
  completed: { color: '#a855f7', label: 'Completed', bg: '#a855f720' },
};

export default function ShowBuilderPage() {
  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Top nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-6 gap-3">
        <Link href="/" className="font-black text-lg tracking-tight gradient-text-purple mr-4">STAGEFRONT</Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <LayoutDashboard className="w-4 h-4" />Dashboard
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold">Show Builder</span>
        <div className="ml-auto">
          <Link
            href="/show-builder/neural-drift"
            className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-xl relative overflow-hidden"
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #a855f7, #a855f788)' }} />
            <Plus className="w-4 h-4 relative" />
            <span className="relative">New Event</span>
          </Link>
        </div>
      </nav>

      <div className="pt-14 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f720, #a855f710)', border: '1px solid #a855f730' }}>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl">Show Builder</h1>
              <p className="text-slate-500 text-sm">Your collaborative event workspace</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Active Builds', value: '3', icon: Zap, color: '#a855f7' },
            { label: 'Collaborators', value: '8', icon: Users, color: '#06b6d4' },
            { label: 'Events This Month', value: '2', icon: Calendar, color: '#10b981' },
            { label: 'Artists Booked', value: '12', icon: TrendingUp, color: '#f43f5e' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-white font-black text-2xl">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active builds */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">Active Builds</h2>
              <Link href="/show-builder/neural-drift" className="text-purple-400 text-xs hover:text-purple-300 transition-colors flex items-center gap-1">
                New build <Plus className="w-3 h-3" />
              </Link>
            </div>

            {EVENT_BUILDS.map((build) => {
              const statusCfg = STATUS_CONFIG[build.status];
              const totalDraw = build.lineup.reduce((s, sl) => s + sl.artist.draw, 0);
              const pct = Math.round(Math.min(100, (totalDraw * 0.75) / build.venueCapacity * 100));
              return (
                <Link
                  key={build.id}
                  href={`/show-builder/${build.id}`}
                  className="block glass rounded-2xl border border-white/[0.07] hover:border-white/[0.14] transition-all duration-200 group overflow-hidden"
                >
                  <div className="relative h-28 overflow-hidden">
                    <img src={build.coverImage} alt={build.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/90 via-[#060608]/60 to-transparent" />
                    <div className="absolute inset-0 p-4 flex items-end">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                          >
                            {statusCfg.label}
                          </span>
                          {build.collaborators.some((c) => c.viewing) && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Live
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-black text-xl">{build.name}</h3>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: build.accentColor, boxShadow: `0 0 8px ${build.accentColor}` }} />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{build.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{build.venue}, {build.venueCity}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{build.lineup.length} artists</span>
                    </div>

                    {/* Lineup avatars */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {build.lineup.slice(0, 5).map((slot) => (
                          <img
                            key={slot.id}
                            src={slot.artist.image}
                            alt={slot.artist.name}
                            className="w-7 h-7 rounded-lg object-cover border-2 border-[#060608]"
                          />
                        ))}
                        {build.lineup.length > 5 && (
                          <div className="w-7 h-7 rounded-lg bg-white/[0.05] border-2 border-[#060608] flex items-center justify-center">
                            <span className="text-[9px] text-slate-400 font-bold">+{build.lineup.length - 5}</span>
                          </div>
                        )}
                      </div>

                      {/* Capacity fill */}
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                          <span>Est. fill rate</span>
                          <span style={{ color: build.accentColor }}>{pct}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: build.accentColor }} />
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    </div>

                    {/* Collaborator presence */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <div className="flex -space-x-1.5">
                        {build.collaborators.map((c) => (
                          <div key={c.id} className="relative">
                            <img src={c.image} alt={c.name} className="w-5 h-5 rounded-full object-cover border border-[#060608]" />
                            {c.viewing && <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-[#060608]" />}
                          </div>
                        ))}
                      </div>
                      <span className="text-slate-600 text-[10px]">
                        {build.collaborators.filter((c) => c.viewing).length} viewing now
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Collaboration invites */}
            <div className="glass rounded-2xl border border-white/[0.07]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-bold text-sm">Invites</h3>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">2</span>
              </div>
              <div className="p-3 space-y-2.5">
                {[
                  { event: 'VOID CIRCUIT', from: 'Jess Okafor', role: 'Promoter', color: '#f43f5e', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80' },
                  { event: 'PHASE SHIFT', from: 'Marcus Bell', role: 'Venue Booker', color: '#06b6d4', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
                ].map((inv) => (
                  <div key={inv.event} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: inv.color }} />
                      <span className="text-white font-bold text-xs">{inv.event}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={inv.image} alt={inv.from} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-slate-500 text-[10px]">{inv.from} · {inv.role}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-white relative overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundColor: inv.color }} />
                        <span className="relative">Accept</span>
                      </button>
                      <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-slate-400 border border-white/[0.08] hover:text-white transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass rounded-2xl border border-white/[0.07]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-white font-bold text-sm">Activity</h3>
              </div>
              <div className="p-3 space-y-3">
                {[
                  { text: 'LUX confirmed headliner slot for NEURAL DRIFT', time: '12m', color: '#c026d3' },
                  { text: 'Jess approved the lineup for NEURAL DRIFT', time: '1h', color: '#10b981' },
                  { text: 'KIRA SÓLARIS invited to SIGNAL COLLAPSE', time: '3h', color: '#06b6d4' },
                  { text: 'DARK MATTER vol.4 confirmed at Schuba\'s', time: '1d', color: '#f43f5e' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-1 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color, minHeight: '1rem' }} />
                    <div className="min-w-0">
                      <p className="text-slate-400 text-[11px] leading-relaxed">{item.text}</p>
                      <p className="text-slate-700 text-[10px] mt-0.5">{item.time} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue open slots teaser */}
            <div className="glass rounded-2xl border border-white/[0.07]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-bold text-sm">Open Venue Slots</h3>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { venue: 'The Blind Pig', date: 'Jun 28', type: 'Full Night', cap: 300 },
                  { venue: 'Smart Bar', date: 'Jul 5', type: 'Late Night', cap: 200 },
                  { venue: 'Subterranean', date: 'Jul 19', type: 'Full Night', cap: 400 },
                ].map((slot) => (
                  <div key={slot.venue + slot.date} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="text-center w-10">
                      <div className="text-white font-bold text-xs">{slot.date.split(' ')[1]}</div>
                      <div className="text-slate-600 text-[10px]">{slot.date.split(' ')[0]}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-xs font-semibold">{slot.venue}</div>
                      <div className="text-slate-600 text-[10px]">{slot.type} · {slot.cap} cap.</div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

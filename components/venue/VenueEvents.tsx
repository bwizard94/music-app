'use client';

import { useState } from 'react';
import { CalendarDays, Clock, Users, Ticket, Zap, ChevronRight, MapPin, TrendingUp } from 'lucide-react';
import type { VenueData } from './venueData';

interface Props { venue: VenueData; onBook: () => void; }

export default function VenueEvents({ venue, onBook }: Props) {
  const [activeView, setActiveView] = useState<'upcoming' | 'slots' | 'history'>('upcoming');
  const color = venue.accentColor;

  return (
    <div className="space-y-5">
      {/* View switcher */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit border border-white/[0.06]">
        {([
          { id: 'upcoming', label: 'Upcoming Events' },
          { id: 'slots', label: 'Open Slots' },
          { id: 'history', label: 'Past Events' },
        ] as const).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={
              activeView === id
                ? { backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }
                : { color: '#64748b' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Upcoming Events ──────────────────────────────────────────── */}
      {activeView === 'upcoming' && (
        <div className="space-y-4">
          {/* Featured event */}
          {venue.upcomingEvents.filter((e) => e.featured).map((event) => {
            const pct = Math.round((event.ticketsSold / event.capacity) * 100);
            return (
              <div key={event.id} className="group cursor-pointer">
                <div className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img src={event.image} alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="glass rounded-full px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                        ✦ Featured Night
                      </span>
                    </div>
                    <div
                      className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
                    >
                      {event.status}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-black text-2xl tracking-tight mb-1">{event.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {event.artists.map((a) => (
                          <span key={a} className="glass rounded px-2 py-0.5 text-xs text-slate-300">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-3 h-3" />{event.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{event.time}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3 h-3" />{event.genres}</span>
                      <span className="flex items-center gap-1.5"><Ticket className="w-3 h-3" />{event.price}</span>
                    </div>

                    {/* Ticket progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">{event.ticketsSold} / {event.capacity} sold</span>
                        <span className="font-semibold" style={{ color }}>{pct}% filled</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a href={event.ticketUrl}
                        className="flex-1 relative font-semibold text-white py-2.5 rounded-xl text-sm text-center overflow-hidden group/btn">
                        <div className="absolute inset-0 transition-all duration-500"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
                        <span className="relative flex items-center justify-center gap-2">
                          <Ticket className="w-4 h-4" />Get Tickets
                        </span>
                      </a>
                      <button className="glass rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors border border-white/[0.07] hover:border-white/[0.14]">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Other events list */}
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h3 className="text-white font-bold text-sm">Coming Up</h3>
              <span className="text-slate-500 text-xs">{venue.upcomingEvents.length} events scheduled</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {venue.upcomingEvents.filter((e) => !e.featured).map((event) => {
                const pct = Math.round((event.ticketsSold / event.capacity) * 100);
                const almostSold = pct >= 70;
                return (
                  <div key={event.id} className="flex gap-4 p-5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={event.image} alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-semibold text-sm leading-tight">{event.title}</h4>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={almostSold
                            ? { backgroundColor: '#f43f5e20', color: '#f43f5e' }
                            : { backgroundColor: `${color}12`, color }
                          }
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {event.artists.slice(0, 2).map((a) => (
                          <span key={a} className="text-[11px] text-slate-500 bg-white/[0.04] rounded px-1.5 py-0.5">{a}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                        <span>{event.date}</span>
                        <span>·</span>
                        <span>{event.genres}</span>
                        <span>·</span>
                        <span className="font-semibold text-white">{event.price}</span>
                      </div>

                      {/* Mini progress */}
                      <div className="h-0.5 bg-white/[0.05] rounded-full max-w-32">
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: almostSold ? '#f43f5e' : color }} />
                      </div>
                      <span className="text-[10px] text-slate-600">{pct}% sold</span>
                    </div>

                    <a href={event.ticketUrl}
                      className="flex-shrink-0 self-center flex items-center gap-1.5 glass rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.07] hover:border-white/[0.16] transition-all">
                      <Ticket className="w-3 h-3" />
                      Tickets
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Open Slots ───────────────────────────────────────────────── */}
      {activeView === 'slots' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-5 border relative overflow-hidden"
            style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(192,38,211,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(192,38,211,0.15) 1px, transparent 1px)`,
              backgroundSize: '40px 40px', opacity: 0.3,
            }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  {venue.openSlots.length} Dates Available
                </h3>
                <p className="text-slate-400 text-sm">
                  Submit a booking proposal for any open date. Response within 72 hours.
                </p>
              </div>
              <button
                onClick={onBook}
                className="relative font-bold text-white px-6 py-3 rounded-xl overflow-hidden flex-shrink-0 text-sm"
              >
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
                <span className="relative flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-white" />
                  Submit Proposal
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {venue.openSlots.map((slot) => (
              <div
                key={slot.date}
                className="glass rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.14] transition-all group cursor-pointer card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-bold text-base">{slot.date}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{slot.type}</div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}25` }}
                  >
                    Open
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {slot.available.map((room) => (
                    <span key={room} className="text-xs text-slate-400 glass rounded px-2 py-0.5 border border-white/[0.06]">
                      {room}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onBook}
                  className="w-full text-xs font-semibold py-2 rounded-lg border transition-all hover:bg-white/10"
                  style={{ borderColor: `${color}30`, color }}
                >
                  Request This Date →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Past Events ──────────────────────────────────────────────── */}
      {activeView === 'history' && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Events (All Time)', value: `${venue.stats.eventsPerMonth * 12 * venue.stats.yearsActive}+`, icon: CalendarDays },
              { label: 'Artists Hosted', value: `${venue.stats.artistsHosted}+`, icon: Users },
              { label: 'Avg Occupancy', value: venue.analytics.avgOccupancy, icon: TrendingUp },
              { label: 'Tickets Sold', value: `${(venue.stats.ticketsSold / 1000).toFixed(0)}K`, icon: Ticket },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-xl p-4 border border-white/[0.07] text-center">
                <Icon className="w-4 h-4 mx-auto mb-2" style={{ color }} />
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-slate-600 text-xs">{label}</div>
              </div>
            ))}
          </div>

          {/* Monthly history */}
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <CalendarDays className="w-4 h-4" style={{ color }} />
              <h3 className="text-white font-bold text-sm">Recent History</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {venue.pastEvents.map((month) => (
                <div key={month.month} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold text-sm">{month.month}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}12`, color }}>
                      {month.count} events
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {month.highlights.map((h) => (
                      <span key={h} className="text-xs text-slate-500 glass rounded-lg px-2.5 py-1 border border-white/[0.05]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notable bookings */}
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <Zap className="w-4 h-4" style={{ color }} />
              <h3 className="text-white font-bold text-sm">Notable International Bookings</h3>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {venue.notableBookings.map((artist) => (
                <div key={artist.name}
                  className="glass rounded-xl p-3 text-center border border-white/[0.05] hover:border-white/[0.12] transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${color}12`, border: `1px solid ${color}22` }}>
                    <Users className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="text-white font-semibold text-xs">{artist.name}</div>
                  <div className="text-slate-600 text-[11px]">{artist.origin}</div>
                  <div className="text-slate-700 text-[10px] mt-0.5">{artist.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

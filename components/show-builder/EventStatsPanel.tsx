'use client';

import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Zap, MessageSquare, CheckCircle2, XCircle, Clock3, Building2, Send, Lightbulb } from 'lucide-react';
import type { LineupSlot, EventBuild, Artist } from './showData';
import { estimateTurnout, ARTIST_POOL, getCompatibility } from './showData';

interface Props {
  event: EventBuild;
  lineup: LineupSlot[];
  accentColor: string;
}

export default function EventStatsPanel({ event, lineup, accentColor }: Props) {
  const [activeSection, setActiveSection] = useState<'stats' | 'collab' | 'pitch'>('stats');
  const turnout = estimateTurnout(lineup, event.venueCapacity);

  const pctColor = turnout.pct >= 85 ? '#10b981' : turnout.pct >= 60 ? '#f59e0b' : '#64748b';

  const suggestions = ARTIST_POOL
    .filter((a) => !lineup.some((s) => s.artist.id === a.id))
    .map((a) => ({ ...a, compat: getCompatibility(a, lineup) }))
    .sort((a, b) => b.compat - a.compat)
    .slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b border-white/[0.06]">
        {([['stats', 'Stats'], ['collab', 'Team'], ['pitch', 'Pitch']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className="flex-1 py-3 text-xs font-semibold transition-colors relative"
            style={{ color: activeSection === id ? accentColor : '#64748b' }}
          >
            {label}
            {activeSection === id && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSection === 'stats' && (
          <>
            {/* Turnout prediction */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07] space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Turnout Prediction</span>
              </div>
              {lineup.length === 0 ? (
                <p className="text-slate-600 text-xs">Add artists to see turnout estimate</p>
              ) : (
                <>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black" style={{ color: pctColor }}>{turnout.pct}%</div>
                      <div className="text-slate-500 text-xs">of {event.venueCapacity} capacity</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{turnout.mid}</div>
                      <div className="text-slate-600 text-xs">est. attendees</div>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${turnout.pct}%`, backgroundColor: pctColor }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Low: {turnout.low}</span>
                    <span>Mid: {turnout.mid}</span>
                    <span>High: {turnout.high}</span>
                  </div>

                  {/* Per-artist draw breakdown */}
                  <div className="space-y-2 pt-1 border-t border-white/[0.05]">
                    {lineup.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: slot.artist.accentColor }} />
                        <span className="text-slate-500 text-[10px] flex-1 truncate">{slot.artist.name}</span>
                        <span className="text-slate-400 text-[10px] font-bold tabular-nums">~{slot.artist.draw}</span>
                        <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${(slot.artist.draw / 350) * 100}%`, backgroundColor: slot.artist.accentColor }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Revenue estimate */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold text-sm">Revenue Estimate</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Ticket Rev', value: event.estimatedRevenue },
                  { label: 'Ticket Price', value: event.ticketPrice },
                  { label: 'Artist Fees', value: `$${lineup.reduce((s, sl) => s + (parseInt(sl.fee.replace(/\D/g, '') || '0')), 0).toLocaleString()}+` },
                  { label: 'Capacity', value: `${event.venueCapacity} cap.` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-slate-600 text-[10px] mb-0.5">{label}</div>
                    <div className="text-white font-bold text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience overlap */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Audience Overlap</span>
              </div>
              {lineup.length < 2 ? (
                <p className="text-slate-600 text-xs">Add 2+ artists to see overlap</p>
              ) : (
                <div className="space-y-2">
                  {lineup.map((slot, i) => {
                    const others = lineup.filter((_, j) => j !== i);
                    const overlapPct = Math.round(
                      (slot.artist.genres.filter((g) =>
                        others.some((o) => o.artist.genres.includes(g))
                      ).length / slot.artist.genres.length) * 100
                    );
                    return (
                      <div key={slot.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-500 text-[10px]">{slot.artist.name}</span>
                          <span className="text-slate-400 text-[10px] font-bold">{overlapPct}% shared audience</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${overlapPct}%`, backgroundColor: slot.artist.accentColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Smart Suggestions */}
            {lineup.length > 0 && suggestions.length > 0 && (
              <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold text-sm">Smart Picks</span>
                  <span className="text-slate-600 text-[10px] ml-auto">AI-matched</span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <img src={a.image} alt={a.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-xs truncate">{a.name}</div>
                        <div className="text-slate-600 text-[10px] truncate">{a.city} · {a.genres[0]}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 text-[10px] font-bold">{a.compat}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === 'collab' && (
          <>
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Collaborators</span>
                <span
                  className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
                >
                  {event.collaborators.filter((c) => c.viewing).length} online
                </span>
              </div>
              <div className="space-y-2.5">
                {event.collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={collab.image} alt={collab.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#060608] ${collab.viewing ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold">{collab.name}</div>
                      <div className="text-slate-600 text-[10px]">{collab.role}</div>
                    </div>
                    <div>
                      {collab.approved
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : <Clock3 className="w-4 h-4 text-slate-600" />
                      }
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                Invite Collaborator
              </button>
            </div>

            {/* Approval status */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold text-sm">Lineup Approvals</span>
              </div>
              <div className="space-y-2">
                {lineup.map((slot) => {
                  const approvedCount = Math.floor(Math.random() * event.collaborators.length + 1);
                  return (
                    <div key={slot.id} className="flex items-center gap-2">
                      <img src={slot.artist.image} alt={slot.artist.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-slate-400 text-xs flex-1 truncate">{slot.artist.name}</span>
                      <div className="flex -space-x-1.5">
                        {event.collaborators.map((c, ci) => (
                          <div key={c.id} className="w-5 h-5 rounded-full border border-[#060608] overflow-hidden"
                            style={{ opacity: ci < approvedCount ? 1 : 0.2 }}>
                            <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {lineup.length === 0 && <p className="text-slate-600 text-xs">No artists in lineup yet</p>}
              </div>
            </div>

            {/* Activity */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Activity</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: event.collaborators[0]?.name, action: 'confirmed the headliner slot', time: '2m ago', color: '#10b981' },
                  { name: event.collaborators[1]?.name, action: 'added a note to the opener', time: '14m ago', color: '#06b6d4' },
                  { name: 'You', action: 'updated the set times', time: '1h ago', color: accentColor },
                ].filter((a) => a.name).map((item, i) => (
                  <div key={i} className="flex gap-2.5 text-xs">
                    <div className="w-1 flex-shrink-0 rounded-full mt-1" style={{ backgroundColor: item.color, minHeight: '1rem' }} />
                    <div>
                      <span className="text-white font-semibold">{item.name}</span>
                      <span className="text-slate-500"> {item.action}</span>
                      <div className="text-slate-700 mt-0.5 text-[10px]">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'pitch' && (
          <>
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Venue Status</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{event.venue}</div>
                  <div className="text-slate-500 text-xs">{event.venueCity} · {event.venueCapacity} cap.</div>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-full capitalize"
                    style={{
                      backgroundColor: event.status === 'confirmed' ? '#10b98120' : event.status === 'pitching' ? '#f59e0b20' : '#64748b20',
                      color: event.status === 'confirmed' ? '#10b981' : event.status === 'pitching' ? '#f59e0b' : '#64748b',
                    }}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Pitch to Venues</span>
              </div>
              <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                Your current lineup has an estimated draw of <strong className="text-white">{estimateTurnout(lineup, event.venueCapacity).mid}</strong> attendees.
                Pitch to venues that match your capacity needs.
              </p>
              <div className="space-y-2">
                {[
                  { name: 'The Blind Pig', city: 'Chicago', cap: 300, match: 92 },
                  { name: 'Smart Bar', city: 'Chicago', cap: 200, match: 78 },
                  { name: 'Schuba\'s Tavern', city: 'Chicago', cap: 250, match: 85 },
                  { name: 'Subterranean', city: 'Chicago', cap: 400, match: 66 },
                ].map((v) => (
                  <div key={v.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.12] transition-colors group">
                    <div className="flex-1">
                      <div className="text-white text-xs font-semibold">{v.name}</div>
                      <div className="text-slate-600 text-[10px]">{v.city} · {v.cap} cap.</div>
                    </div>
                    <div className="text-emerald-400 text-[10px] font-bold">{v.match}% fit</div>
                    <button
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all opacity-0 group-hover:opacity-100"
                      style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}10` }}
                    >
                      Pitch
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch preview */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-white font-bold text-sm">Pitch Preview</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Event Name</span>
                  <span className="text-slate-300 font-medium">{event.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Proposed Date</span>
                  <span className="text-slate-300 font-medium">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Artists</span>
                  <span className="text-slate-300 font-medium">{lineup.length} confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Est. Draw</span>
                  <span className="text-slate-300 font-medium">{estimateTurnout(lineup, event.venueCapacity).mid} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ticket Price</span>
                  <span className="text-slate-300 font-medium">{event.ticketPrice}</span>
                </div>
              </div>
              <button
                className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-white relative overflow-hidden"
              >
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }} />
                <span className="relative flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Send Pitch Package
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

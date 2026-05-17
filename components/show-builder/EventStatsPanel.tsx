'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, DollarSign, Zap, MessageSquare, CheckCircle2, XCircle,
  Clock3, Building2, Send, Lightbulb, AlertTriangle, BarChart3,
  Megaphone, Eye, ClipboardCheck, Plus, Check, ChevronDown,
} from 'lucide-react';
import type { LineupSlot, EventBuild, Artist } from './showData';
import { estimateTurnout, ARTIST_POOL, getCompatibility } from './showData';
import {
  getGenreFit, getVenueFit, getPromoStrength, getOverallScore,
  getRiskWarnings, getMissingPieces,
} from '@/lib/utils';

interface Props {
  event: EventBuild;
  lineup: LineupSlot[];
  accentColor: string;
}

// ─── Crew Data ────────────────────────────────────────────────────────────────

interface CrewMember { name: string; image: string; credits: string; }

const CREW_ROLES: { key: string; label: string; members: CrewMember[] }[] = [
  {
    key: 'sound',
    label: 'Sound Engineer',
    members: [
      { name: 'Dev Shin', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', credits: '47 shows' },
      { name: 'Camille Roy', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', credits: '23 shows' },
      { name: 'Nico Watts', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', credits: '31 shows' },
    ],
  },
  {
    key: 'lighting',
    label: 'Lighting Designer',
    members: [
      { name: 'Ryo Tanaka', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', credits: '29 shows' },
      { name: 'Simone K.', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80', credits: '14 shows' },
      { name: 'Marcus R.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', credits: '52 shows' },
    ],
  },
  {
    key: 'photo',
    label: 'Photographer',
    members: [
      { name: 'Priya N.', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80', credits: '88 events' },
      { name: 'Aaliyah Cross', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80', credits: '62 events' },
      { name: 'Tom Bauer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', credits: '41 events' },
    ],
  },
  {
    key: 'video',
    label: 'Videographer',
    members: [
      { name: 'Sofia Ren', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', credits: '19 shows' },
      { name: 'Jess Okafor', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', credits: '35 shows' },
      { name: 'Tomas V.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', credits: '28 shows' },
    ],
  },
  {
    key: 'design',
    label: 'Graphic Designer',
    members: [
      { name: 'Zara Patel', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', credits: '103 designs' },
      { name: 'Felix Huang', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', credits: '76 designs' },
      { name: 'Maya L.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', credits: '51 designs' },
    ],
  },
  {
    key: 'promo',
    label: 'Promoter',
    members: [
      { name: 'Dana Cruz', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', credits: '67 events' },
      { name: 'Jake Moss', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', credits: '44 events' },
      { name: 'Lin Wei', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', credits: '38 events' },
    ],
  },
];

// ─── Score color helper ───────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#a855f7';
  return '#f43f5e';
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, color, size = 96 }: { score: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-xl border" style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}>
      <div className="text-[10px] text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-black" style={{ color }}>{value}</div>
      <div className="h-1 rounded-full bg-white/[0.06] mt-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EventStatsPanel({ event, lineup, accentColor }: Props) {
  const [activeSection, setActiveSection] = useState<'intel' | 'crew' | 'promo' | 'preview' | 'submit'>('intel');
  const [crewAssignments, setCrewAssignments] = useState<Record<string, CrewMember | null>>({});
  const [crewOpenRole, setCrewOpenRole] = useState<string | null>(null);
  const [promoChannels, setPromoChannels] = useState<Record<string, boolean>>({
    instagram: true,
    facebook: true,
    ra: true,
    stagefront: true,
    email: true,
    print: false,
    paid: false,
  });
  const [artworkStatus, setArtworkStatus] = useState<'not-started' | 'in-progress' | 'ready'>('not-started');
  const [submitted, setSubmitted] = useState(false);

  const turnout = estimateTurnout(lineup, event.venueCapacity);

  const genreFit = getGenreFit(lineup);
  const venueFit = getVenueFit(lineup, event.venueCapacity);
  const promoStrength = getPromoStrength(lineup);
  const overallScore = getOverallScore(lineup, event.venueCapacity);
  const riskWarnings = getRiskWarnings(lineup, event.venueCapacity);
  const missingPieces = getMissingPieces(lineup);
  const overallColor = scoreColor(overallScore);

  const suggestions = ARTIST_POOL
    .filter((a) => !lineup.some((s) => s.artist.id === a.id))
    .map((a) => ({ ...a, compat: getCompatibility(a, lineup) }))
    .sort((a, b) => b.compat - a.compat)
    .slice(0, 3);

  const totalFees = lineup.reduce((s, sl) => {
    const num = parseInt(sl.fee.replace(/[^\d]/g, '') || '0');
    return s + num;
  }, 0);

  const TABS = [
    { id: 'intel' as const, label: 'Intel', icon: BarChart3 },
    { id: 'crew' as const, label: 'Crew', icon: Users },
    { id: 'promo' as const, label: 'Promo', icon: Megaphone },
    { id: 'preview' as const, label: 'Preview', icon: Eye },
    { id: 'submit' as const, label: 'Submit', icon: ClipboardCheck },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b border-white/[0.06] overflow-x-auto flex-shrink-0">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className="flex-1 py-3 text-xs font-semibold transition-colors relative whitespace-nowrap px-1 min-w-0"
            style={{ color: activeSection === id ? accentColor : '#64748b' }}
          >
            {label}
            {activeSection === id && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ─── INTEL TAB ──────────────────────────────────────────────────── */}
        {activeSection === 'intel' && (
          <>
            {/* Score Ring */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={overallScore} color={overallColor} size={96} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: overallColor }}>{overallScore}</span>
                    <span className="text-[9px] text-slate-500 text-center leading-tight">Score</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-0.5">Show Score</div>
                  {lineup.length === 0 ? (
                    <p className="text-slate-600 text-xs leading-relaxed">Add artists to build your score</p>
                  ) : (
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Based on genre fit, venue fill, promo reach, and artist compatibility.
                    </p>
                  )}
                </div>
              </div>

              {/* 2x2 metric grid */}
              {lineup.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <MetricCard label="Genre Fit" value={genreFit} color={scoreColor(genreFit)} />
                  <MetricCard label="Venue Fit" value={venueFit} color={scoreColor(venueFit)} />
                  <MetricCard label="Promo Strength" value={promoStrength} color={scoreColor(promoStrength)} />
                  <MetricCard label="Audience Fill" value={turnout.pct} color={scoreColor(turnout.pct)} />
                </div>
              )}
            </div>

            {/* Risk Warnings */}
            {riskWarnings.length > 0 && (
              <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold text-sm">Risk Flags</span>
                </div>
                <div className="space-y-2">
                  {riskWarnings.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                      style={w.level === 'critical'
                        ? { backgroundColor: '#f43f5e12', border: '1px solid #f43f5e28', color: '#f43f5e' }
                        : { backgroundColor: '#f59e0b10', border: '1px solid #f59e0b28', color: '#f59e0b' }
                      }
                    >
                      <span>{w.level === 'critical' ? '✗' : '⚠'}</span>
                      <span>{w.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Pieces */}
            {missingPieces.length > 0 && (
              <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-bold text-sm">Suggested Additions</span>
                </div>
                <div className="space-y-1.5">
                  {missingPieces.map((piece, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-purple-300">
                      <span className="mt-0.5 text-purple-500">•</span>
                      <span>{piece}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audience Breakdown */}
            {lineup.length >= 2 && (
              <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold text-sm">Audience Overlap</span>
                </div>
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
                          <span className="text-slate-400 text-[10px] font-bold">{overlapPct}% shared</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${overlapPct}%`, backgroundColor: slot.artist.accentColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Draw breakdown */}
                <div className="space-y-2 pt-3 mt-1 border-t border-white/[0.05]">
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
              </div>
            )}

            {/* Smart Picks */}
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

            {/* Turnout + Revenue */}
            {lineup.length > 0 && (
              <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" style={{ color: accentColor }} />
                  <span className="text-white font-bold text-sm">Turnout & Revenue</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="text-3xl font-black" style={{ color: scoreColor(turnout.pct) }}>{turnout.pct}%</div>
                    <div className="text-slate-500 text-xs">of {event.venueCapacity} capacity</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{turnout.mid}</div>
                    <div className="text-slate-600 text-xs">est. attendees</div>
                  </div>
                </div>
                <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, turnout.pct)}%`, backgroundColor: scoreColor(turnout.pct) }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>Low: {turnout.low}</span>
                  <span>Mid: {turnout.mid}</span>
                  <span>High: {turnout.high}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                  {[
                    { label: 'Ticket Rev', value: event.estimatedRevenue },
                    { label: 'Ticket Price', value: event.ticketPrice },
                    { label: 'Artist Fees', value: `$${totalFees.toLocaleString()}+` },
                    { label: 'Capacity', value: `${event.venueCapacity} cap.` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="text-slate-600 text-[10px] mb-0.5">{label}</div>
                      <div className="text-white font-bold text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── CREW TAB ───────────────────────────────────────────────────── */}
        {activeSection === 'crew' && (
          <>
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Production Crew</span>
              </div>
              <div className="space-y-2">
                {CREW_ROLES.map((role) => {
                  const assigned = crewAssignments[role.key];
                  const isOpen = crewOpenRole === role.key;
                  return (
                    <div key={role.key} className="relative">
                      {assigned ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03]">
                          <img src={assigned.image} alt={assigned.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-semibold truncate">{assigned.name}</div>
                            <div className="text-slate-600 text-[10px]">{role.label} · {assigned.credits}</div>
                          </div>
                          <button
                            onClick={() => setCrewAssignments((prev) => ({ ...prev, [role.key]: null }))}
                            className="text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCrewOpenRole(isOpen ? null : role.key)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-dashed transition-all text-left"
                          style={{
                            borderColor: isOpen ? `${accentColor}40` : 'rgba(255,255,255,0.07)',
                            backgroundColor: isOpen ? `${accentColor}06` : 'transparent',
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg border border-dashed border-white/10 flex items-center justify-center bg-white/[0.02] flex-shrink-0">
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-400 text-xs font-medium">Add {role.label}</div>
                          </div>
                          <ChevronDown
                            className="w-3.5 h-3.5 text-slate-600 transition-transform flex-shrink-0"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>
                      )}

                      {/* Dropdown picker */}
                      {isOpen && !assigned && (
                        <div className="mt-1 rounded-xl border border-white/[0.1] bg-[#0c0c16] overflow-hidden shadow-xl z-20 relative">
                          {role.members.map((member) => (
                            <button
                              key={member.name}
                              onClick={() => {
                                setCrewAssignments((prev) => ({ ...prev, [role.key]: member }));
                                setCrewOpenRole(null);
                              }}
                              className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.05] last:border-0"
                            >
                              <img src={member.image} alt={member.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-xs font-semibold">{member.name}</div>
                                <div className="text-slate-600 text-[10px]">{member.credits}</div>
                              </div>
                              <Check className="w-3.5 h-3.5 text-slate-700" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collaborators section */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
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
              <button className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Invite Collaborator
              </button>
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

        {/* ─── PROMO TAB ──────────────────────────────────────────────────── */}
        {activeSection === 'promo' && (
          <>
            {/* Channels */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Promo Channels</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { key: 'instagram', label: 'Instagram / Stories' },
                  { key: 'facebook', label: 'Facebook Event Page' },
                  { key: 'ra', label: 'Resident Advisor listing' },
                  { key: 'stagefront', label: 'Platform Feature (Stagefront)' },
                  { key: 'email', label: 'Email Newsletter' },
                  { key: 'print', label: 'Print / Flyering' },
                  { key: 'paid', label: 'Paid Social Ads' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setPromoChannels((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
                      style={promoChannels[key]
                        ? { backgroundColor: accentColor, borderColor: accentColor }
                        : { borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' }
                      }
                    >
                      {promoChannels[key] && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs" style={{ color: promoChannels[key] ? '#e2e8f0' : '#64748b' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <Clock3 className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Promo Timeline</span>
              </div>
              <div className="space-y-0">
                {[
                  { time: '6 weeks out', action: 'Lock lineup & announce save the date' },
                  { time: '4 weeks out', action: 'Release artist content & ticket sales' },
                  { time: '2 weeks out', action: 'Social push + paid promotion' },
                  { time: '1 week out', action: 'Final push, stories, countdowns' },
                  { time: 'Day of', action: 'Live coverage, check-ins' },
                ].map((item, i, arr) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                      {i < arr.length - 1 && <div className="w-px flex-1 my-1" style={{ backgroundColor: `${accentColor}30` }} />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <div className="text-[10px] font-bold mb-0.5" style={{ color: accentColor }}>{item.time}</div>
                      <div className="text-slate-400 text-xs">{item.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Strength Meter */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">Promo Strength</span>
                <span className="text-2xl font-black" style={{ color: scoreColor(promoStrength) }}>{promoStrength}</span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${promoStrength}%`, backgroundColor: scoreColor(promoStrength) }}
                />
              </div>
              <p className="text-slate-600 text-[10px]">
                {promoStrength < 50
                  ? 'Add more verified artists to increase promo reach'
                  : promoStrength < 75
                  ? 'Good reach — a verified headliner could push this higher'
                  : 'Strong promo potential — your lineup has solid social reach'
                }
              </p>
            </div>

            {/* Artwork Status */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-white font-bold text-sm">Flyer / Artwork</span>
                {artworkStatus === 'ready' && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
              </div>
              <div className="flex gap-2">
                {(['not-started', 'in-progress', 'ready'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setArtworkStatus(s)}
                    className="flex-1 text-[10px] py-1.5 rounded-lg border transition-all font-medium"
                    style={artworkStatus === s
                      ? { backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}40` }
                      : { color: '#475569', borderColor: 'rgba(255,255,255,0.07)' }
                    }
                  >
                    {s === 'not-started' ? 'Not Started' : s === 'in-progress' ? 'In Progress' : 'Ready'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── PREVIEW TAB ────────────────────────────────────────────────── */}
        {activeSection === 'preview' && (
          <>
            <div className="mb-1">
              <p className="text-slate-500 text-xs">How this looks to a venue</p>
            </div>

            {/* Pitch card */}
            <div className="rounded-2xl border border-white/[0.1] overflow-hidden" style={{ backgroundColor: '#0a0a10' }}>
              {/* Header bar */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)` }} />
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{event.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{event.tagline}</p>
                </div>

                {/* Event meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-slate-600" />{event.date}</span>
                  <span className="flex items-center gap-1"><Clock3 className="w-3 h-3 text-slate-600" />Doors {event.doorsTime} — {event.endTime}</span>
                </div>

                {/* Lineup summary */}
                {lineup.length > 0 && (
                  <div>
                    <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Lineup</div>
                    <div className="flex -space-x-2 mb-2">
                      {lineup.slice(0, 5).map((s) => (
                        <img key={s.id} src={s.artist.image} alt={s.artist.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-[#0a0a10]" />
                      ))}
                      {lineup.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-white/[0.08] border-2 border-[#0a0a10] flex items-center justify-center">
                          <span className="text-[9px] text-slate-400 font-bold">+{lineup.length - 5}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {lineup.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-xs">
                          <div className="w-1 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.artist.accentColor }} />
                          <span className="text-slate-300 font-medium">{s.artist.name}</span>
                          <span className="text-slate-600 capitalize">{s.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(lineup.flatMap((s) => s.artist.genres))).slice(0, 6).map((g) => (
                    <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/[0.07]">{g}</span>
                  ))}
                </div>

                {/* Draw + capacity */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Est. Draw</span>
                    <span className="text-white font-bold">{turnout.mid} / {event.venueCapacity} cap ({turnout.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, turnout.pct)}%`, backgroundColor: accentColor }} />
                  </div>
                </div>

                {/* Revenue + fees */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] text-slate-600 mb-0.5">Est. Revenue</div>
                    <div className="text-white font-bold text-xs">{event.estimatedRevenue}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] text-slate-600 mb-0.5">Artist Fees</div>
                    <div className="text-white font-bold text-xs">${totalFees.toLocaleString()}+</div>
                  </div>
                </div>

                {/* Promo bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-500">Promo Strength</span>
                    <span style={{ color: scoreColor(promoStrength) }}>{promoStrength}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${promoStrength}%`, backgroundColor: scoreColor(promoStrength) }} />
                  </div>
                </div>

                <p className="text-slate-700 text-[10px] text-center pt-1 border-t border-white/[0.05]">This pitch was built on Stagefront</p>
              </div>
            </div>

            {/* Venue match list */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-white font-bold text-sm">Venue Matches</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'The Blind Pig', city: 'Chicago', cap: 300 },
                  { name: 'Smart Bar', city: 'Chicago', cap: 200 },
                  { name: "Schuba's Tavern", city: 'Chicago', cap: 250 },
                  { name: 'Subterranean', city: 'Chicago', cap: 400 },
                ].map((v) => {
                  const vFit = getVenueFit(lineup, v.cap);
                  return (
                    <div key={v.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.12] transition-colors group">
                      <div className="flex-1">
                        <div className="text-white text-xs font-semibold">{v.name}</div>
                        <div className="text-slate-600 text-[10px]">{v.city} · {v.cap} cap.</div>
                      </div>
                      <div className="text-xs font-bold" style={{ color: scoreColor(vFit) }}>{vFit}% fit</div>
                      <button
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all opacity-0 group-hover:opacity-100"
                        style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}10` }}
                      >
                        Pitch
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ─── SUBMIT TAB ─────────────────────────────────────────────────── */}
        {activeSection === 'submit' && (
          <>
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: '#10b98120', border: '2px solid #10b98140' }}>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">Proposal Submitted!</h3>
                  <p className="text-slate-500 text-sm mt-1">The venue will review your pitch within 48 hours.</p>
                </div>
                <Link
                  href="/venue/proposals"
                  className="text-xs font-semibold px-4 py-2 rounded-xl border transition-all"
                  style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}10` }}
                >
                  View in Proposals
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-white font-bold text-base">Ready to Submit?</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Review your show before sending to the venue</p>
                </div>

                {/* Review checklist */}
                <div className="glass rounded-2xl p-4 border border-white/[0.07] space-y-3">
                  {(() => {
                    const hasHeadliner = lineup.some((s) => s.role === 'headliner');
                    const confirmedCount = lineup.filter((s) => s.status === 'confirmed').length;
                    const allTimesSet = lineup.every((s) => s.startTime && s.startTime !== '');
                    const venueSelected = !!event.venue;
                    const checks = [
                      { label: 'Event concept defined', ok: !!event.name },
                      { label: 'Lineup has a headliner', ok: hasHeadliner },
                      { label: 'At least 2 artists confirmed', ok: confirmedCount >= 2 },
                      { label: 'All set times assigned', ok: allTimesSet && lineup.length > 0 },
                      { label: 'Venue selected', ok: venueSelected },
                    ];
                    return checks.map(({ label, ok }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: ok ? '#10b98120' : '#f43f5e15', border: `1px solid ${ok ? '#10b98140' : '#f43f5e30'}` }}>
                          {ok
                            ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            : <XCircle className="w-3 h-3 text-rose-400" />
                          }
                        </div>
                        <span className="text-xs" style={{ color: ok ? '#94a3b8' : '#64748b' }}>{label}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* Score summary */}
                <div className="glass rounded-2xl p-4 border border-white/[0.07]">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-3">Score Summary</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Genre', value: genreFit },
                      { label: 'Venue', value: venueFit },
                      { label: 'Promo', value: promoStrength },
                      { label: 'Overall', value: overallScore },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <div className="text-lg font-black" style={{ color: scoreColor(value) }}>{value}</div>
                        <div className="text-[9px] text-slate-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical warnings */}
                {riskWarnings.filter((w) => w.level === 'critical').length > 0 && (
                  <div className="space-y-2">
                    {riskWarnings.filter((w) => w.level === 'critical').map((w, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
                        style={{ backgroundColor: '#f43f5e12', border: '1px solid #f43f5e28', color: '#f43f5e' }}>
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{w.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }} />
                  <span className="relative flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </span>
                </button>

                <button className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all">
                  Save as Draft
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ChevronRight,
  Check,
  CalendarDays,
  Repeat,
  Music2,
  Users,
  X,
  Plus,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { ARTISTS } from '@/lib/data/artists';
import { VENUES } from '@/lib/data/venues';
import {
  GENRE_OPTIONS,
  PROMO_CHANNEL_OPTIONS,
  CREW_ROLES,
  type EventType,
  type DrawConfidence,
  type ProposalLineupArtist,
  type ProposalCollaborator,
} from '@/lib/data/proposals';
import { createProposal } from '@/lib/services/proposals';
import { useAuth } from '@/components/providers/AuthProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProposalDraft {
  // Step 1
  name: string;
  tagline: string;
  eventType: EventType | '';
  genres: string[];
  accentColor: string;
  // Step 2
  venueId: string;
  proposedDate: string;
  doorsTime: string;
  endTime: string;
  dateNotes: string;
  // Step 3
  lineup: ProposalLineupArtist[];
  // Step 4
  collaborators: ProposalCollaborator[];
  // Step 5
  estimatedDraw: number;
  drawConfidence: DrawConfidence;
  drawNotes: string;
  // Step 6
  promoChannels: string[];
  promoTimeline: string;
  promoNotes: string;
  // Step 7
  productionBudget: number;
  marketingBudget: number;
  ticketPrice: string;
  revenueSplit: string;
  budgetNotes: string;
}

const INITIAL_DRAFT: ProposalDraft = {
  name: '',
  tagline: '',
  eventType: '',
  genres: [],
  accentColor: '#a855f7',
  venueId: '',
  proposedDate: '',
  doorsTime: '22:00',
  endTime: '04:00',
  dateNotes: '',
  lineup: [],
  collaborators: [],
  estimatedDraw: 0,
  drawConfidence: 'medium',
  drawNotes: '',
  promoChannels: [],
  promoTimeline: '',
  promoNotes: '',
  productionBudget: 0,
  marketingBudget: 0,
  ticketPrice: '',
  revenueSplit: '',
  budgetNotes: '',
};

const ACCENT_COLORS = [
  '#a855f7',
  '#06b6d4',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#ec4899',
];

const EVENT_TYPES: { id: EventType; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: 'one-night', label: 'One Night', desc: 'Single evening event', Icon: CalendarDays },
  { id: 'residency', label: 'Residency', desc: 'Recurring series slot', Icon: Repeat },
  { id: 'festival-slot', label: 'Festival Slot', desc: 'Multi-stage event', Icon: Music2 },
  { id: 'pop-up', label: 'Pop-Up', desc: 'Surprise / guerrilla show', Icon: Zap },
];

const STEP_LABELS = [
  'Concept',
  'Date & Venue',
  'Lineup',
  'Crew',
  'Draw',
  'Promo',
  'Budget',
  'Review',
  'Submit',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewProposalPage() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProposalDraft>(INITIAL_DRAFT);
  const [artistSearch, setArtistSearch] = useState('');
  const [newCollab, setNewCollab] = useState({ name: '', role: CREW_ROLES[0], email: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done'>('idle');

  const selectedVenue = VENUES.find((v) => v.id === draft.venueId);
  const totalArtistFees = draft.lineup.reduce((s, a) => s + a.fee, 0);
  const totalExpenses = totalArtistFees + draft.productionBudget + draft.marketingBudget;

  function set<K extends keyof ProposalDraft>(key: K, value: ProposalDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleGenre(g: string) {
    setDraft((d) => {
      const has = d.genres.includes(g);
      if (!has && d.genres.length >= 5) return d;
      return { ...d, genres: has ? d.genres.filter((x) => x !== g) : [...d.genres, g] };
    });
  }

  function togglePromoChannel(c: string) {
    setDraft((d) => ({
      ...d,
      promoChannels: d.promoChannels.includes(c)
        ? d.promoChannels.filter((x) => x !== c)
        : [...d.promoChannels, c],
    }));
  }

  function addArtistToLineup(artistId: string) {
    const artist = ARTISTS.find((a) => a.id === artistId);
    if (!artist || draft.lineup.some((l) => l.artistId === artistId)) return;
    const newEntry: ProposalLineupArtist = {
      artistId: artist.id,
      name: artist.name,
      role: 'opener',
      startTime: '22:00',
      duration: 60,
      fee: artist.feeMin,
      image: artist.image,
      accentColor: artist.accentColor,
      genres: artist.genres,
      draw: artist.draw,
    };
    set('lineup', [...draft.lineup, newEntry]);
  }

  function updateLineupEntry(
    artistId: string,
    field: keyof ProposalLineupArtist,
    value: string | number
  ) {
    set(
      'lineup',
      draft.lineup.map((l) => (l.artistId === artistId ? { ...l, [field]: value } : l))
    );
  }

  function removeFromLineup(artistId: string) {
    set('lineup', draft.lineup.filter((l) => l.artistId !== artistId));
  }

  function addCollaborator() {
    if (!newCollab.name.trim()) return;
    const collab: ProposalCollaborator = {
      id: `collab-${Date.now()}`,
      name: newCollab.name.trim().toUpperCase(),
      role: newCollab.role,
      email: newCollab.email || undefined,
      image: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80`,
    };
    set('collaborators', [...draft.collaborators, collab]);
    setNewCollab({ name: '', role: CREW_ROLES[0], email: '' });
  }

  function canProceed(): boolean {
    if (step === 1) return draft.name.trim().length > 0;
    if (step === 2) return draft.venueId !== '' && draft.proposedDate !== '';
    if (step === 3) return draft.lineup.length > 0;
    return true;
  }

  function handleNext() {
    if (step < 9) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!user || !selectedVenue) {
      setSubmitState('loading');
      setTimeout(() => setSubmitState('done'), 2200);
      return;
    }
    setSubmitState('loading');
    try {
      await createProposal({
        submitted_by_id: user.id,
        submitted_by_name: profile?.display_name ?? user.email ?? 'Unknown',
        submitted_by_role: profile?.role ?? 'artist',
        submitted_by_image: profile?.avatar_url ?? null,
        venue_id: selectedVenue.id,
        venue_name: selectedVenue.name,
        venue_city: selectedVenue.city,
        venue_capacity: selectedVenue.capacity,
        name: draft.name,
        tagline: draft.tagline || null,
        genres: draft.genres,
        proposed_date: draft.proposedDate,
        doors_time: draft.doorsTime || null,
        end_time: draft.endTime || null,
        status: 'submitted',
        estimated_draw: draft.estimatedDraw,
        total_artist_fees: totalArtistFees,
        production_budget: draft.productionBudget,
        marketing_budget: draft.marketingBudget,
        ticket_price: draft.ticketPrice || null,
        revenue_split: draft.revenueSplit || null,
        budget_notes: draft.budgetNotes || null,
        accent_color: draft.accentColor,
      });
    } catch {
      // Continue with demo mode if Supabase isn't configured
    }
    setSubmitState('done');
  }

  function handleReset() {
    setDraft(INITIAL_DRAFT);
    setStep(1);
    setSubmitState('idle');
  }

  // Filtered artists for lineup step
  const filteredArtists = ARTISTS.filter((a) => {
    const q = artistSearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  }).slice(0, 12);

  // Capacity fill
  const capacityPct = selectedVenue
    ? Math.min(100, (draft.estimatedDraw / selectedVenue.capacity) * 100)
    : 0;

  // Combined draw estimate for lineup
  const lineupDraw = Math.round(
    draft.lineup.reduce((s, a) => s + a.draw, 0) * 0.75
  );

  // ─── Render Steps ─────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 1:
        return <StepConcept />;
      case 2:
        return <StepDateVenue />;
      case 3:
        return <StepLineup />;
      case 4:
        return <StepCrew />;
      case 5:
        return <StepDraw />;
      case 6:
        return <StepPromo />;
      case 7:
        return <StepBudget />;
      case 8:
        return <StepReview />;
      case 9:
        return <StepSubmit />;
      default:
        return null;
    }
  }

  // ─── Step Components (closures using parent state) ────────────────────────

  function StepConcept() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">What&apos;s the event?</h2>
          <p className="text-slate-400">Start with the concept.</p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Event Name
          </label>
          <input
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. NEURAL DRIFT III"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-2xl font-black text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Tagline or Description
          </label>
          <input
            value={draft.tagline}
            onChange={(e) => set('tagline', e.target.value)}
            placeholder="One line that captures the vibe"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
          />
        </div>

        {/* Event Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Event Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EVENT_TYPES.map(({ id, label, desc, Icon }) => {
              const selected = draft.eventType === id;
              return (
                <button
                  key={id}
                  onClick={() => set('eventType', id)}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all text-left"
                  style={{
                    borderColor: selected ? '#a855f7' : 'rgba(255,255,255,0.08)',
                    background: selected ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <Icon
                    className="w-6 h-6 shrink-0"
                    style={{ color: selected ? '#a855f7' : '#64748b' }}
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Genres */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Genres
            </label>
            <span className="text-xs text-slate-500">{draft.genres.length}/5 selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((g) => {
              const selected = draft.genres.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    borderColor: selected ? '#a855f7' : 'rgba(255,255,255,0.08)',
                    background: selected ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                    color: selected ? '#d8b4fe' : '#64748b',
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Accent Color
          </label>
          <div className="flex gap-3">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => set('accentColor', c)}
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  background: c,
                  boxShadow:
                    draft.accentColor === c
                      ? `0 0 0 3px rgba(255,255,255,0.15), 0 0 12px ${c}60`
                      : undefined,
                  transform: draft.accentColor === c ? 'scale(1.2)' : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function StepDateVenue() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Where and when?</h2>
          <p className="text-slate-400">Pick a venue and propose a date.</p>
        </div>

        {/* Venues */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Venue
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VENUES.map((v) => {
              const selected = draft.venueId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => set('venueId', v.id)}
                  className="relative overflow-hidden rounded-xl border text-left transition-all"
                  style={{
                    borderColor: selected ? v.accentColor : 'rgba(255,255,255,0.08)',
                    boxShadow: selected ? `0 0 16px ${v.accentColor}30` : undefined,
                  }}
                >
                  <img
                    src={v.coverImage}
                    alt={v.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-3 bg-white/[0.04]">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-white">{v.name}</span>
                      {selected && (
                        <Check className="w-4 h-4" style={{ color: v.accentColor }} />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {v.city} · {v.capacity} cap
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2 sm:col-span-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Proposed Date
            </label>
            <input
              type="date"
              value={draft.proposedDate}
              onChange={(e) => set('proposedDate', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Doors
            </label>
            <input
              type="time"
              value={draft.doorsTime}
              onChange={(e) => set('doorsTime', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              End
            </label>
            <input
              type="time"
              value={draft.endTime}
              onChange={(e) => set('endTime', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Date Notes
          </label>
          <textarea
            value={draft.dateNotes}
            onChange={(e) => set('dateNotes', e.target.value)}
            placeholder="Any context about the date choice..."
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>
      </div>
    );
  }

  function StepLineup() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Build your lineup</h2>
          <p className="text-slate-400">Search and add artists to the bill.</p>
        </div>

        {/* Search */}
        <input
          value={artistSearch}
          onChange={(e) => setArtistSearch(e.target.value)}
          placeholder="Search artists by name, role, or city..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
        />

        {/* Artist grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredArtists.map((a) => {
            const added = draft.lineup.some((l) => l.artistId === a.id);
            return (
              <button
                key={a.id}
                onClick={() => !added && addArtistToLineup(a.id)}
                disabled={added}
                className="relative glass rounded-xl p-3 text-left transition-all hover:bg-white/[0.06] disabled:opacity-50"
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                  style={{ background: a.accentColor }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  {added && (
                    <span className="ml-auto">
                      <Check className="w-4 h-4 text-green-400" />
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-white truncate">{a.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{a.role}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-slate-500">{a.city}</span>
                  <span className="text-[10px]" style={{ color: a.accentColor }}>
                    {a.fee}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lineup editor */}
        {draft.lineup.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Your Lineup ({draft.lineup.length})
              </h3>
              <span className="text-xs text-slate-500">
                Combined draw ~{lineupDraw} · ${totalArtistFees.toLocaleString()} total fees
              </span>
            </div>
            <div className="space-y-2">
              {draft.lineup.map((entry) => (
                <div key={entry.artistId} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-1 h-10 rounded-full"
                      style={{ background: entry.accentColor }}
                    />
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-black text-white">{entry.name}</div>
                      <div className="text-xs text-slate-500">{entry.genres.slice(0, 2).join(' · ')}</div>
                    </div>
                    <button
                      onClick={() => removeFromLineup(entry.artistId)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Role</label>
                      <select
                        value={entry.role}
                        onChange={(e) => updateLineupEntry(entry.artistId, 'role', e.target.value)}
                        className="w-full mt-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                      >
                        {(['headliner', 'support', 'opener', 'b2b', 'live-act', 'visual-artist'] as const).map(
                          (r) => (
                            <option key={r} value={r} className="bg-[#0a0a0f]">
                              {r}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Start</label>
                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => updateLineupEntry(entry.artistId, 'startTime', e.target.value)}
                        className="w-full mt-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Duration (min)</label>
                      <input
                        type="number"
                        value={entry.duration}
                        min={15}
                        max={360}
                        onChange={(e) =>
                          updateLineupEntry(entry.artistId, 'duration', parseInt(e.target.value) || 60)
                        }
                        className="w-full mt-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Fee ($)</label>
                      <input
                        type="number"
                        value={entry.fee}
                        min={0}
                        onChange={(e) =>
                          updateLineupEntry(entry.artistId, 'fee', parseInt(e.target.value) || 0)
                        }
                        className="w-full mt-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Draw vs capacity bar */}
            {selectedVenue && (
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Estimated draw</span>
                  <span>
                    ~{lineupDraw} / {selectedVenue.capacity} cap
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (lineupDraw / selectedVenue.capacity) * 100)}%`,
                      background: draft.accentColor,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function StepCrew() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Who&apos;s on your team?</h2>
          <p className="text-slate-400">Add collaborators — they&apos;ll get edit access.</p>
        </div>

        {/* Add collaborator */}
        <div className="glass rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-300">Add Collaborator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              value={newCollab.name}
              onChange={(e) => setNewCollab((c) => ({ ...c, name: e.target.value }))}
              placeholder="Name"
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
            <select
              value={newCollab.role}
              onChange={(e) => setNewCollab((c) => ({ ...c, role: e.target.value }))}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            >
              {CREW_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0a0a0f]">
                  {r}
                </option>
              ))}
            </select>
            <input
              value={newCollab.email}
              onChange={(e) => setNewCollab((c) => ({ ...c, email: e.target.value }))}
              placeholder="Email (optional)"
              type="email"
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <button
            onClick={addCollaborator}
            disabled={!newCollab.name.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
            style={{ background: 'rgba(168,85,247,0.2)', color: '#d8b4fe' }}
          >
            <Plus className="w-4 h-4" />
            Add to Team
          </button>
        </div>

        {/* List */}
        {draft.collaborators.length > 0 && (
          <div className="space-y-2">
            {draft.collaborators.map((c) => (
              <div key={c.id} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{c.name}</div>
                  <div className="text-xs text-slate-500">
                    {c.role}
                    {c.email && ` · ${c.email}`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    set(
                      'collaborators',
                      draft.collaborators.filter((x) => x.id !== c.id)
                    )
                  }
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {draft.collaborators.length === 0 && (
          <p className="text-slate-600 text-sm">
            No collaborators added yet. Crew members will receive edit access to this proposal.
          </p>
        )}

        <div className="glass rounded-xl px-4 py-3 border border-purple-500/20">
          <p className="text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">Note:</span> These people will receive
            edit access to the proposal and be notified when venue status changes.
          </p>
        </div>
      </div>
    );
  }

  function StepDraw() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">How many people will come?</h2>
          <p className="text-slate-400">Give your best estimate.</p>
        </div>

        {/* Big number */}
        <div className="text-center">
          <input
            type="number"
            value={draft.estimatedDraw || ''}
            min={0}
            onChange={(e) => set('estimatedDraw', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="text-7xl font-black text-white bg-transparent text-center w-full outline-none placeholder:text-slate-700"
            style={{ color: draft.accentColor || '#a855f7' }}
          />
          <p className="text-slate-500 text-sm mt-1">estimated attendees</p>
        </div>

        {/* Venue capacity */}
        {selectedVenue && (
          <div className="glass rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">
                {selectedVenue.name} · {selectedVenue.capacity} cap
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: draft.accentColor || '#a855f7' }}
              >
                {Math.round(capacityPct)}%
              </span>
            </div>
            <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${capacityPct}%`,
                  background: draft.accentColor || '#a855f7',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Empty</span>
              <span>Sold Out</span>
            </div>
          </div>
        )}

        {/* Confidence */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Draw Confidence
          </label>
          <div className="flex gap-3">
            {(['low', 'medium', 'high'] as const).map((level) => {
              const colors: Record<string, string> = {
                low: '#f43f5e',
                medium: '#f59e0b',
                high: '#10b981',
              };
              const selected = draft.drawConfidence === level;
              return (
                <button
                  key={level}
                  onClick={() => set('drawConfidence', level)}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-bold capitalize transition-all"
                  style={{
                    borderColor: selected ? colors[level] : 'rgba(255,255,255,0.08)',
                    background: selected ? `${colors[level]}20` : 'rgba(255,255,255,0.03)',
                    color: selected ? colors[level] : '#64748b',
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Notes
          </label>
          <textarea
            value={draft.drawNotes}
            onChange={(e) => set('drawNotes', e.target.value)}
            placeholder="Why do you expect this turnout? Past events, artist followings..."
            rows={4}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>
      </div>
    );
  }

  function StepPromo() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">How will you promote?</h2>
          <p className="text-slate-400">Tell venues your marketing plan.</p>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Promotional Channels
          </label>
          <div className="flex flex-wrap gap-2">
            {PROMO_CHANNEL_OPTIONS.map((c) => {
              const selected = draft.promoChannels.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => togglePromoChannel(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    borderColor: selected ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                    background: selected ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.03)',
                    color: selected ? '#67e8f9' : '#64748b',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Promo Timeline
          </label>
          <textarea
            value={draft.promoTimeline}
            onChange={(e) => set('promoTimeline', e.target.value)}
            placeholder="Describe your promotion timeline leading up to the event..."
            rows={4}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>

        {/* Additional notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Additional Notes
          </label>
          <textarea
            value={draft.promoNotes}
            onChange={(e) => set('promoNotes', e.target.value)}
            placeholder="Any other promo details — artist reach, press contacts, etc."
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>
      </div>
    );
  }

  function StepBudget() {
    const estGross = draft.estimatedDraw > 0 && draft.ticketPrice
      ? null
      : null;
    void estGross;
    const totalExpensesHere = totalArtistFees + draft.productionBudget + draft.marketingBudget;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Let&apos;s talk money</h2>
          <p className="text-slate-400">Give venues a clear financial picture.</p>
        </div>

        {/* Artist fees (read-only) */}
        <div className="glass rounded-xl p-4 flex items-center justify-between border border-white/[0.06]">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Artist Fees
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {draft.lineup.length} artist{draft.lineup.length !== 1 ? 's' : ''} · locked
            </div>
          </div>
          <span className="text-xl font-black text-white">
            ${totalArtistFees.toLocaleString()}
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Production Budget ($)
            </label>
            <input
              type="number"
              value={draft.productionBudget || ''}
              min={0}
              onChange={(e) => set('productionBudget', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Marketing Budget ($)
            </label>
            <input
              type="number"
              value={draft.marketingBudget || ''}
              min={0}
              onChange={(e) => set('marketingBudget', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Ticket Price
            </label>
            <input
              value={draft.ticketPrice}
              onChange={(e) => set('ticketPrice', e.target.value)}
              placeholder="e.g. $15 / $20"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Revenue Split
            </label>
            <input
              value={draft.revenueSplit}
              onChange={(e) => set('revenueSplit', e.target.value)}
              placeholder="e.g. 60/40 after costs"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Budget Notes
          </label>
          <textarea
            value={draft.budgetNotes}
            onChange={(e) => set('budgetNotes', e.target.value)}
            placeholder="Breakeven point, expected margin, any cost-sharing notes..."
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>

        {/* Summary card */}
        <div className="glass rounded-xl p-5 space-y-3 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-slate-300">Budget Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Artist Fees</span>
              <span className="text-white">${totalArtistFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Production</span>
              <span className="text-white">${draft.productionBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Marketing</span>
              <span className="text-white">${draft.marketingBudget.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/[0.06] pt-2 flex justify-between font-bold">
              <span className="text-slate-300">Total Expenses</span>
              <span className="text-white">${totalExpensesHere.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function StepReview() {
    const reviewSections = [
      {
        label: 'Event Concept',
        targetStep: 1,
        content: (
          <div className="space-y-1 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Name:</span> {draft.name || '—'}
            </div>
            <div>
              <span className="text-slate-500">Tagline:</span> {draft.tagline || '—'}
            </div>
            <div>
              <span className="text-slate-500">Type:</span> {draft.eventType || '—'}
            </div>
            <div>
              <span className="text-slate-500">Genres:</span>{' '}
              {draft.genres.length > 0 ? draft.genres.join(', ') : '—'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Color:</span>
              <span
                className="w-4 h-4 rounded-full inline-block"
                style={{ background: draft.accentColor }}
              />
            </div>
          </div>
        ),
      },
      {
        label: 'Date & Venue',
        targetStep: 2,
        content: (
          <div className="space-y-1 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Venue:</span> {selectedVenue?.name || '—'}
            </div>
            <div>
              <span className="text-slate-500">Date:</span> {draft.proposedDate || '—'}
            </div>
            <div>
              <span className="text-slate-500">Doors:</span> {draft.doorsTime} → {draft.endTime}
            </div>
          </div>
        ),
      },
      {
        label: 'Lineup',
        targetStep: 3,
        content: (
          <div className="flex flex-wrap gap-2">
            {draft.lineup.length > 0
              ? draft.lineup.map((l) => (
                  <div key={l.artistId} className="flex items-center gap-2 glass rounded-lg px-2 py-1">
                    <img src={l.image} alt={l.name} className="w-6 h-6 rounded object-cover" />
                    <span className="text-xs text-white font-semibold">{l.name}</span>
                    <span className="text-[10px] text-slate-500 capitalize">{l.role}</span>
                  </div>
                ))
              : <span className="text-slate-500 text-sm">No lineup added</span>}
          </div>
        ),
      },
      {
        label: 'Crew',
        targetStep: 4,
        content: (
          <div className="space-y-1">
            {draft.collaborators.length > 0
              ? draft.collaborators.map((c) => (
                  <div key={c.id} className="text-sm text-slate-300">
                    {c.name} · <span className="text-slate-500">{c.role}</span>
                  </div>
                ))
              : <span className="text-slate-500 text-sm">No crew added</span>}
          </div>
        ),
      },
      {
        label: 'Estimated Draw',
        targetStep: 5,
        content: (
          <div className="space-y-1 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Draw:</span> {draft.estimatedDraw || '—'}
            </div>
            <div>
              <span className="text-slate-500">Confidence:</span>{' '}
              <span className="capitalize">{draft.drawConfidence}</span>
            </div>
          </div>
        ),
      },
      {
        label: 'Promotional Plan',
        targetStep: 6,
        content: (
          <div className="space-y-1 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Channels:</span>{' '}
              {draft.promoChannels.length > 0 ? draft.promoChannels.join(', ') : '—'}
            </div>
          </div>
        ),
      },
      {
        label: 'Budget',
        targetStep: 7,
        content: (
          <div className="space-y-1 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Artist Fees:</span> ${totalArtistFees.toLocaleString()}
            </div>
            <div>
              <span className="text-slate-500">Production:</span> ${draft.productionBudget.toLocaleString()}
            </div>
            <div>
              <span className="text-slate-500">Marketing:</span> ${draft.marketingBudget.toLocaleString()}
            </div>
            <div>
              <span className="text-slate-500">Total:</span>{' '}
              ${totalExpenses.toLocaleString()}
            </div>
            <div>
              <span className="text-slate-500">Tickets:</span> {draft.ticketPrice || '—'}
            </div>
            <div>
              <span className="text-slate-500">Split:</span> {draft.revenueSplit || '—'}
            </div>
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Review your proposal</h2>
          <p className="text-slate-400">Everything look right? Edit sections before submitting.</p>
        </div>

        {/* Event name preview */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: `linear-gradient(135deg, ${draft.accentColor}20, transparent)` }}
        >
          <div className="text-3xl font-black text-white">{draft.name || 'UNTITLED'}</div>
          {draft.tagline && <div className="text-slate-400 mt-1">{draft.tagline}</div>}
        </div>

        <div className="space-y-3">
          {reviewSections.map((section) => (
            <div key={section.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {section.label}
                </h3>
                <button
                  onClick={() => setStep(section.targetStep)}
                  className="text-xs font-semibold px-3 py-1 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  Edit
                </button>
              </div>
              {section.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function StepSubmit() {
    if (submitState === 'done') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)' }}
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Proposal Submitted!</h2>
            <p className="text-slate-400 max-w-md">
              Your proposal has been sent to{' '}
              <span className="text-white font-semibold">
                {selectedVenue?.name ?? 'the venue'}
              </span>
              . They typically respond within 3–5 business days.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/proposals"
              className="px-6 py-3 rounded-xl border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 text-sm font-bold transition-all"
            >
              View My Proposals
            </Link>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              }}
            >
              Create Another
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Ready to submit?</h2>
          <p className="text-slate-400">
            Your proposal will be sent to{' '}
            <span className="text-white font-semibold">
              {selectedVenue?.name ?? 'the venue'}
            </span>
            .
          </p>
        </div>

        {/* Summary card */}
        <div
          className="glass rounded-2xl p-6 border"
          style={{ borderColor: `${draft.accentColor}30` }}
        >
          <div className="text-2xl font-black text-white mb-1">{draft.name || 'UNTITLED'}</div>
          {draft.tagline && <div className="text-slate-400 text-sm mb-4">{draft.tagline}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Venue</div>
              <div className="text-white font-semibold">{selectedVenue?.name || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Date</div>
              <div className="text-white font-semibold">{draft.proposedDate || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Artists</div>
              <div className="text-white font-semibold">{draft.lineup.length}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Est. Draw</div>
              <div className="text-white font-semibold">{draft.estimatedDraw || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Total Budget</div>
              <div className="text-white font-semibold">${totalExpenses.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          Once submitted, the venue will review your proposal and respond within 3–5 business days.
          You can track the status on your Proposals page.
        </p>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitState === 'loading'}
          className="w-full py-4 rounded-xl font-black text-white text-lg flex items-center justify-center gap-3 disabled:opacity-70 transition-all"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          }}
        >
          {submitState === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending proposal...
            </>
          ) : (
            `Submit Proposal to ${selectedVenue?.name ?? 'Venue'}`
          )}
        </button>
      </div>
    );
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Top nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-6 gap-2">
        <Link href="/" className="flex items-center gap-1.5 mr-1">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="font-black text-sm gradient-text-purple">STAGEFRONT</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <Link href="/proposals" className="text-slate-400 hover:text-white text-sm transition-colors">
          Proposals
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold">New Proposal</span>
      </nav>

      {/* Step progress — sticky below nav */}
      <div className="fixed top-14 inset-x-0 z-40 bg-[#060608]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, idx) => {
              const num = idx + 1;
              const completed = num < step;
              const current = num === step;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => num < step && setStep(num)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                      style={{
                        background: completed
                          ? '#a855f7'
                          : current
                          ? 'transparent'
                          : 'transparent',
                        borderColor: completed
                          ? '#a855f7'
                          : current
                          ? 'white'
                          : '#1e293b',
                        color: completed ? 'white' : current ? 'white' : '#334155',
                        cursor: num < step ? 'pointer' : 'default',
                      }}
                    >
                      {completed ? <Check className="w-3.5 h-3.5" /> : num}
                    </button>
                    <span
                      className="text-[9px] mt-1 hidden sm:block"
                      style={{
                        color: current ? 'white' : completed ? '#a855f7' : '#334155',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {idx < STEP_LABELS.length - 1 && (
                    <div
                      className="h-px flex-1 mx-1 transition-all"
                      style={{
                        background: num < step ? '#a855f7' : '#1e293b',
                        width: '20px',
                        minWidth: '8px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="pt-36 pb-28 px-6">
        <div className="max-w-3xl mx-auto">{renderStep()}</div>
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-40 glass border-t border-white/[0.06] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 text-sm font-bold disabled:opacity-30 transition-all"
          >
            Back
          </button>
          <span className="text-xs text-slate-500 font-semibold">
            Step {step} of 9
          </span>
          {step < 9 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-30 transition-all"
              style={{
                background: canProceed()
                  ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                  : '#1e293b',
              }}
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitState === 'loading' || submitState === 'done'}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50 transition-all"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              }}
            >
              Submit Proposal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

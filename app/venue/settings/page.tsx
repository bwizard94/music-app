'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowLeft, Camera, Upload, Check, Plus, X, ChevronRight,
  Building2, Music2, Globe, Image as ImageIcon, Lock,
  Trash2, Eye, EyeOff, Save, AlertCircle, CheckCircle2,
  Loader2, Calendar, Settings2, Mic2, Lightbulb,
  FileText, Clock, ExternalLink, Users,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SaveState = 'saved' | 'unsaved' | 'saving';

// ─── Constants ────────────────────────────────────────────────────────────────

const VENUE_GENRE_OPTIONS = [
  'Techno', 'House', 'Deep House', 'Tech House', 'Dark Electro', 'Industrial',
  'Ambient', 'Dub Techno', 'EBM', 'Drum & Bass', 'Experimental', 'Noise',
  'Hip-Hop', 'Afrobeat', 'Indie', 'Post-Punk', 'Minimal', 'Acid',
  'Folk', 'Electronic', 'Jazz', 'Alternative',
];

const VENUE_TYPES = ['Club', 'Bar', 'Warehouse', 'Theatre / Concert Hall', 'Outdoor', 'Art Space', 'Hybrid'];

const TABS = [
  { id: 'info',      label: 'Venue Info',     icon: Building2 },
  { id: 'media',     label: 'Photos & Media', icon: ImageIcon },
  { id: 'sound',     label: 'Sound Specs',    icon: Mic2 },
  { id: 'lighting',  label: 'Lighting',       icon: Lightbulb },
  { id: 'stage',     label: 'Stage & Load-in',icon: Settings2 },
  { id: 'booking',   label: 'Booking Rules',  icon: FileText },
  { id: 'dates',     label: 'Open Dates',     icon: Calendar },
  { id: 'privacy',   label: 'Privacy',        icon: Lock },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const VENUE = {
  name: 'The Blind Pig',
  tagline: "Chicago's dark electronic institution since 2009",
  bio: `The Blind Pig has been the cornerstone of Chicago's dark electronic underground since 2009. Located in Wicker Park, we host 3–4 events per week across two levels — a main room with a world-class sound system and an intimate lounge bar area.

Our programming spans industrial techno, dark electro, EBM, and experimental electronic music. We work closely with both local Chicago artists and international touring acts, with a strong emphasis on emerging talent and underground culture.

The venue is fully licensed until 5AM on weekends, with a 300-person capacity and one of the finest club sound systems in the Midwest.`,
  city: 'Chicago',
  state: 'IL',
  capacity: 300,
  venueType: 'Club',
  genres: ['Techno', 'Industrial', 'Dark Electro', 'EBM'],
  banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80',
  accentColor: '#a855f7',
};

// ─── Autosave hook ────────────────────────────────────────────────────────────

function useAutosave() {
  const [state, setState] = useState<SaveState>('saved');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDirty = useCallback(() => {
    setState('unsaved');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setState('saving');
      setTimeout(() => setState('saved'), 900);
    }, 1800);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { state, markDirty };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${
      state === 'saved' ? 'text-emerald-400' : state === 'saving' ? 'text-amber-400' : 'text-slate-500'
    }`}>
      {state === 'saving'  && <Loader2 className="w-3 h-3 animate-spin" />}
      {state === 'saved'   && <CheckCircle2 className="w-3 h-3" />}
      {state === 'unsaved' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
      <span>{state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : 'Unsaved changes'}</span>
    </div>
  );
}

function SectionCard({
  title, description, saveState, children,
}: {
  title: string; description?: string; saveState?: SaveState; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
        <div>
          <h3 className="text-white font-bold text-sm">{title}</h3>
          {description && <p className="text-slate-600 text-xs mt-0.5">{description}</p>}
        </div>
        {saveState && <SaveIndicator state={saveState} />}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label, hint, error, required, children,
}: {
  label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        {required && <span className="text-rose-500 text-xs">*</span>}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-rose-400 text-xs">
          <AlertCircle className="w-3 h-3" /> {error}
        </div>
      )}
      {!error && hint && <p className="text-slate-600 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, error,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; error?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-700 outline-none bg-white/[0.04] border transition-colors ${
        error ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/[0.08] focus:border-purple-500/50'
      }`}
    />
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
        on ? 'bg-purple-500' : 'bg-white/10'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function ChipSelect({
  options, selected, onToggle, max, accentColor = '#a855f7',
}: {
  options: string[]; selected: string[]; onToggle: (v: string) => void;
  max?: number; accentColor?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o);
        const maxed = !active && max !== undefined && selected.length >= max;
        return (
          <button
            key={o}
            onClick={() => !maxed && onToggle(o)}
            disabled={maxed}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border disabled:opacity-30 disabled:cursor-not-allowed"
            style={
              active
                ? { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}60`, color: accentColor }
                : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#64748b' }
            }
          >
            {active && <Check className="w-3 h-3 inline mr-1" />}{o}
          </button>
        );
      })}
    </div>
  );
}

function CharCounter({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct >= 1 ? 'text-rose-400' : pct >= 0.9 ? 'text-amber-400' : 'text-slate-600';
  return <span className={`text-xs tabular-nums ${color}`}>{current}/{max}</span>;
}

// ─── Preview pane ─────────────────────────────────────────────────────────────

function VenuePreviewPane({
  name, tagline, city, state: stateAbbr, capacity, genres, banner, accentColor,
}: {
  name: string; tagline: string; city: string; state: string;
  capacity: number; genres: string[]; banner: string; accentColor: string;
}) {
  return (
    <div className="w-72 flex-shrink-0 border-l border-white/[0.06] bg-[#08080f] overflow-y-auto">
      <div className="p-4 border-b border-white/[0.05]">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Venue Preview
        </p>
      </div>

      <div className="p-4">
        <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0c14]">
          {/* Banner */}
          <div className="relative h-24 overflow-hidden">
            <img src={banner} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14]/80 to-transparent" />
            {/* Scan lines */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
            }} />
          </div>

          <div className="px-4 pb-4 pt-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-black text-sm">{name || 'Venue Name'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{tagline || 'Venue tagline'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
              <span>{city}{stateAbbr ? `, ${stateAbbr}` : ''}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> Cap. {capacity.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {(genres.length ? genres : ['Your Genres']).slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-slate-700 text-[10px] text-center mt-3">
          How your venue appears to artists and promoters
        </p>

        <Link
          href="/venue/blind-pig"
          className="flex items-center justify-center gap-1.5 mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View full venue page
        </Link>
      </div>
    </div>
  );
}

// ─── Tab: Venue Info ──────────────────────────────────────────────────────────

function VenueInfoTab({
  onDirty, onPreviewChange,
}: {
  onDirty: () => void;
  onPreviewChange: (p: Partial<{ name: string; tagline: string; city: string; state: string; capacity: number; genres: string[] }>) => void;
}) {
  const { state, markDirty } = useAutosave();
  const [name, setName]         = useState(VENUE.name);
  const [tagline, setTagline]   = useState(VENUE.tagline);
  const [bio, setBio]           = useState(VENUE.bio);
  const [city, setCity]         = useState(VENUE.city);
  const [stateAbbr, setStateAbbr] = useState(VENUE.state);
  const [capacity, setCapacity] = useState(String(VENUE.capacity));
  const [venueType, setVenueType] = useState(VENUE.venueType);
  const [genres, setGenres]     = useState(VENUE.genres);

  function ch(setter: (v: string) => void, preview?: () => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); preview?.(); };
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Venue Details" saveState={state}>
        <Field label="Venue Name" required>
          <TextInput value={name} onChange={ch(setName, () => onPreviewChange({ name }))} placeholder="Your venue name" />
        </Field>
        <Field label="Tagline" hint="Short punchy description — shown in cards and search results">
          <TextInput value={tagline} onChange={ch(setTagline, () => onPreviewChange({ tagline }))} placeholder="e.g. Chicago's underground techno institution since 2009" />
        </Field>
        <Field label="Venue Type">
          <div className="flex flex-wrap gap-2">
            {VENUE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => { setVenueType(t); markDirty(); onDirty(); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  venueType === t
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
                }`}
              >
                {venueType === t && <Check className="w-3 h-3 inline mr-1" />}{t}
              </button>
            ))}
          </div>
        </Field>
      </SectionCard>

      <SectionCard title="About" saveState={state}>
        <Field label="Venue Description" hint="Tell artists, promoters, and fans about your space — history, vibe, programming philosophy.">
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => { setBio(e.target.value); markDirty(); onDirty(); }}
              rows={10}
              maxLength={2000}
              className="w-full rounded-xl px-4 py-3 text-slate-200 text-sm leading-relaxed outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
            />
            <div className="absolute bottom-3 right-3">
              <CharCounter current={bio.length} max={2000} />
            </div>
          </div>
        </Field>
      </SectionCard>

      <SectionCard title="Location & Capacity" saveState={state}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <TextInput value={city} onChange={ch(setCity, () => onPreviewChange({ city }))} placeholder="Chicago" />
          </Field>
          <Field label="State / Region">
            <TextInput value={stateAbbr} onChange={ch(setStateAbbr, () => onPreviewChange({ state: stateAbbr }))} placeholder="IL" />
          </Field>
        </div>
        <Field label="Capacity (standing)" required hint="Total standing capacity — used in discover filters">
          <div className="flex items-center gap-2">
            <TextInput
              value={capacity}
              onChange={(v) => {
                setCapacity(v);
                markDirty();
                onDirty();
                const n = parseInt(v, 10);
                if (!isNaN(n)) onPreviewChange({ capacity: n });
              }}
              placeholder="300"
            />
            <span className="text-slate-600 text-sm whitespace-nowrap">people</span>
          </div>
        </Field>
      </SectionCard>

      <SectionCard title="Preferred Genres" description="Up to 8 genres — used to match incoming booking proposals" saveState={state}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600">{genres.length}/8 selected</span>
        </div>
        <ChipSelect
          options={VENUE_GENRE_OPTIONS}
          selected={genres}
          max={8}
          onToggle={(g) => {
            const next = genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g];
            setGenres(next);
            markDirty();
            onDirty();
            onPreviewChange({ genres: next });
          }}
          accentColor="#a855f7"
        />
      </SectionCard>
    </div>
  );
}

// ─── Tab: Photos & Media ──────────────────────────────────────────────────────

function VenueMediaTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=400&q=80',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80',
    'https://images.unsplash.com/photo-1571266028753-bfe6cc7f0e8e?w=400&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  ];
  const [gallery, setGallery] = useState(GALLERY_IMAGES);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <SectionCard title="Cover / Banner Photo" description="1600×600px recommended · JPG or PNG · max 8MB" saveState={state}>
        <div className="relative rounded-xl overflow-hidden h-44 group cursor-pointer border border-white/[0.07]">
          <img src={VENUE.banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center gap-4">
            <button
              onClick={() => { markDirty(); onDirty(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Change Banner</span>
            </button>
          </div>
        </div>
        <p className="text-slate-600 text-xs">
          This image is used as the hero banner on your venue page and in discovery cards.
        </p>
      </SectionCard>

      <SectionCard title="Photo Gallery" description={`${gallery.length}/30 photos`} saveState={state}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {gallery.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group rounded-xl overflow-hidden aspect-square border border-white/[0.07]"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 z-10 text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold">
                  Cover
                </div>
              )}
              <img src={url} alt="" className="w-full h-full object-cover" />
              {hovered === idx && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-1.5">
                  <button className="text-white p-1.5 rounded-lg bg-white/20">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setGallery((g) => g.filter((_, i) => i !== idx)); markDirty(); onDirty(); }}
                    className="text-rose-400 p-1.5 rounded-lg bg-white/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => { markDirty(); onDirty(); }}
            className="aspect-square rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-purple-400"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        </div>
        <p className="text-slate-600 text-xs">
          First photo is your cover image. Include interior shots, the booth/stage, crowd, and atmosphere.
        </p>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Sound Specs ─────────────────────────────────────────────────────────

function SoundSpecsTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [mainPA, setMainPA]         = useState('Funktion-One Resolution 5 (flown)');
  const [subs, setSubs]             = useState('Funktion-One F218 (4×) — infra setup');
  const [monitors, setMonitors]     = useState('Funktion-One Res 1 / in-ear capable');
  const [primaryDesk, setPrimaryDesk] = useState('Allen & Heath dLive S Class (96 ch)');
  const [djDesk, setDjDesk]         = useState('Pioneer DJM-900NXS2');
  const [cdjs, setCdjs]             = useState('Pioneer CDJ-3000 (4×)');
  const [outboard, setOutboard]     = useState('TC Electronic reverb, API preamps');
  const [connectivity, setConnectivity] = useState(['USB-A', 'USB-B', 'AES/EBU', 'Analog XLR', 'SPDIF']);
  const [maxSPL, setMaxSPL]         = useState('105dB');
  const [hasCustomize, setHasCustomize] = useState(true);
  const [notes, setNotes]           = useState('');

  const CONN_OPTIONS = ['USB-A', 'USB-B', 'AES/EBU', 'Analog XLR', 'SPDIF', 'ADAT', 'Dante', 'AVB'];

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Main PA System" description="Artists will see these specs when deciding whether to accept a booking" saveState={state}>
        <Field label="Main PA System">
          <TextInput value={mainPA} onChange={ch(setMainPA)} placeholder="e.g. Funktion-One Resolution 5" />
        </Field>
        <Field label="Subwoofer Setup">
          <TextInput value={subs} onChange={ch(setSubs)} placeholder="e.g. 4× Funktion-One F218" />
        </Field>
        <Field label="Monitor System">
          <TextInput value={monitors} onChange={ch(setMonitors)} placeholder="e.g. Funktion-One Res 1 wedges" />
        </Field>
        <Field label="Maximum SPL">
          <TextInput value={maxSPL} onChange={ch(setMaxSPL)} placeholder="e.g. 105dB" />
        </Field>
      </SectionCard>

      <SectionCard title="Mixing & Source Equipment" saveState={state}>
        <Field label="Front-of-House Desk">
          <TextInput value={primaryDesk} onChange={ch(setPrimaryDesk)} placeholder="e.g. Allen & Heath dLive" />
        </Field>
        <Field label="DJ Mixer (in booth)">
          <TextInput value={djDesk} onChange={ch(setDjDesk)} placeholder="e.g. Pioneer DJM-900NXS2" />
        </Field>
        <Field label="CD Players / Media Players">
          <TextInput value={cdjs} onChange={ch(setCdjs)} placeholder="e.g. Pioneer CDJ-3000 (4×)" />
        </Field>
        <Field label="Outboard / Gear">
          <TextInput value={outboard} onChange={ch(setOutboard)} placeholder="e.g. TC reverb units, valve preamps" />
        </Field>
      </SectionCard>

      <SectionCard title="Connectivity" description="What input formats can artists plug in?" saveState={state}>
        <div className="flex flex-wrap gap-2">
          {CONN_OPTIONS.map((o) => {
            const active = connectivity.includes(o);
            return (
              <button
                key={o}
                onClick={() => {
                  setConnectivity((prev) =>
                    prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
                  );
                  markDirty();
                  onDirty();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
                }`}
              >
                {active && <Check className="w-3 h-3 inline mr-1" />}{o}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mt-2">
          <div>
            <p className="text-slate-300 text-sm font-medium">Artists can request custom setups</p>
            <p className="text-slate-600 text-xs mt-0.5">Allow artists to discuss non-standard requirements with you</p>
          </div>
          <Toggle on={hasCustomize} onChange={(v) => { setHasCustomize(v); markDirty(); onDirty(); }} />
        </div>
      </SectionCard>

      <SectionCard title="Additional Notes" saveState={state}>
        <Field label="Sound System Notes" hint="Any other information artists should know — curfews, noise restrictions, etc.">
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            placeholder="e.g. Sound curfew 3AM weekdays, 5AM weekends. No soundcheck after 10PM…"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Lighting ────────────────────────────────────────────────────────────

function LightingTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [controller, setController]   = useState('GrandMA2 onPC (full wing)');
  const [movers, setMovers]           = useState('16× Robe Robin 600E LEDWash');
  const [strobes, setStrobes]         = useState('8× Martin Atomic 3000');
  const [ledFixtures, setLedFixtures] = useState('32× Chauvet Professional COLORdash');
  const [haze, setHaze]               = useState('2× Antari HZ-500 haze machines');
  const [fog, setFog]                 = useState('1× Unique 2.1 CO₂ fogger');
  const [riggingPoints, setRiggingPoints] = useState('12 rigging points @ 500kg SWL each');
  const [vjFeed, setVjFeed]           = useState(true);
  const [projectors, setProjectors]   = useState('2× Christie 12K projectors — main wall + stage');
  const [notes, setNotes]             = useState('');

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Lighting Control" saveState={state}>
        <Field label="Lighting Controller">
          <TextInput value={controller} onChange={ch(setController)} placeholder="e.g. GrandMA2, Avolites Sapphire Touch" />
        </Field>
        <Field label="Moving Head Fixtures">
          <TextInput value={movers} onChange={ch(setMovers)} placeholder="e.g. 12× Robe Robin LEDWash" />
        </Field>
        <Field label="Strobe Fixtures">
          <TextInput value={strobes} onChange={ch(setStrobes)} placeholder="e.g. 6× Martin Atomic 3000" />
        </Field>
        <Field label="LED / Wash Fixtures">
          <TextInput value={ledFixtures} onChange={ch(setLedFixtures)} placeholder="e.g. 24× Chauvet COLORdash" />
        </Field>
      </SectionCard>

      <SectionCard title="Atmospherics & Rigging" saveState={state}>
        <Field label="Haze Machines">
          <TextInput value={haze} onChange={ch(setHaze)} placeholder="e.g. 2× Antari HZ-500" />
        </Field>
        <Field label="Fog / CO₂">
          <TextInput value={fog} onChange={ch(setFog)} placeholder="e.g. CO₂ fogger, cryo jets" />
        </Field>
        <Field label="Rigging Points" hint="Number and safe working load — relevant for tour productions">
          <TextInput value={riggingPoints} onChange={ch(setRiggingPoints)} placeholder="e.g. 8 points @ 500kg SWL" />
        </Field>
      </SectionCard>

      <SectionCard title="Visual Output" saveState={state}>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <p className="text-slate-300 text-sm font-medium">VJ / Visuals feed available</p>
            <p className="text-slate-600 text-xs mt-0.5">Artists/VJs can send video directly into our system</p>
          </div>
          <Toggle on={vjFeed} onChange={(v) => { setVjFeed(v); markDirty(); onDirty(); }} />
        </div>
        {vjFeed && (
          <Field label="Projection / Screen Setup">
            <TextInput value={projectors} onChange={ch(setProjectors)} placeholder="e.g. 2× Christie 12K projectors" />
          </Field>
        )}
        <Field label="Additional Lighting Notes">
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            placeholder="e.g. In-house LD available on request. External LDs must brief in-house team 48hrs in advance…"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Stage & Load-in ─────────────────────────────────────────────────────

function StageTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [stageDims, setStageDims]     = useState('8m × 6m');
  const [stageHeight, setStageHeight] = useState('60cm raised');
  const [boothDims, setBoothDims]     = useState('2.4m × 1.2m');
  const [loadIn, setLoadIn]           = useState('Double doors ground level — 2.1m clearance');
  const [loadInParking, setLoadInParking] = useState('1× reserved bay at rear + 2× 30-min spots');
  const [power, setPower]             = useState('1× 63A CEE, 2× 32A CEE, 4× 16A');
  const [backline, setBackline]       = useState<string[]>(['Drum Kit', 'Bass Amp']);
  const [greenRoom, setGreenRoom]     = useState(true);
  const [greenRoomNotes, setGreenRoomNotes] = useState('Private dressing room with fridge, shower, and WiFi — capacity 8');
  const [notes, setNotes]             = useState('');

  const BACKLINE_OPTIONS = ['Drum Kit', 'Guitar Amp', 'Bass Amp', 'Keyboard Stand', 'DI Boxes', 'Mic Stands', 'Gaffer Tape'];

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Stage Dimensions" saveState={state}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage Footprint (W × D)">
            <TextInput value={stageDims} onChange={ch(setStageDims)} placeholder="e.g. 8m × 6m" />
          </Field>
          <Field label="Stage Height">
            <TextInput value={stageHeight} onChange={ch(setStageHeight)} placeholder="e.g. 60cm raised" />
          </Field>
        </div>
        <Field label="DJ Booth Dimensions" hint="Internal booth dimensions for DJ / live act setup">
          <TextInput value={boothDims} onChange={ch(setBoothDims)} placeholder="e.g. 2.4m × 1.2m" />
        </Field>
      </SectionCard>

      <SectionCard title="Load-in & Access" saveState={state}>
        <Field label="Load-in Access" hint="Door dimensions, ramp/lift availability, stair count">
          <TextInput value={loadIn} onChange={ch(setLoadIn)} placeholder="e.g. Double doors, ground level, 2.1m clearance" />
        </Field>
        <Field label="Load-in Parking">
          <TextInput value={loadInParking} onChange={ch(setLoadInParking)} placeholder="e.g. 1 reserved bay at rear" />
        </Field>
        <Field label="Power Supply" hint="Available power sockets/feeds for touring production">
          <TextInput value={power} onChange={ch(setPower)} placeholder="e.g. 63A CEE + 2× 32A CEE" />
        </Field>
      </SectionCard>

      <SectionCard title="Backline & Facilities" saveState={state}>
        <Field label="Backline Available">
          <div className="flex flex-wrap gap-2">
            {BACKLINE_OPTIONS.map((o) => {
              const active = backline.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => {
                    setBackline((prev) =>
                      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
                    );
                    markDirty();
                    onDirty();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    active
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
                  }`}
                >
                  {active && <Check className="w-3 h-3 inline mr-1" />}{o}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <p className="text-slate-300 text-sm font-medium">Green room / dressing room</p>
            <p className="text-slate-600 text-xs mt-0.5">A private space for artists before and after their set</p>
          </div>
          <Toggle on={greenRoom} onChange={(v) => { setGreenRoom(v); markDirty(); onDirty(); }} />
        </div>
        {greenRoom && (
          <Field label="Green Room Details">
            <TextInput value={greenRoomNotes} onChange={ch(setGreenRoomNotes)} placeholder="e.g. Private dressing room, shower, fridge, WiFi" />
          </Field>
        )}

        <Field label="Additional Stage Notes">
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            placeholder="e.g. Stage setup available from 3PM on event days. Touring crew must check in with in-house stage manager…"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Booking Rules ───────────────────────────────────────────────────────

function BookingRulesTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [contractRequired, setContractRequired]   = useState(true);
  const [insuranceRequired, setInsuranceRequired] = useState(false);
  const [minFee, setMinFee]             = useState('500');
  const [maxFee, setMaxFee]             = useState('');
  const [revenueNotes, setRevenueNotes] = useState('Door deal preferred: 70/30 split after expenses. Flat guarantee negotiable for established artists.');
  const [leadTime, setLeadTime]         = useState('4 weeks');
  const [guestListPolicy, setGuestListPolicy] = useState('Standard: 4 guest-list spots per artist. Headliners: up to 10. All names by 5PM event day.');
  const [soundCurfew, setSoundCurfew]   = useState('03:00');
  const [closingTime, setClosingTime]   = useState('05:00');
  const [houseRules, setHouseRules]     = useState('No phone filming on stage or in booth without prior permission. Promoters must agree to our standard venue rider.');
  const [excludedTypes, setExcludedTypes] = useState<string[]>([]);

  const EXCLUDED_OPTIONS = ['Corporate events', 'Private hire', 'Stag/hen parties', 'Under-18 events', 'Karaoke / quiz nights'];
  const LEAD_OPTIONS = ['48 hours', '1 week', '2 weeks', '4 weeks', '2 months', '3 months'];

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      {/* Booking status */}
      <SectionCard title="Booking Status" saveState={state}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.07]">
          <div>
            <p className="text-white font-semibold text-sm">
              {acceptingBookings ? 'Accepting new bookings' : 'Not accepting bookings'}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {acceptingBookings
                ? 'Artists and promoters can submit booking proposals'
                : 'Your venue page is visible but proposals are paused'}
            </p>
          </div>
          <Toggle on={acceptingBookings} onChange={(v) => { setAcceptingBookings(v); markDirty(); onDirty(); }} />
        </div>
      </SectionCard>

      {/* Requirements */}
      <SectionCard title="Booking Requirements" saveState={state}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-slate-300 text-sm font-medium">Contract required</p>
              <p className="text-slate-600 text-xs">All bookings must be signed off with our standard venue contract</p>
            </div>
            <Toggle on={contractRequired} onChange={(v) => { setContractRequired(v); markDirty(); onDirty(); }} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-slate-300 text-sm font-medium">Public liability insurance required</p>
              <p className="text-slate-600 text-xs">Artists/promoters must show proof of PLI before event</p>
            </div>
            <Toggle on={insuranceRequired} onChange={(v) => { setInsuranceRequired(v); markDirty(); onDirty(); }} />
          </div>
        </div>
      </SectionCard>

      {/* Fees */}
      <SectionCard title="Fee Range" saveState={state}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum Hire Fee" hint="Starting rate for venue hire">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">$</span>
              <TextInput value={minFee} onChange={ch(setMinFee)} placeholder="500" />
            </div>
          </Field>
          <Field label="Maximum Fee" hint="Leave blank for 'negotiable'">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">$</span>
              <TextInput value={maxFee} onChange={ch(setMaxFee)} placeholder="Negotiable" />
            </div>
          </Field>
        </div>
        <Field label="Revenue / Deal Structure Notes" hint="Shown to artists and promoters in proposal review">
          <textarea
            value={revenueNotes}
            onChange={(e) => { setRevenueNotes(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>

      {/* Scheduling & policies */}
      <SectionCard title="Scheduling & House Rules" saveState={state}>
        <Field label="Minimum Advance Notice">
          <div className="flex flex-wrap gap-2">
            {LEAD_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => { setLeadTime(t); markDirty(); onDirty(); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  leadTime === t
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Sound Curfew">
            <TextInput value={soundCurfew} onChange={ch(setSoundCurfew)} placeholder="03:00" />
          </Field>
          <Field label="Venue Closing Time">
            <TextInput value={closingTime} onChange={ch(setClosingTime)} placeholder="05:00" />
          </Field>
        </div>

        <Field label="Guest List Policy">
          <textarea
            value={guestListPolicy}
            onChange={(e) => { setGuestListPolicy(e.target.value); markDirty(); onDirty(); }}
            rows={2}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>

        <Field label="House Rules">
          <textarea
            value={houseRules}
            onChange={(e) => { setHouseRules(e.target.value); markDirty(); onDirty(); }}
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>

        <Field label="We Do Not Accept">
          <div className="flex flex-wrap gap-2">
            {EXCLUDED_OPTIONS.map((o) => {
              const active = excludedTypes.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => {
                    setExcludedTypes((prev) =>
                      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
                    );
                    markDirty();
                    onDirty();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    active
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
                  }`}
                >
                  {active && <X className="w-3 h-3 inline mr-1" />}{o}
                </button>
              );
            })}
          </div>
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Open Dates ─────────────────────────────────────────────────────────

function OpenDatesTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [openDays, setOpenDays] = useState<string[]>(['Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [openSlots, setOpenSlots] = useState([
    { id: 's1', date: 'Fri Jun 27, 2025', type: 'Full night', notes: 'Main room + lounge available', locked: false },
    { id: 's2', date: 'Sat Jun 28, 2025', type: 'Full night', notes: 'Headliner slot only — openers being finalized', locked: false },
    { id: 's3', date: 'Sat Jul 5, 2025',  type: 'Support slot', notes: 'Opening set 22:00–23:30', locked: false },
    { id: 's4', date: 'Fri Jul 11, 2025', type: 'Full night', notes: '', locked: true },
  ]);
  const [newDate, setNewDate]   = useState('');
  const [newType, setNewType]   = useState('Full night');
  const [newNotes, setNewNotes] = useState('');

  const SLOT_TYPES = ['Full night', 'Headliner slot', 'Support slot', 'Opening slot', 'Residency night'];

  function addSlot() {
    if (!newDate.trim()) return;
    setOpenSlots((prev) => [
      ...prev,
      { id: `s${Date.now()}`, date: newDate, type: newType, notes: newNotes, locked: false },
    ]);
    setNewDate('');
    setNewNotes('');
    markDirty();
    onDirty();
  }

  return (
    <div className="space-y-5">
      {/* Weekly schedule */}
      <SectionCard title="Weekly Availability" description="Which days are you typically open for bookings?" saveState={state}>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = openDays.includes(d);
            return (
              <button
                key={d}
                onClick={() => {
                  setOpenDays((prev) =>
                    prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                  );
                  markDirty();
                  onDirty();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            );
          })}
        </div>
        <p className="text-slate-600 text-xs">
          This sets your default weekly availability. You can add or block specific dates below.
        </p>
      </SectionCard>

      {/* Open slots */}
      <SectionCard title="Open Booking Slots" description="Specific dates you're actively promoting for artists to book" saveState={state}>
        <div className="space-y-2.5">
          {openSlots.map((slot) => (
            <div
              key={slot.id}
              className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                slot.locked
                  ? 'border-amber-500/20 bg-amber-500/5'
                  : 'border-white/[0.07] bg-white/[0.02]'
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: slot.locked ? '#f59e0b20' : '#a855f720' }}>
                <Calendar className="w-4 h-4" style={{ color: slot.locked ? '#f59e0b' : '#a855f7' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{slot.date}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.07] text-slate-400">{slot.type}</span>
                  {slot.locked && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Hold</span>
                  )}
                </div>
                {slot.notes && <p className="text-slate-500 text-xs mt-0.5 truncate">{slot.notes}</p>}
              </div>
              <button
                onClick={() => { setOpenSlots((prev) => prev.filter((s) => s.id !== slot.id)); markDirty(); onDirty(); }}
                className="text-slate-600 hover:text-rose-400 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add slot form */}
        <div className="border-t border-white/[0.06] pt-4 mt-2 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Add Open Slot</p>
          <div className="grid grid-cols-2 gap-3">
            <TextInput value={newDate} onChange={setNewDate} placeholder="e.g. Sat Aug 9, 2025" />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="rounded-xl px-3 py-3 text-white text-sm bg-white/[0.04] border border-white/[0.08] outline-none focus:border-purple-500/50"
            >
              {SLOT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <TextInput value={newNotes} onChange={setNewNotes} placeholder="Optional notes for artists (e.g. 'headliner only')" />
          <button
            onClick={addSlot}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add slot
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Privacy ─────────────────────────────────────────────────────────────

function VenuePrivacyTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const SETTINGS = [
    { id: 'discover',   label: 'Show in Discover',               description: 'Appear in search and browse results', on: true },
    { id: 'openDates',  label: 'Show open dates publicly',        description: 'Artists can see your available booking slots', on: true },
    { id: 'specs',      label: 'Show technical specs publicly',   description: 'Sound, lighting and stage specs visible to all', on: true },
    { id: 'directProp', label: 'Accept direct proposals',         description: 'Artists can submit proposals without introduction', on: true },
    { id: 'fee',        label: 'Show fee range publicly',         description: 'Display your min/max hire range on your profile', on: false },
    { id: 'seo',        label: 'Allow search engine indexing',    description: 'Allow Google to find your Stagefront venue page', on: true },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.on]))
  );

  return (
    <div className="space-y-5">
      <SectionCard title="Visibility & Privacy" saveState={state}>
        <div className="divide-y divide-white/[0.04] -mx-6 -mb-6">
          {SETTINGS.map(({ id, label, description }) => (
            <div key={id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-slate-200 text-sm font-medium">{label}</p>
                <p className="text-slate-600 text-xs mt-0.5">{description}</p>
              </div>
              <Toggle
                on={toggles[id]}
                onChange={(v) => {
                  setToggles((prev) => ({ ...prev, [id]: v }));
                  markDirty();
                  onDirty();
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VenueSettingsPage() {
  const [activeTab, setActiveTab]     = useState('info');
  const [showPreview, setShowPreview]  = useState(false);
  const [globalDirty, setGlobalDirty] = useState(false);

  const [preview, setPreview] = useState({
    name:     VENUE.name,
    tagline:  VENUE.tagline,
    city:     VENUE.city,
    state:    VENUE.state,
    capacity: VENUE.capacity,
    genres:   VENUE.genres,
    banner:   VENUE.banner,
  });

  function markDirty() { setGlobalDirty(true); }
  function patchPreview(p: Partial<typeof preview>) { setPreview((prev) => ({ ...prev, ...p })); }

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 glass border-b border-white/[0.05] flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <Link href="/venue/blind-pig" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Venue</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <span className="text-white font-bold text-sm">Venue Settings</span>

          <div className="flex-1" />

          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all ${
              showPreview
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-white/[0.04] border-white/[0.07] text-slate-400 hover:text-white'
            }`}
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => setGlobalDirty(false)}
            className="relative font-semibold text-white text-sm px-5 py-2 rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <span className="relative flex items-center gap-2">
              <Save className="w-3.5 h-3.5" /> Save all
            </span>
          </button>
        </div>
      </div>

      {/* ── Unsaved banner ────────────────────────────────────────────────────── */}
      {globalDirty && (
        <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between">
          <span className="text-amber-300 text-xs flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            You have unsaved changes
          </span>
          <button onClick={() => setGlobalDirty(false)} className="text-xs text-amber-300 hover:text-white">Save now</button>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="glass rounded-2xl overflow-hidden border border-white/[0.07] sticky top-6">
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const active = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all text-left border-b border-white/[0.04] last:border-0 ${
                          active
                            ? 'text-white bg-white/[0.05] border-l-2 border-l-purple-500'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-purple-400' : ''}`} />
                        <span className="flex-1">{label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/venue/blind-pig"
                  className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-600 hover:text-purple-400 transition-colors"
                >
                  <Eye className="w-3 h-3" /> View public venue page
                </Link>
              </aside>

              {/* Content */}
              <main className="lg:col-span-1 min-w-0">
                {activeTab === 'info'     && <VenueInfoTab onDirty={markDirty} onPreviewChange={patchPreview} />}
                {activeTab === 'media'    && <VenueMediaTab onDirty={markDirty} />}
                {activeTab === 'sound'    && <SoundSpecsTab onDirty={markDirty} />}
                {activeTab === 'lighting' && <LightingTab onDirty={markDirty} />}
                {activeTab === 'stage'    && <StageTab onDirty={markDirty} />}
                {activeTab === 'booking'  && <BookingRulesTab onDirty={markDirty} />}
                {activeTab === 'dates'    && <OpenDatesTab onDirty={markDirty} />}
                {activeTab === 'privacy'  && <VenuePrivacyTab onDirty={markDirty} />}
              </main>
            </div>
          </div>
        </div>

        {/* Preview pane */}
        {showPreview && (
          <VenuePreviewPane
            name={preview.name}
            tagline={preview.tagline}
            city={preview.city}
            state={preview.state}
            capacity={preview.capacity}
            genres={preview.genres}
            banner={preview.banner}
            accentColor={VENUE.accentColor}
          />
        )}
      </div>
    </div>
  );
}

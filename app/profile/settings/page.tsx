'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowLeft, Camera, Upload, Check, Plus, X, ChevronRight,
  User, Music2, Globe, Image as ImageIcon, Lock, Bell,
  Trash2, Eye, EyeOff, Save, AlertCircle, CheckCircle2,
  Loader2, Mic2, Settings2, Calendar, ExternalLink,
  GripVertical, Play, Radio, FileText,
} from 'lucide-react';
import { NOVA_VEGA } from '@/components/profile/artistData';
import { useAuth } from '@/components/providers/AuthProvider';
import { updateProfile } from '@/lib/services/profiles';

// ─── Types ────────────────────────────────────────────────────────────────────

type SaveState = 'saved' | 'unsaved' | 'saving';

// ─── Constants ────────────────────────────────────────────────────────────────

const GENRE_OPTIONS = [
  'Techno', 'House', 'Deep House', 'Tech House', 'Dark Electro', 'Industrial',
  'Ambient', 'Dub Techno', 'EBM', 'Drum & Bass', 'Breaks', 'IDM',
  'Trance', 'Minimal', 'Acid', 'UK Garage', 'Disco', 'Experimental',
  'Afrobeat', 'Jungle', 'Noise', 'Power Electronics', 'Hardcore', 'Gabber',
];

const COLLAB_OPTIONS = [
  'Studio production', 'Live AV collaboration', 'Label A&R', 'Festival co-booking',
  'Remix exchanges', 'B2B DJ sets', 'Touring', 'Licensing', 'Brand partnerships',
  'Workshop / Teaching', 'Radio shows', 'Podcast / Interview',
  'Film scoring', 'Installation art', 'Visual art direction',
];

const BOOKING_TYPES = [
  'Club night', 'Festival slot', 'B2B set', 'Residency', 'Corporate',
  'Private event', 'Studio session', 'Livestream', 'Radio show', 'Workshop',
];

const TRAVEL_OPTIONS = [
  { id: 'local', label: 'Local only', description: 'Within 50 miles' },
  { id: 'regional', label: 'Regional', description: 'Midwest / UK regions' },
  { id: 'national', label: 'National', description: 'Anywhere in country' },
  { id: 'international', label: 'International', description: 'Worldwide' },
];

const LEAD_TIME_OPTIONS = ['Same day', '48 hours', '1 week', '2 weeks', '1 month', '3 months'];

const TABS = [
  { id: 'profile',     label: 'Profile',         icon: User },
  { id: 'media',       label: 'Photos & Media',  icon: ImageIcon },
  { id: 'musicvideo',  label: 'Music & Video',   icon: Music2 },
  { id: 'links',       label: 'Social Links',    icon: Globe },
  { id: 'rider',       label: 'Technical Rider', icon: Settings2 },
  { id: 'availability',label: 'Availability',    icon: Calendar },
  { id: 'privacy',     label: 'Privacy',         icon: Lock },
];

// ─── Autosave hook ────────────────────────────────────────────────────────────

function useAutosave(onSave?: () => void) {
  const [state, setState] = useState<SaveState>('saved');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const markDirty = useCallback(() => {
    setState('unsaved');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setState('saving');
      onSaveRef.current?.();
      setTimeout(() => setState('saved'), 900);
    }, 1800);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { state, markDirty };
}

// ─── Shared components ────────────────────────────────────────────────────────

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${
      state === 'saved' ? 'text-emerald-400' : state === 'saving' ? 'text-amber-400' : 'text-slate-500'
    }`}>
      {state === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
      {state === 'saved' && <CheckCircle2 className="w-3 h-3" />}
      {state === 'unsaved' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
      <span>{state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : 'Unsaved changes'}</span>
    </div>
  );
}

function SectionCard({
  title,
  description,
  saveState,
  children,
}: {
  title: string;
  description?: string;
  saveState?: SaveState;
  children: React.ReactNode;
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
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
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
  value,
  onChange,
  placeholder,
  error,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-700 outline-none bg-white/[0.04] border transition-colors ${
        error
          ? 'border-rose-500/60 focus:border-rose-500'
          : 'border-white/[0.08] focus:border-purple-500/50'
      } ${className ?? ''}`}
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
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

function ChipSelect({
  options,
  selected,
  onToggle,
  max,
  accentColor = '#a855f7',
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  max?: number;
  accentColor?: string;
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

function UrlInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  const hasVal = value.trim().length > 0;
  return (
    <Field label={label}>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-600 text-xs select-none pointer-events-none">{prefix}</span>
        )}
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={prefix ? 'pl-24' : ''}
        />
        {hasVal && (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 text-slate-500 hover:text-purple-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </Field>
  );
}

// ─── Preview pane ─────────────────────────────────────────────────────────────

function PreviewPane({
  name, bio, city, genres, avatar, banner, accentColor,
}: {
  name: string; bio: string; city: string; genres: string[];
  avatar: string; banner: string; accentColor: string;
}) {
  const { profileSlug } = useAuth();
  const myProfileHref = profileSlug ? `/profile/${profileSlug}` : '#';
  return (
    <div className="w-72 flex-shrink-0 border-l border-white/[0.06] bg-[#08080f] overflow-y-auto">
      <div className="p-4 border-b border-white/[0.05]">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Profile Preview
        </p>
      </div>

      {/* Mini profile card */}
      <div className="p-4">
        <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0c14]">
          {/* Banner */}
          <div className="relative h-20 overflow-hidden">
            <img src={banner} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14]/80 to-transparent" />
          </div>

          {/* Avatar */}
          <div className="px-4 -mt-6 pb-4">
            <div
              className="w-14 h-14 rounded-xl border-2 overflow-hidden mb-3"
              style={{ borderColor: accentColor }}
            >
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-white font-black text-sm">{name || 'Your Name'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              {city || 'Your City'}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-3">
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

            {/* Bio excerpt */}
            <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-4">
              {bio || 'Your bio will appear here…'}
            </p>
          </div>
        </div>

        <p className="text-slate-700 text-[10px] text-center mt-3">
          This is how your profile appears to visitors
        </p>

        <Link
          href={myProfileHref}
          className="flex items-center justify-center gap-1.5 mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View full profile
        </Link>
      </div>
    </div>
  );
}

// ─── Tab: Profile Info ────────────────────────────────────────────────────────

function ProfileInfoTab({
  onDirty,
  preview,
  onPreviewChange,
}: {
  onDirty: () => void;
  preview: { name: string; bio: string; city: string; genres: string[] };
  onPreviewChange: (p: Partial<typeof preview>) => void;
}) {
  const { user } = useAuth();
  const [name, setName]       = useState(NOVA_VEGA.name);
  const [realName, setRealName] = useState(NOVA_VEGA.realName);
  const [pronouns, setPronouns] = useState('he/him');
  const [bio, setBio]         = useState(NOVA_VEGA.bio);
  const [city, setCity]       = useState(NOVA_VEGA.city);
  const [genres, setGenres]   = useState(NOVA_VEGA.genres);
  const [collabs, setCollabs] = useState(NOVA_VEGA.collaborationInterests);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const nameRef = useRef(name);
  const bioRef = useRef(bio);
  const cityRef = useRef(city);
  nameRef.current = name;
  bioRef.current = bio;
  cityRef.current = city;

  const { state, markDirty } = useAutosave(() => {
    if (user) {
      updateProfile(user.id, {
        display_name: nameRef.current,
        bio: bioRef.current,
        city: cityRef.current,
      }).catch(console.error);
    }
  });

  function touch(field: string, value: string) {
    if (!value.trim()) setErrors((e) => ({ ...e, [field]: 'This field is required' }));
    else setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function change<T>(setter: (v: T) => void, cb?: () => void) {
    return (v: T) => {
      setter(v);
      markDirty();
      onDirty();
      cb?.();
    };
  }

  return (
    <div className="space-y-5">
      {/* Basic info */}
      <SectionCard title="Basic Information" saveState={state}>
        <Field label="Artist / Stage Name" required error={errors.name}>
          <TextInput
            value={name}
            onChange={change(setName, () => onPreviewChange({ name }))}
            placeholder="Your artist name"
            error={!!errors.name}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Real Name" hint="Private — only shown to verified venues">
            <TextInput value={realName} onChange={change(setRealName)} placeholder="Your legal name" />
          </Field>
          <Field label="Pronouns">
            <TextInput value={pronouns} onChange={change(setPronouns)} placeholder="e.g. they/them" />
          </Field>
        </div>
        <Field label="City / Location" required error={errors.city}>
          <TextInput
            value={city}
            onChange={change(setCity, () => onPreviewChange({ city }))}
            placeholder="Chicago, IL"
            error={!!errors.city}
          />
        </Field>
      </SectionCard>

      {/* Bio */}
      <SectionCard title="Bio / About" saveState={state}>
        <Field label="Bio" hint="Tell your story — sound, history, who you want to collaborate with.">
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                markDirty();
                onDirty();
                onPreviewChange({ bio: e.target.value });
              }}
              rows={9}
              maxLength={1200}
              className="w-full rounded-xl px-4 py-3 text-slate-200 text-sm leading-relaxed outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
            />
            <div className="absolute bottom-3 right-3">
              <CharCounter current={bio.length} max={1200} />
            </div>
          </div>
        </Field>
      </SectionCard>

      {/* Genres */}
      <SectionCard
        title="Genres & Styles"
        description="Select up to 6 genres that define your sound"
        saveState={state}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600">{genres.length}/6 selected</span>
        </div>
        <ChipSelect
          options={GENRE_OPTIONS}
          selected={genres}
          max={6}
          onToggle={(g) => {
            const next = genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g];
            setGenres(next);
            markDirty();
            onDirty();
            onPreviewChange({ genres: next });
          }}
          accentColor="#f43f5e"
        />
      </SectionCard>

      {/* Collab interests */}
      <SectionCard title="Open to Collaborating On" saveState={state}>
        <ChipSelect
          options={COLLAB_OPTIONS}
          selected={collabs}
          onToggle={(c) => {
            setCollabs((prev) =>
              prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
            );
            markDirty();
            onDirty();
          }}
          accentColor="#a855f7"
        />
      </SectionCard>
    </div>
  );
}

// ─── Tab: Photos & Media ──────────────────────────────────────────────────────

function MediaTab({ onDirty, onPreviewChange }: { onDirty: () => void; onPreviewChange: (p: { avatar?: string; banner?: string }) => void }) {
  const { state, markDirty } = useAutosave();
  const artist = NOVA_VEGA;

  const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=400&q=80',
    'https://images.unsplash.com/photo-1571266028753-bfe6cc7f0e8e?w=400&q=80',
  ];
  const [gallery, setGallery] = useState(GALLERY_IMAGES);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Banner */}
      <SectionCard title="Profile Banner" description="Recommended: 1600×400px · JPG or PNG · max 5MB" saveState={state}>
        <div className="relative rounded-xl overflow-hidden h-40 group cursor-pointer border border-white/[0.07]">
          <img src={artist.banner} alt="Banner" className="w-full h-full object-cover" />
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
            <button className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-rose-400 text-xs font-semibold">Remove</span>
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Avatar */}
      <SectionCard title="Profile Photo" description="Square · min 400×400px · max 5MB" saveState={state}>
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer flex-shrink-0">
            <img
              src={artist.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-white/[0.1]"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/55 transition-all flex items-center justify-center">
              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => { markDirty(); onDirty(); }}
              className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors border border-white/[0.08]"
            >
              <Upload className="w-4 h-4" /> Upload New Photo
            </button>
            <button className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Remove photo
            </button>
            <p className="text-slate-600 text-xs">Your photo appears on your profile, messages, and discover feed.</p>
          </div>
        </div>
      </SectionCard>

      {/* Gallery */}
      <SectionCard title="Photo Gallery" description={`${gallery.length}/20 photos · First photo appears in discover feed`} saveState={state}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {gallery.map((url, idx) => (
            <div
              key={url}
              className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer border border-white/[0.07]"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 z-10 text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold uppercase tracking-wide">
                  Featured
                </div>
              )}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-black/0 ${hoveredIdx === idx ? 'bg-black/60' : ''} transition-all duration-200 flex items-center justify-center gap-1.5`}>
                {hoveredIdx === idx && (
                  <>
                    <button className="text-white p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setGallery((g) => g.filter((_, i) => i !== idx)); markDirty(); onDirty(); }}
                      className="text-rose-400 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {/* Add slot */}
          <button
            onClick={() => { markDirty(); onDirty(); }}
            className="aspect-square rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/40 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-purple-400"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        </div>
        <p className="text-slate-600 text-xs">Drag to reorder. First photo is your featured image.</p>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Music & Video ───────────────────────────────────────────────────────

function EmbedPreview({ url, platform }: { url: string; platform: string }) {
  if (!url.trim()) return null;
  const icons: Record<string, React.ElementType> = { soundcloud: Radio, youtube: Play, mixcloud: Music2 };
  const Icon = icons[platform] ?? Play;
  const colors: Record<string, string> = { soundcloud: '#f97316', youtube: '#f43f5e', mixcloud: '#06b6d4' };
  const color = colors[platform] ?? '#a855f7';
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3 border border-white/[0.08] mt-2"
      style={{ backgroundColor: `${color}0d` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold capitalize">{platform}</p>
        <p className="text-slate-500 text-[11px] truncate">{url}</p>
      </div>
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    </div>
  );
}

function MusicVideoTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();
  const s = NOVA_VEGA.socialLinks as Record<string, string>;

  const [links, setLinks] = useState({
    spotify: s.spotify ?? '',
    soundcloud: s.soundcloud ?? '',
    mixcloud: s.mixcloud ?? '',
    beatport: s.beatport ?? '',
    bandcamp: '',
    appleMusic: '',
    residentAdvisor: s.residentAdvisor ?? '',
  });

  const [featuredVideoUrl, setFeaturedVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [extraVideos, setExtraVideos] = useState(['', '']);
  const [featuredMixUrl, setFeaturedMixUrl] = useState(s.soundcloud ?? '');

  function updateLink(key: string, value: string) {
    setLinks((l) => ({ ...l, [key]: value }));
    markDirty();
    onDirty();
  }

  const MUSIC_PLATFORMS = [
    { key: 'spotify',        label: 'Spotify',           placeholder: 'open.spotify.com/artist/…' },
    { key: 'soundcloud',     label: 'SoundCloud',        placeholder: 'soundcloud.com/yourname' },
    { key: 'mixcloud',       label: 'Mixcloud',          placeholder: 'mixcloud.com/yourname' },
    { key: 'beatport',       label: 'Beatport',          placeholder: 'beatport.com/artist/yourname' },
    { key: 'bandcamp',       label: 'Bandcamp',          placeholder: 'yourname.bandcamp.com' },
    { key: 'appleMusic',     label: 'Apple Music',       placeholder: 'music.apple.com/artist/…' },
    { key: 'residentAdvisor',label: 'Resident Advisor',  placeholder: 'ra.co/dj/yourname' },
  ];

  function detectPlatform(url: string): string {
    if (url.includes('soundcloud')) return 'soundcloud';
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('mixcloud')) return 'mixcloud';
    return 'other';
  }

  return (
    <div className="space-y-5">
      {/* Music platform links */}
      <SectionCard title="Music Platform Links" saveState={state}>
        <div className="space-y-3">
          {MUSIC_PLATFORMS.map(({ key, label, placeholder }) => (
            <UrlInput
              key={key}
              label={label}
              value={links[key as keyof typeof links]}
              onChange={(v) => updateLink(key, v)}
              placeholder={placeholder}
            />
          ))}
        </div>
      </SectionCard>

      {/* Featured video embed */}
      <SectionCard title="Featured Video" description="Appears prominently on your Overview tab — YouTube or Vimeo URL" saveState={state}>
        <Field label="Video URL">
          <TextInput
            value={featuredVideoUrl}
            onChange={(v) => { setFeaturedVideoUrl(v); markDirty(); onDirty(); }}
            placeholder="https://youtube.com/watch?v=…"
          />
          <EmbedPreview url={featuredVideoUrl} platform={detectPlatform(featuredVideoUrl)} />
        </Field>

        <Field label="Additional Videos" hint="Add up to 2 more videos to your media gallery">
          <div className="space-y-2">
            {extraVideos.map((v, i) => (
              <TextInput
                key={i}
                value={v}
                onChange={(val) => {
                  const next = [...extraVideos];
                  next[i] = val;
                  setExtraVideos(next);
                  markDirty();
                  onDirty();
                }}
                placeholder={`Video URL ${i + 2}`}
              />
            ))}
          </div>
        </Field>
      </SectionCard>

      {/* Featured mix embed */}
      <SectionCard title="Featured Mix / Set" description="SoundCloud or Mixcloud URL — displayed in your Music tab" saveState={state}>
        <Field label="Mix URL">
          <TextInput
            value={featuredMixUrl}
            onChange={(v) => { setFeaturedMixUrl(v); markDirty(); onDirty(); }}
            placeholder="soundcloud.com/yourname/set-title"
          />
          <EmbedPreview url={featuredMixUrl} platform={detectPlatform(featuredMixUrl)} />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Social Links ────────────────────────────────────────────────────────

function SocialLinksTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();
  const s = NOVA_VEGA.socialLinks as Record<string, string>;

  const [vals, setVals] = useState({
    instagram: s.instagram ?? '',
    tiktok: '',
    youtube: '',
    twitter: '',
    facebook: '',
    website: '',
  });

  const PLATFORMS = [
    { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
    { key: 'tiktok',    label: 'TikTok',    placeholder: '@yourhandle' },
    { key: 'youtube',   label: 'YouTube',   placeholder: 'youtube.com/@yourchannel' },
    { key: 'twitter',   label: 'X / Twitter', placeholder: '@yourhandle' },
    { key: 'facebook',  label: 'Facebook',  placeholder: 'facebook.com/yourpage' },
    { key: 'website',   label: 'Website',   placeholder: 'yourwebsite.com' },
  ];

  return (
    <div className="space-y-5">
      <SectionCard title="Social Media Links" saveState={state}>
        <div className="space-y-3">
          {PLATFORMS.map(({ key, label, placeholder }) => (
            <UrlInput
              key={key}
              label={label}
              value={vals[key as keyof typeof vals]}
              onChange={(v) => { setVals((prev) => ({ ...prev, [key]: v })); markDirty(); onDirty(); }}
              placeholder={placeholder}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Technical Rider ─────────────────────────────────────────────────────

function TechnicalRiderTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [setupType, setSetupType] = useState<'dj' | 'live'>('dj');
  const [decks, setDecks]           = useState('CDJ-3000 (2×)');
  const [mixer, setMixer]           = useState('DJM-900NXS2');
  const [djMonitor, setDjMonitor]   = useState('Preferred — Funktion-One or equivalent');
  const [inputs, setInputs]         = useState('2× DI box, 4× analog XLR');
  const [monitorSends, setMonitorSends] = useState('2× stereo monitor mix');
  const [backline, setBackline]     = useState('');
  const [stageSize, setStageSize]   = useState('');
  const [powerReq, setPowerReq]     = useState('Standard 13A');
  const [setupTime, setSetupTime]   = useState('30 minutes');
  const [soundCheckTime, setSoundCheckTime] = useState('30 minutes');
  const [special, setSpecial]       = useState('');

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      {/* Setup type */}
      <SectionCard title="Setup Type" saveState={state}>
        <div className="flex gap-3">
          {(['dj', 'live'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setSetupType(t); markDirty(); onDirty(); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                setupType === t
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-white/[0.03] border-white/[0.07] text-slate-500'
              }`}
            >
              {t === 'dj' ? '🎚 DJ Set' : '🎸 Live Act'}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* DJ Requirements */}
      {setupType === 'dj' && (
        <SectionCard title="DJ Equipment Requirements" saveState={state}>
          <Field label="Decks / Media Players" hint="e.g. CDJ-3000, Pioneer XDJ-RX3, Technics 1210s">
            <TextInput value={decks} onChange={ch(setDecks)} placeholder="CDJ-3000 (2×)" />
          </Field>
          <Field label="Mixer" hint="e.g. DJM-900NXS2, DJM-750MK2, Rotary mixer">
            <TextInput value={mixer} onChange={ch(setMixer)} placeholder="DJM-900NXS2" />
          </Field>
          <Field label="DJ Monitor Preference">
            <TextInput value={djMonitor} onChange={ch(setDjMonitor)} placeholder="e.g. Preferred — Funktion-One" />
          </Field>
        </SectionCard>
      )}

      {/* Live Requirements */}
      {setupType === 'live' && (
        <SectionCard title="Live Act Requirements" saveState={state}>
          <Field label="Input List" hint="Describe mic/line/DI inputs needed">
            <TextInput value={inputs} onChange={ch(setInputs)} placeholder="e.g. 2× DI, 4× XLR mic inputs" />
          </Field>
          <Field label="Monitor Sends" hint="Number of mixes and type">
            <TextInput value={monitorSends} onChange={ch(setMonitorSends)} placeholder="e.g. 2× stereo IEM mix" />
          </Field>
          <Field label="Backline Requirements" hint="Leave blank if not required">
            <TextInput value={backline} onChange={ch(setBackline)} placeholder="e.g. Drum kit with hardware" />
          </Field>
        </SectionCard>
      )}

      {/* Stage & scheduling */}
      <SectionCard title="Stage & Scheduling" saveState={state}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage Space Required">
            <TextInput value={stageSize} onChange={ch(setStageSize)} placeholder="e.g. 3×2m minimum" />
          </Field>
          <Field label="Power Requirements">
            <TextInput value={powerReq} onChange={ch(setPowerReq)} placeholder="e.g. 32A CEE" />
          </Field>
          <Field label="Load-in / Setup Time">
            <TextInput value={setupTime} onChange={ch(setSetupTime)} placeholder="e.g. 30 minutes" />
          </Field>
          <Field label="Sound Check Time">
            <TextInput value={soundCheckTime} onChange={ch(setSoundCheckTime)} placeholder="e.g. 30 minutes" />
          </Field>
        </div>
        <Field label="Additional Technical Notes" hint="Any special requirements not covered above">
          <textarea
            value={special}
            onChange={(e) => { setSpecial(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            placeholder="e.g. Modular synth with custom patch bay, visual feed out for VJ…"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Availability & Booking ──────────────────────────────────────────────

function AvailabilityTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const [available, setAvailable]     = useState(true);
  const [bookingTypes, setBookingTypes] = useState(['Club night', 'Festival slot', 'B2B set', 'Residency']);
  const [travel, setTravel]           = useState('national');
  const [minFee, setMinFee]           = useState('400');
  const [maxFee, setMaxFee]           = useState('');
  const [leadTime, setLeadTime]       = useState('2 weeks');
  const [bookingEmail, setBookingEmail] = useState('booking@novavega.com');
  const [notes, setNotes]             = useState('');

  function ch(setter: (v: string) => void) {
    return (v: string) => { setter(v); markDirty(); onDirty(); };
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <SectionCard title="Booking Status" saveState={state}>
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
          <div>
            <p className="text-white font-semibold text-sm">
              {available ? 'Currently accepting bookings' : 'Not accepting bookings'}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {available
                ? 'Venues and promoters can send you booking requests'
                : 'Your profile is visible but booking requests are paused'}
            </p>
          </div>
          <Toggle
            on={available}
            onChange={(v) => { setAvailable(v); markDirty(); onDirty(); }}
          />
        </div>
      </SectionCard>

      {/* Booking types */}
      <SectionCard title="Accepted Booking Types" saveState={state}>
        <ChipSelect
          options={BOOKING_TYPES}
          selected={bookingTypes}
          onToggle={(t) => {
            setBookingTypes((prev) =>
              prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
            );
            markDirty();
            onDirty();
          }}
          accentColor="#f43f5e"
        />
      </SectionCard>

      {/* Fee & travel */}
      <SectionCard title="Fee & Travel" saveState={state}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum Fee (Private)" hint="Only shared when you accept an inquiry">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">$</span>
              <TextInput value={minFee} onChange={ch(setMinFee)} placeholder="400" />
            </div>
          </Field>
          <Field label="Maximum Fee" hint="Optional — leave blank for 'negotiable'">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">$</span>
              <TextInput value={maxFee} onChange={ch(setMaxFee)} placeholder="Negotiable" />
            </div>
          </Field>
        </div>

        <Field label="Travel Radius">
          <div className="space-y-2">
            {TRAVEL_OPTIONS.map(({ id, label, description }) => (
              <button
                key={id}
                onClick={() => { setTravel(id); markDirty(); onDirty(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                  travel === id
                    ? 'bg-purple-500/15 border-purple-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div>
                  <span className={`text-sm font-medium ${travel === id ? 'text-purple-300' : 'text-slate-400'}`}>
                    {label}
                  </span>
                  <p className="text-slate-600 text-xs mt-0.5">{description}</p>
                </div>
                {travel === id && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </button>
            ))}
          </div>
        </Field>
      </SectionCard>

      {/* Booking preferences */}
      <SectionCard title="Booking Preferences" saveState={state}>
        <Field label="Advance Notice Required">
          <div className="flex flex-wrap gap-2">
            {LEAD_TIME_OPTIONS.map((t) => (
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

        <Field label="Booking Contact Email">
          <TextInput value={bookingEmail} onChange={ch(setBookingEmail)} placeholder="your@email.com" />
        </Field>

        <Field label="Booking Notes" hint="Shown to venues/promoters when they view your profile">
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); markDirty(); onDirty(); }}
            rows={3}
            placeholder="e.g. International travel requires flights and accommodation to be covered…"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-purple-500/50 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Privacy ─────────────────────────────────────────────────────────────

function PrivacyTab({ onDirty }: { onDirty: () => void }) {
  const { state, markDirty } = useAutosave();

  const SETTINGS = [
    { id: 'discover',   label: 'Show profile in Discover', description: 'Let other professionals find you in search and browse', on: true },
    { id: 'history',    label: 'Show booking history', description: 'Display your past shows publicly on your profile', on: true },
    { id: 'directBook', label: 'Allow direct booking requests', description: 'Venues can send booking inquiries without prior connection', on: true },
    { id: 'realName',   label: 'Show real name on profile', description: 'Display your legal name alongside your artist name', on: false },
    { id: 'followers',  label: 'Show follower count publicly', description: 'Let visitors see your follower count', on: true },
    { id: 'analytics',  label: 'Share anonymised analytics', description: 'Help Stagefront improve discovery (no personal data)', on: true },
    { id: 'seo',        label: 'Allow search engine indexing', description: 'Allow Google to find your Stagefront profile', on: true },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.on]))
  );

  return (
    <div className="space-y-5">
      <SectionCard title="Privacy & Visibility" saveState={state}>
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

      <SectionCard title="Account Actions" description="Irreversible actions — proceed with caution">
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.07] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group">
            <div>
              <p className="text-slate-300 text-sm font-medium group-hover:text-amber-300 transition-colors">Download My Data</p>
              <p className="text-slate-600 text-xs mt-0.5">Export all your profile data, connections, and messages</p>
            </div>
            <FileText className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.07] hover:border-rose-500/30 hover:bg-rose-500/5 transition-all group">
            <div>
              <p className="text-slate-300 text-sm font-medium group-hover:text-rose-300 transition-colors">Delete Account</p>
              <p className="text-slate-600 text-xs mt-0.5">Permanently remove your profile and all associated data</p>
            </div>
            <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfileSettingsPage() {
  const { profileSlug } = useAuth();
  const myProfileHref = profileSlug ? `/profile/${profileSlug}` : '#';
  const [activeTab, setActiveTab]   = useState('profile');
  const [showPreview, setShowPreview] = useState(false);
  const [globalDirty, setGlobalDirty] = useState(false);

  // Preview state — lifted up so preview pane can read current values
  const [preview, setPreview] = useState({
    name: NOVA_VEGA.name,
    bio: NOVA_VEGA.bio,
    city: NOVA_VEGA.city,
    genres: NOVA_VEGA.genres,
    avatar: NOVA_VEGA.avatar,
    banner: NOVA_VEGA.banner,
  });

  function markDirty() { setGlobalDirty(true); }
  function patchPreview(p: Partial<typeof preview>) { setPreview((prev) => ({ ...prev, ...p })); }

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">

      {/* ── Top nav ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 glass border-b border-white/[0.05] flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <Link
            href={myProfileHref}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Profile</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <span className="text-white font-bold text-sm">Profile Settings</span>

          <div className="flex-1" />

          {/* Preview toggle */}
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

          {/* Global save */}
          <button
            onClick={() => setGlobalDirty(false)}
            className="relative font-semibold text-white text-sm px-5 py-2 rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <span className="relative flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              Save all
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
          <button
            onClick={() => setGlobalDirty(false)}
            className="text-xs text-amber-300 hover:text-white transition-colors"
          >
            Save now
          </button>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left content + sidebar ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

              {/* Sidebar nav */}
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
                  href={myProfileHref}
                  className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-600 hover:text-purple-400 transition-colors"
                >
                  <Eye className="w-3 h-3" /> View public profile
                </Link>
              </aside>

              {/* Tab content */}
              <main className="lg:col-span-1 min-w-0">
                {activeTab === 'profile' && (
                  <ProfileInfoTab onDirty={markDirty} preview={preview} onPreviewChange={patchPreview} />
                )}
                {activeTab === 'media' && (
                  <MediaTab onDirty={markDirty} onPreviewChange={patchPreview} />
                )}
                {activeTab === 'musicvideo' && <MusicVideoTab onDirty={markDirty} />}
                {activeTab === 'links' && <SocialLinksTab onDirty={markDirty} />}
                {activeTab === 'rider' && <TechnicalRiderTab onDirty={markDirty} />}
                {activeTab === 'availability' && <AvailabilityTab onDirty={markDirty} />}
                {activeTab === 'privacy' && <PrivacyTab onDirty={markDirty} />}
              </main>
            </div>
          </div>
        </div>

        {/* ── Preview pane ──────────────────────────────────────────────────── */}
        {showPreview && (
          <PreviewPane
            name={preview.name}
            bio={preview.bio}
            city={preview.city}
            genres={preview.genres}
            avatar={preview.avatar}
            banner={preview.banner}
            accentColor={NOVA_VEGA.accentColor}
          />
        )}
      </div>
    </div>
  );
}

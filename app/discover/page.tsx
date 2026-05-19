'use client';

import { Suspense } from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, LayoutGrid, List, SlidersHorizontal, X, Star,
  MapPin, Users, CheckCircle, Zap, ChevronRight, ChevronDown,
  Bookmark, BookmarkCheck, Clock, Ticket, Music2, Camera,
  Video, Lightbulb, Speaker, Megaphone, Globe, Filter,
  TrendingUp, Sparkles, LayoutDashboard,
} from 'lucide-react';
import {
  ALL_ENTRIES,
  ALL_CITIES, ALL_GENRES, KIND_LABELS, KIND_COLOR,
  type DiscoverEntry, type EntityKind, type SavedSearch,
} from '@/lib/data/discover';

// ─── Category config ──────────────────────────────────────────────────────────

type FilterTab = 'all' | EntityKind;

const TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: 'all',          label: 'All',          icon: LayoutGrid },
  { id: 'artist',       label: 'Artists',      icon: Music2 },
  { id: 'venue',        label: 'Venues',       icon: Globe },
  { id: 'promoter',     label: 'Promoters',    icon: Megaphone },
  { id: 'photographer', label: 'Photographers',icon: Camera },
  { id: 'videographer', label: 'Videographers',icon: Video },
  { id: 'lighting',     label: 'Lighting',     icon: Lightbulb },
  { id: 'sound',        label: 'Sound',        icon: Speaker },
  { id: 'event',        label: 'Events',       icon: Ticket },
  { id: 'scene',        label: 'Scenes',       icon: MapPin },
];

const SORT_OPTIONS = [
  { id: 'relevance',  label: 'Relevance' },
  { id: 'rating',     label: 'Top Rated' },
  { id: 'followers',  label: 'Most Followed' },
  { id: 'draw',       label: 'Biggest Draw' },
];

// ─── Filter state ─────────────────────────────────────────────────────────────

interface FilterState {
  query: string;
  tab: FilterTab;
  cities: string[];
  genres: string[];
  verified: boolean | null;
  available: boolean | null;
  collabInterest: boolean | null;
  minRating: number;
  minFollowers: number;
  maxFeeMin: number;
  minCapacity: number;
  maxCapacity: number;
}

const EMPTY_FILTERS: FilterState = {
  query: '',
  tab: 'all',
  cities: [],
  genres: [],
  verified: null,
  available: null,
  collabInterest: null,
  minRating: 0,
  minFollowers: 0,
  maxFeeMin: 99999,
  minCapacity: 0,
  maxCapacity: 99999,
};

function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.cities.length) n++;
  if (f.genres.length) n++;
  if (f.verified !== null) n++;
  if (f.available !== null) n++;
  if (f.collabInterest !== null) n++;
  if (f.minRating > 0) n++;
  if (f.minFollowers > 0) n++;
  if (f.maxFeeMin < 99999) n++;
  if (f.minCapacity > 0 || f.maxCapacity < 99999) n++;
  return n;
}

// ─── Rating stars ─────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
      <span className="text-slate-500 text-[11px] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Genre chips ──────────────────────────────────────────────────────────────

function GenreChips({ genres, accent }: { genres: string[]; accent: string }) {
  const shown = genres.slice(0, 3);
  const rest = genres.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((g) => (
        <span
          key={g}
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          {g}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-slate-500">
          +{rest}
        </span>
      )}
    </div>
  );
}

// ─── Kind pill ────────────────────────────────────────────────────────────────

function KindPill({ kind }: { kind: EntityKind }) {
  const color = KIND_COLOR[kind];
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {KIND_LABELS[kind]}
    </span>
  );
}

// ─── Ticket fill bar ──────────────────────────────────────────────────────────

function TicketBar({ sold, total, accent }: { sold: number; total: number; accent: string }) {
  const pct = Math.round((sold / total) * 100);
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{sold}/{total} tickets</span>
        <span style={{ color: pct >= 90 ? '#f43f5e' : accent }}>{pct}%</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? '#f43f5e' : accent }}
        />
      </div>
    </div>
  );
}

// ─── GRID CARD ────────────────────────────────────────────────────────────────

function GridCard({
  entry,
  saved,
  onSave,
}: {
  entry: DiscoverEntry;
  saved: boolean;
  onSave: () => void;
}) {
  const { kind, name, city, country, image, coverImage, accentColor, verified,
          href, genres, role, rating, reviewCount, followers, fee, draw,
          capacity, tagline, date, venueName, headliner, ticketsSold,
          totalTickets, ticketPrice, artistCount, venueCount, eventsMonth,
          available, collabInterest, specialties } = entry;

  const isEvent = kind === 'event';
  const isScene = kind === 'scene';
  const isVenue = kind === 'venue';
  const isCrew  = ['promoter','photographer','videographer','lighting','sound'].includes(kind);

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 group flex flex-col">
      {/* Cover */}
      <div className="relative h-40 flex-shrink-0 overflow-hidden">
        <img
          src={coverImage ?? image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/40 to-transparent" />

        {/* Save */}
        <button
          onClick={(e) => { e.preventDefault(); onSave(); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center hover:bg-black/60 transition-all"
        >
          {saved
            ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
            : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Kind pill */}
        <div className="absolute top-2.5 left-2.5">
          <KindPill kind={kind} />
        </div>

        {/* Artist/crew avatar overlap */}
        {!isEvent && !isScene && !isVenue && (
          <div className="absolute -bottom-5 left-4">
            <div className="w-12 h-12 rounded-xl border-2 overflow-hidden" style={{ borderColor: accentColor }}>
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Venue capacity badge */}
        {isVenue && (
          <div className="absolute bottom-2.5 left-3">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}40` }}
            >
              Cap. {capacity?.toLocaleString()}
            </span>
          </div>
        )}

        {/* Event date block */}
        {isEvent && date && (
          <div
            className="absolute bottom-2.5 left-3 rounded-xl px-3 py-1.5 text-center"
            style={{ backgroundColor: `${accentColor}25`, border: `1px solid ${accentColor}40` }}
          >
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
              {date.split(' ')[0]}
            </div>
            <div className="text-white text-sm font-black leading-none">
              {date.split(' ')[1]} {date.split(' ')[2]}
            </div>
          </div>
        )}

        {/* Scene stats overlay */}
        {isScene && (
          <div className="absolute bottom-2.5 left-3 right-3 flex gap-2">
            {[
              { val: artistCount, label: 'artists' },
              { val: venueCount, label: 'venues' },
              { val: eventsMonth, label: 'events/mo' },
            ].map(({ val, label }) => (
              <div key={label} className="flex-1 text-center rounded-lg py-1" style={{ backgroundColor: `${accentColor}20` }}>
                <div className="text-white text-xs font-black">{val}</div>
                <div className="text-[9px] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`flex-1 flex flex-col p-4 ${!isEvent && !isScene && !isVenue ? 'pt-7' : 'pt-3'}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="text-white font-bold text-sm leading-tight">{name}</h3>
            {role && <p className="text-slate-500 text-[11px] mt-0.5">{role}</p>}
            {isVenue && tagline && <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{tagline}</p>}
          </div>
          {verified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />}
        </div>

        <div className="flex items-center gap-1 text-slate-600 text-[11px] mb-2">
          <MapPin className="w-3 h-3" />
          {city}{country !== 'US' ? `, ${country}` : ''}
        </div>

        <div className="mb-2.5">
          <GenreChips genres={specialties ?? genres} accent={accentColor} />
        </div>

        <div className="flex-1" />

        <div className="space-y-2">
          {typeof rating === 'number' && rating > 0 && (
            <div className="flex items-center justify-between">
              <Stars rating={rating} />
              {reviewCount ? <span className="text-slate-600 text-[10px]">{reviewCount} reviews</span> : null}
            </div>
          )}

          {/* Artist stats */}
          {kind === 'artist' && (
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              {followers && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
                </span>
              )}
              {draw && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />~{draw} draw
                </span>
              )}
              {fee && <span className="text-slate-400 font-medium ml-auto">{fee}</span>}
            </div>
          )}

          {/* Crew stats */}
          {isCrew && (
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              {followers && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
                </span>
              )}
              {available && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Clock className="w-3 h-3" /> Available
                </span>
              )}
              {fee && <span className="text-slate-400 font-medium ml-auto">{fee}</span>}
            </div>
          )}

          {/* Event ticket bar */}
          {isEvent && ticketsSold !== undefined && totalTickets !== undefined && (
            <TicketBar sold={ticketsSold} total={totalTickets} accent={accentColor} />
          )}

          {/* Event meta */}
          {isEvent && (
            <div className="text-[11px] text-slate-500 space-y-0.5">
              {venueName && <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> {venueName}</div>}
              {headliner && <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> {headliner}</div>}
              {ticketPrice && <div className="text-slate-400 font-medium">{ticketPrice}</div>}
            </div>
          )}

          {/* Collab badge */}
          {!isEvent && !isScene && collabInterest && (
            <div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                Open to Collabs
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <Link
            href={href}
            className="block w-full text-center text-xs font-semibold py-2 rounded-xl transition-all"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            {isEvent ? 'View Event' : isScene ? 'Explore Scene' : isVenue ? 'View Venue' : 'View Profile'}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── LIST ROW ─────────────────────────────────────────────────────────────────

function ListRow({
  entry,
  saved,
  onSave,
}: {
  entry: DiscoverEntry;
  saved: boolean;
  onSave: () => void;
}) {
  const { kind, name, city, country, image, accentColor, verified, href,
          genres, role, rating, followers, fee, draw, capacity,
          date, venueName, headliner, ticketsSold, totalTickets,
          artistCount, venueCount, eventsMonth, available, specialties } = entry;

  const isEvent = kind === 'event';
  const isScene = kind === 'scene';
  const isVenue = kind === 'venue';

  return (
    <div className="glass rounded-2xl border border-white/[0.07] hover:border-white/[0.13] transition-all duration-200 flex items-center gap-4 p-3.5">
      <div
        className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border"
        style={{ borderColor: `${accentColor}40` }}
      >
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold text-sm">{name}</span>
          {verified && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
          <KindPill kind={kind} />
          {available && !isEvent && !isScene && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
              Available
            </span>
          )}
          {isEvent && date && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />{city}{country !== 'US' ? `, ${country}` : ''}
          </span>
          {role && <span className="text-slate-600">{role}</span>}
          {isVenue && capacity && <span>Cap. {capacity.toLocaleString()}</span>}
          {isEvent && venueName && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{venueName}</span>}
          {isEvent && headliner && <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{headliner}</span>}
          {isScene && <span>{artistCount} artists · {venueCount} venues · {eventsMonth} events/mo</span>}
        </div>

        <GenreChips genres={specialties ?? genres} accent={accentColor} />
      </div>

      {/* Right stats */}
      <div className="flex-shrink-0 text-right space-y-1.5 hidden sm:block min-w-[80px]">
        {typeof rating === 'number' && rating > 0 && <Stars rating={rating} />}
        {followers && (
          <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
            <Users className="w-3 h-3" />
            {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
          </div>
        )}
        {fee && <div className="text-[11px] text-slate-400 font-semibold">{fee}</div>}
        {draw && <div className="text-[11px] text-slate-500">~{draw} draw</div>}
        {isEvent && ticketsSold !== undefined && totalTickets !== undefined && (
          <div className="text-[10px]" style={{ color: ticketsSold / totalTickets >= 0.9 ? '#f43f5e' : '#64748b' }}>
            {Math.round((ticketsSold / totalTickets) * 100)}% sold
          </div>
        )}
      </div>

      {/* Save + CTA */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <button
          onClick={(e) => { e.preventDefault(); onSave(); }}
          className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.08] transition-all"
        >
          {saved
            ? <BookmarkCheck className="w-4 h-4 text-purple-400" />
            : <Bookmark className="w-4 h-4 text-slate-500" />}
        </button>
        <Link
          href={href}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {isEvent ? 'View' : isScene ? 'Explore' : isVenue ? 'Venue' : 'Profile'}
        </Link>
      </div>
    </div>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  filters,
  onChange,
  onReset,
  tab,
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  tab: FilterTab;
}) {
  const showCapacity = tab === 'venue' || tab === 'all';
  const showDraw     = tab === 'artist' || tab === 'all';

  function toggleCity(c: string) {
    onChange({
      cities: filters.cities.includes(c)
        ? filters.cities.filter((x) => x !== c)
        : [...filters.cities, c],
    });
  }

  function toggleGenre(g: string) {
    onChange({
      genres: filters.genres.includes(g)
        ? filters.genres.filter((x) => x !== g)
        : [...filters.genres, g],
    });
  }

  const TOP_CITIES  = ['Chicago', 'Detroit', 'Berlin', 'New York', 'London', 'Milwaukee'];
  const TOP_GENRES  = ['Techno', 'Industrial', 'EBM', 'Dark Electro', 'Minimal', 'Ambient', 'House', 'Experimental', 'Noise', 'Dub Techno'];

  return (
    <aside className="space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-white font-bold text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" /> Filters
        </span>
        <button onClick={onReset} className="text-[11px] text-slate-500 hover:text-purple-400 transition-colors">
          Reset all
        </button>
      </div>

      {/* City */}
      <div>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">City</p>
        <div className="flex flex-wrap gap-1.5">
          {TOP_CITIES.map((c) => {
            const active = filters.cities.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCity(c)}
                className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                  active
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/[0.14]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre */}
      <div>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Genre</p>
        <div className="flex flex-wrap gap-1.5">
          {TOP_GENRES.map((g) => {
            const active = filters.genres.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/[0.14]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified status */}
      <div>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Status</p>
        <div className="space-y-1.5">
          {([{ val: null, label: 'All' }, { val: true, label: 'Verified only' }] as { val: boolean | null; label: string }[]).map(({ val, label }) => (
            <button
              key={label}
              onClick={() => onChange({ verified: val })}
              className={`w-full text-left text-[12px] px-3 py-2 rounded-xl border transition-all ${
                filters.verified === val
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      {!['event', 'scene', 'venue'].includes(tab) && (
        <div>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Availability</p>
          <div className="space-y-1.5">
            {([{ val: null, label: 'All' }, { val: true, label: 'Available now' }] as { val: boolean | null; label: string }[]).map(({ val, label }) => (
              <button
                key={label}
                onClick={() => onChange({ available: val })}
                className={`w-full text-left text-[12px] px-3 py-2 rounded-xl border transition-all ${
                  filters.available === val
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collab interest */}
      {!['event', 'scene'].includes(tab) && (
        <div>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Collaboration</p>
          <div className="space-y-1.5">
            {([{ val: null, label: 'All' }, { val: true, label: 'Open to collaborating' }] as { val: boolean | null; label: string }[]).map(({ val, label }) => (
              <button
                key={label}
                onClick={() => onChange({ collabInterest: val })}
                className={`w-full text-left text-[12px] px-3 py-2 rounded-xl border transition-all ${
                  filters.collabInterest === val
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Min rating */}
      <div>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Minimum Rating</p>
        <div className="flex gap-1.5">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ minRating: r })}
              className={`flex-1 text-[11px] py-1.5 rounded-lg border transition-all ${
                filters.minRating === r
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300'
              }`}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Audience size / followers */}
      {showDraw && (
        <div>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Audience Size</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { val: 0,     label: 'Any' },
              { val: 1000,  label: '1k+' },
              { val: 5000,  label: '5k+' },
              { val: 10000, label: '10k+' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => onChange({ minFollowers: val })}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                  filters.minFollowers === val
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Venue capacity */}
      {showCapacity && (
        <div>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Venue Capacity</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { min: 0,   max: 99999, label: 'Any' },
              { min: 0,   max: 250,   label: '≤ 250' },
              { min: 250, max: 500,   label: '250–500' },
              { min: 500, max: 99999, label: '500+' },
            ].map(({ min, max, label }) => {
              const active = filters.minCapacity === min && filters.maxCapacity === max;
              return (
                <button
                  key={label}
                  onClick={() => onChange({ minCapacity: min, maxCapacity: max })}
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Recommended card ─────────────────────────────────────────────────────────

function RecommendedCard({ entry }: { entry: DiscoverEntry }) {
  const { name, image, accentColor, verified, href, genres, role, rating, city, kind } = entry;
  return (
    <Link
      href={href}
      className="glass rounded-xl border border-white/[0.07] hover:border-white/[0.14] transition-all p-3 flex items-center gap-3 group"
    >
      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border" style={{ borderColor: `${accentColor}50` }}>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-white text-xs font-bold truncate">{name}</span>
          {verified && <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
        </div>
        <div className="text-slate-500 text-[11px]">{role ?? KIND_LABELS[kind]} · {city}</div>
        {typeof rating === 'number' && rating > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-[10px] font-semibold">{rating.toFixed(1)}</span>
            <span className="text-[10px] px-1 rounded font-medium ml-0.5" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>
              {genres[0]}
            </span>
          </div>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
    </Link>
  );
}

// ─── Saved search pill ────────────────────────────────────────────────────────

function SavedSearchPill({
  search,
  onLoad,
  onDelete,
}: {
  search: SavedSearch;
  onLoad: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 glass rounded-full pl-3 pr-1 py-1 border border-white/[0.07] hover:border-white/[0.13] transition-all">
      <button onClick={onLoad} className="text-[11px] text-slate-300 hover:text-white transition-colors whitespace-nowrap">
        <Bookmark className="w-3 h-3 text-purple-400 inline mr-1" />
        {search.label}
      </button>
      <button
        onClick={onDelete}
        className="w-4 h-4 rounded-full bg-white/[0.07] hover:bg-red-500/20 flex items-center justify-center transition-all"
      >
        <X className="w-2.5 h-2.5 text-slate-500" />
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function DiscoverPageInner() {
  const searchParams = useSearchParams();
  const [view, setView]               = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters]  = useState(true);
  const [sort, setSort]               = useState('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filters, setFilters]         = useState<FilterState>(EMPTY_FILTERS);
  const [savedIds, setSavedIds]       = useState<Set<string>>(new Set());
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: 'ss1', label: 'Chicago Techno Artists', query: '', kinds: ['artist'], city: 'Chicago', genres: ['Techno'], createdAt: '2026-05-10' },
    { id: 'ss2', label: 'Available Photographers', query: '', kinds: ['photographer'], city: '', genres: [], createdAt: '2026-05-12' },
  ]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [saveLabel, setSaveLabel]     = useState('');

  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const genre = searchParams.get('genre');
    if (genre) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters(prev => ({ ...prev, genres: [genre] }));
    }
  }, [searchParams]);

  function patchFilter(patch: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setFilters({ ...EMPTY_FILTERS, tab: filters.tab });
  }

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let pool = [...ALL_ENTRIES];

    if (filters.tab !== 'all') {
      pool = pool.filter((e) => e.kind === filters.tab);
    }

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      pool = pool.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        (e.role ?? '').toLowerCase().includes(q) ||
        (e.bio ?? '').toLowerCase().includes(q) ||
        e.genres.some((g) => g.toLowerCase().includes(q)) ||
        (e.specialties ?? []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.cities.length) {
      pool = pool.filter((e) => filters.cities.includes(e.city));
    }

    if (filters.genres.length) {
      pool = pool.filter((e) => filters.genres.some((g) => e.genres.includes(g)));
    }

    if (filters.verified !== null) {
      pool = pool.filter((e) => e.verified === filters.verified);
    }

    if (filters.available !== null) {
      pool = pool.filter((e) => e.available === filters.available);
    }

    if (filters.collabInterest !== null) {
      pool = pool.filter((e) => e.collabInterest === filters.collabInterest);
    }

    if (filters.minRating > 0) {
      pool = pool.filter((e) => (e.rating ?? 0) >= filters.minRating);
    }

    if (filters.minFollowers > 0) {
      pool = pool.filter((e) => (e.followers ?? 0) >= filters.minFollowers);
    }

    if (filters.maxFeeMin < 99999) {
      pool = pool.filter((e) => e.feeMin === undefined || e.feeMin <= filters.maxFeeMin);
    }

    if (filters.minCapacity > 0 || filters.maxCapacity < 99999) {
      pool = pool.filter((e) => {
        if (e.kind !== 'venue') return true;
        const cap = e.capacity ?? 0;
        return cap >= filters.minCapacity && cap <= filters.maxCapacity;
      });
    }

    if (sort === 'rating')     pool.sort((a, b) => (b.rating    ?? 0) - (a.rating    ?? 0));
    if (sort === 'followers')  pool.sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
    if (sort === 'draw')       pool.sort((a, b) => (b.draw      ?? 0) - (a.draw      ?? 0));

    return pool;
  }, [filters, sort]);

  // ── Recommended ───────────────────────────────────────────────────────────

  const recommended = useMemo(() =>
    ALL_ENTRIES
      .filter((e) => ['artist', 'photographer', 'venue'].includes(e.kind) && e.verified)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 6),
    []
  );

  // ── Saved toggle ──────────────────────────────────────────────────────────

  function toggleSaved(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveCurrentSearch() {
    if (!saveLabel.trim()) return;
    const s: SavedSearch = {
      id: `ss${Date.now()}`,
      label: saveLabel.trim(),
      query: filters.query,
      kinds: filters.tab === 'all' ? [] : [filters.tab as EntityKind],
      city: filters.cities[0] ?? '',
      genres: filters.genres,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSavedSearches((prev) => [s, ...prev]);
    setSaveLabel('');
    setShowSaveSearch(false);
  }

  function loadSavedSearch(s: SavedSearch) {
    setFilters({ ...EMPTY_FILTERS, query: s.query, tab: s.kinds[0] ?? 'all', cities: s.city ? [s.city] : [], genres: s.genres });
  }

  function deleteSavedSearch(id: string) {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  }

  const filterCount = activeFilterCount(filters);
  const sortLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? 'Sort';
  const isDefaultView = filters.query === '' && filters.tab === 'all' && filterCount === 0;

  return (
    <div className="min-h-screen bg-[#060608]">

      {/* ── Sticky nav / search bar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-2 flex-shrink-0">
        <Link href="/" className="font-black text-sm tracking-tight gradient-text-purple hidden sm:block">STAGEFRONT</Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors hidden sm:flex items-center gap-1.5">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <span className="text-white font-semibold text-sm flex items-center gap-1.5">
          <Search className="w-4 h-4 text-purple-400" /> Discover
        </span>

        {/* Search */}
        <div className="flex-1 max-w-sm ml-auto sm:ml-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => patchFilter({ query: e.target.value })}
            placeholder="Search artists, venues, events…"
            className="w-full glass rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06] focus:border-purple-500/40 transition-colors"
          />
          {filters.query && (
            <button onClick={() => patchFilter({ query: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all ${
              showFilters
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-white/[0.04] border-white/[0.07] text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {filterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
          <div className="flex rounded-xl border border-white/[0.07] overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-2.5 py-2 transition-all ${view === 'grid' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500 hover:text-white bg-white/[0.02]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-2.5 py-2 transition-all ${view === 'list' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500 hover:text-white bg-white/[0.02]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">

        {/* ── Filter sidebar ─────────────────────────────────────────────────── */}
        {showFilters && (
          <div className="hidden lg:block w-64 flex-shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-r border-white/[0.06] p-5 bg-[#060608]">
            <FilterPanel filters={filters} onChange={patchFilter} onReset={resetFilters} tab={filters.tab} />
          </div>
        )}

        {/* ── Main content ────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 space-y-5">

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = filters.tab === id;
              const count = id === 'all'
                ? ALL_ENTRIES.length
                : ALL_ENTRIES.filter((e) => e.kind === id).length;
              return (
                <button
                  key={id}
                  onClick={() => patchFilter({ tab: id })}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    active
                      ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span className={`text-[10px] ${active ? 'text-purple-400' : 'text-slate-600'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Saved searches */}
          {savedSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Saved:
              </span>
              {savedSearches.map((s) => (
                <SavedSearchPill
                  key={s.id}
                  search={s}
                  onLoad={() => loadSavedSearch(s)}
                  onDelete={() => deleteSavedSearch(s.id)}
                />
              ))}
            </div>
          )}

          {/* Active filter chips */}
          {filterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-600">Active:</span>
              {filters.cities.map((c) => (
                <button key={c} onClick={() => patchFilter({ cities: filters.cities.filter((x) => x !== c) })}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all">
                  <MapPin className="w-2.5 h-2.5" /> {c} <X className="w-2.5 h-2.5" />
                </button>
              ))}
              {filters.genres.map((g) => (
                <button key={g} onClick={() => patchFilter({ genres: filters.genres.filter((x) => x !== g) })}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all">
                  <Music2 className="w-2.5 h-2.5" /> {g} <X className="w-2.5 h-2.5" />
                </button>
              ))}
              {filters.verified && (
                <button onClick={() => patchFilter({ verified: null })}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified <X className="w-2.5 h-2.5" />
                </button>
              )}
              {filters.available && (
                <button onClick={() => patchFilter({ available: null })}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Clock className="w-2.5 h-2.5" /> Available <X className="w-2.5 h-2.5" />
                </button>
              )}
              {filters.minRating > 0 && (
                <button onClick={() => patchFilter({ minRating: 0 })}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Star className="w-2.5 h-2.5" /> {filters.minRating}+ <X className="w-2.5 h-2.5" />
                </button>
              )}
              <button onClick={resetFilters} className="text-[11px] text-slate-500 hover:text-red-400 transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Results bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">
                <span className="text-white font-bold">{filtered.length}</span> results
              </span>
              {filters.query && (
                <span className="text-slate-600 text-xs">
                  for &ldquo;<span className="text-slate-300">{filters.query}</span>&rdquo;
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showSaveSearch ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={saveLabel}
                    onChange={(e) => setSaveLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveCurrentSearch();
                      if (e.key === 'Escape') setShowSaveSearch(false);
                    }}
                    placeholder="Name this search…"
                    autoFocus
                    className="glass rounded-lg px-2.5 py-1.5 text-white text-xs border border-white/[0.1] outline-none focus:border-purple-500/40 w-36"
                  />
                  <button onClick={saveCurrentSearch} className="text-[11px] px-2.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Save
                  </button>
                  <button onClick={() => setShowSaveSearch(false)} className="text-slate-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSaveSearch(true)} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-purple-400 transition-colors">
                  <Bookmark className="w-3.5 h-3.5" /> Save search
                </button>
              )}

              {/* Sort dropdown */}
              <div className="relative" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white transition-all"
                >
                  {sortLabel} <ChevronDown className="w-3 h-3" />
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 glass rounded-xl border border-white/[0.1] overflow-hidden z-20 shadow-xl">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => { setSort(o.id); setShowSortMenu(false); }}
                        className={`w-full text-left text-xs px-4 py-2.5 transition-colors ${
                          sort === o.id ? 'text-purple-300 bg-purple-500/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recommended section (default view only) ──────────────────────── */}
          {isDefaultView && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-bold text-sm">Recommended for you</h2>
                <span className="text-slate-600 text-xs">Based on your Chicago scene activity</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommended.map((entry) => (
                  <RecommendedCard key={entry.id} entry={entry} />
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-white font-bold text-sm">Browse All</h2>
                </div>
              </div>
            </section>
          )}

          {/* ── Results ──────────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 space-y-3">
              <Search className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-slate-500 text-sm">No results match your filters</p>
              <button onClick={resetFilters} className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
                Clear all filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((entry) => (
                <GridCard key={entry.id} entry={entry} saved={savedIds.has(entry.id)} onSave={() => toggleSaved(entry.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((entry) => (
                <ListRow key={entry.id} entry={entry} saved={savedIds.has(entry.id)} onSave={() => toggleSaved(entry.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060608]" />}>
      <DiscoverPageInner />
    </Suspense>
  );
}

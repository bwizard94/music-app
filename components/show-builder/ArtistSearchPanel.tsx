'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, Users, TrendingUp, Plus, Check, Zap, X } from 'lucide-react';
import type { Artist, LineupSlot } from './showData';
import { ARTIST_POOL, getCompatibility } from './showData';

interface Props {
  lineup: LineupSlot[];
  onAddArtist: (artist: Artist) => void;
  onDragStart: (artist: Artist) => void;
}

const ALL_GENRES = ['All Genres', 'Techno', 'Industrial', 'House', 'Ambient', 'Noise', 'EBM', 'Experimental', 'Minimal'];
const ALL_CITIES = ['All Cities', 'Chicago', 'Detroit', 'Berlin', 'London', 'Amsterdam', 'New York', 'Milwaukee'];

export default function ArtistSearchPanel({ lineup, onAddArtist, onDragStart }: Props) {
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All Genres');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [showFilters, setShowFilters] = useState(false);
  const [drawFilter, setDrawFilter] = useState<'all' | 'local' | 'touring' | 'international'>('all');

  const lineupIds = new Set(lineup.map((s) => s.artist.id));

  const filtered = useMemo(() => {
    return ARTIST_POOL
      .filter((a) => {
        const q = query.toLowerCase();
        if (q && !a.name.toLowerCase().includes(q) && !a.genres.join(' ').toLowerCase().includes(q)) return false;
        if (genreFilter !== 'All Genres' && !a.genres.some((g) => g.toLowerCase().includes(genreFilter.toLowerCase()))) return false;
        if (cityFilter !== 'All Cities' && a.city !== cityFilter) return false;
        if (drawFilter === 'local' && a.draw > 180) return false;
        if (drawFilter === 'touring' && (a.draw < 180 || a.draw > 280)) return false;
        if (drawFilter === 'international' && a.draw < 280) return false;
        return true;
      })
      .map((a) => ({ ...a, compat: getCompatibility(a, lineup) }))
      .sort((a, b) => (lineup.length > 0 ? b.compat - a.compat : b.draw - a.draw));
  }, [query, genreFilter, cityFilter, drawFilter, lineup]);

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-white font-bold text-sm flex-1">Artist Search</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={showFilters
              ? { backgroundColor: '#a855f720', color: '#a855f7', border: '1px solid #a855f740' }
              : { color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            <SlidersHorizontal className="w-3 h-3" />
            Filters
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, genres…"
            className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1.5">Genre</p>
              <div className="flex flex-wrap gap-1">
                {ALL_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenreFilter(g)}
                    className="text-[10px] px-2 py-0.5 rounded-full transition-all border"
                    style={genreFilter === g
                      ? { backgroundColor: '#a855f720', color: '#a855f7', borderColor: '#a855f740' }
                      : { color: '#475569', borderColor: 'rgba(255,255,255,0.07)' }
                    }
                  >
                    {g === 'All Genres' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1.5">City</p>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full glass rounded-lg px-2.5 py-1.5 text-slate-300 text-xs outline-none bg-white/[0.03] border border-white/[0.06]"
              >
                {ALL_CITIES.map((c) => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
              </select>
            </div>
            <div>
              <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1.5">Draw Size</p>
              <div className="flex gap-1">
                {[['all', 'All'], ['local', 'Local'], ['touring', 'Touring'], ['international', 'Intl']] .map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setDrawFilter(v as typeof drawFilter)}
                    className="flex-1 text-[10px] py-1 rounded-lg border transition-all"
                    style={drawFilter === v
                      ? { backgroundColor: '#a855f720', color: '#a855f7', borderColor: '#a855f740' }
                      : { color: '#475569', borderColor: 'rgba(255,255,255,0.07)' }
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Artist list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-600 text-xs">No artists match your filters</div>
        )}
        {filtered.map((artist) => {
          const inLineup = lineupIds.has(artist.id);
          return (
            <ArtistCard
              key={artist.id}
              artist={artist}
              compat={artist.compat}
              inLineup={inLineup}
              showCompat={lineup.length > 0}
              onAdd={() => !inLineup && onAddArtist(artist)}
              onDragStart={() => !inLineup && onDragStart(artist)}
            />
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-white/[0.06]">
        <p className="text-slate-700 text-[10px] text-center">
          {filtered.length} artists · Drag to lineup or click +
        </p>
      </div>
    </div>
  );
}

function ArtistCard({ artist, compat, inLineup, showCompat, onAdd, onDragStart }: {
  artist: Artist & { compat: number };
  compat: number;
  inLineup: boolean;
  showCompat: boolean;
  onAdd: () => void;
  onDragStart: () => void;
}) {
  const compatColor = compat >= 70 ? '#10b981' : compat >= 45 ? '#f59e0b' : '#64748b';

  return (
    <div
      draggable={!inLineup}
      onDragStart={onDragStart}
      className={`group relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 ${
        inLineup
          ? 'opacity-40 cursor-default border-white/[0.04]'
          : 'cursor-grab active:cursor-grabbing hover:border-white/[0.14] border-white/[0.06]'
      }`}
      style={{ backgroundColor: inLineup ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)' }}
    >
      {/* Drag handle indicator */}
      {!inLineup && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: artist.accentColor }} />
      )}

      <div className="relative flex-shrink-0">
        <img src={artist.image} alt={artist.name}
          className="w-9 h-9 rounded-lg object-cover" />
        {artist.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: artist.accentColor }}>
            <Check className="w-2 h-2 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-xs truncate">{artist.name}</div>
        <div className="text-slate-500 text-[10px] truncate">{artist.role}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
            <MapPin className="w-2.5 h-2.5" />{artist.city}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
            <TrendingUp className="w-2.5 h-2.5" />{artist.draw}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {showCompat && !inLineup && (
          <div className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" style={{ color: compatColor }} />
            <span className="text-[10px] font-bold" style={{ color: compatColor }}>{compat}%</span>
          </div>
        )}
        {inLineup ? (
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/[0.06]">
            <Check className="w-3 h-3 text-slate-400" />
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/[0.1] hover:border-white/30"
          >
            <Plus className="w-3 h-3 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

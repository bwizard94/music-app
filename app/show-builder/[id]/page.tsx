'use client';

import { useState, useRef, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, ChevronRight, Save, Share2, MoreHorizontal,
  CalendarDays, MapPin, Clock, Columns3, AlignJustify,
  Zap, CheckCircle2, AlertCircle, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { EVENT_BUILDS, ARTIST_POOL, type Artist, type LineupSlot, type EventBuild } from '@/components/show-builder/showData';
import ArtistSearchPanel from '@/components/show-builder/ArtistSearchPanel';
import LineupCanvas from '@/components/show-builder/LineupCanvas';
import TimelineView from '@/components/show-builder/TimelineView';
import EventStatsPanel from '@/components/show-builder/EventStatsPanel';

// Status pill config
const STATUS_CONFIG = {
  draft:     { color: '#64748b', label: 'Draft' },
  pitching:  { color: '#f59e0b', label: 'Pitching' },
  confirmed: { color: '#10b981', label: 'Confirmed' },
  cancelled: { color: '#f43f5e', label: 'Cancelled' },
  completed: { color: '#a855f7', label: 'Completed' },
};

let uidCounter = 100;
function makeSlotId() { return `slot-${++uidCounter}`; }

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Load event data (fallback to first event for unrecognized ids)
  const baseEvent = EVENT_BUILDS.find((e) => e.id === id) ?? EVENT_BUILDS[0];

  const [event] = useState<EventBuild>(baseEvent);
  const [lineup, setLineup] = useState<LineupSlot[]>(baseEvent.lineup);
  const [activeView, setActiveView] = useState<'lineup' | 'timeline'>('lineup');
  const [searchOpen, setSearchOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  // Drag state — use a ref so it doesn't cause re-renders during drag
  const dragRef = useRef<Artist | null>(null);
  const [draggedArtist, setDraggedArtist] = useState<Artist | null>(null);

  const accentColor = event.accentColor;
  const statusCfg = STATUS_CONFIG[event.status];

  // ── Lineup mutations ────────────────────────────────────────────────────────

  const addArtist = useCallback((artist: Artist) => {
    if (lineup.some((s) => s.artist.id === artist.id)) return;
    const newSlot: LineupSlot = {
      id: makeSlotId(),
      artist,
      role: lineup.length === 0 ? 'headliner' : lineup.length === 1 ? 'support' : 'opener',
      startTime: '23:00',
      duration: 60,
      fee: artist.fee.split('–')[0].trim(),
      status: 'pending',
    };
    setLineup((prev) => [...prev, newSlot]);
  }, [lineup]);

  const removeSlot = useCallback((id: string) => {
    setLineup((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSlots = useCallback((from: number, to: number) => {
    setLineup((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const updateRole = useCallback((id: string, role: LineupSlot['role']) => {
    setLineup((prev) => prev.map((s) => s.id === id ? { ...s, role } : s));
  }, []);

  const updateTime = useCallback((id: string, time: string) => {
    setLineup((prev) => prev.map((s) => s.id === id ? { ...s, startTime: time } : s));
  }, []);

  const addEmptySlot = useCallback(() => {
    // Pick a random artist not in lineup for demo purposes
    const available = ARTIST_POOL.filter((a) => !lineup.some((s) => s.artist.id === a.id));
    if (available.length === 0) return;
    addArtist(available[Math.floor(Math.random() * available.length)]);
  }, [lineup, addArtist]);

  const handleDrop = useCallback(() => {
    if (dragRef.current) {
      addArtist(dragRef.current);
      dragRef.current = null;
      setDraggedArtist(null);
    }
  }, [addArtist]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Derived stats
  const confirmedCount = lineup.filter((s) => s.status === 'confirmed').length;
  const pendingCount = lineup.filter((s) => s.status !== 'confirmed').length;

  return (
    <div className="h-screen bg-[#060608] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 glass border-b border-white/[0.06] flex items-center gap-3 px-4 z-50">
        {/* Breadcrumb */}
        <Link href="/" className="font-black text-base tracking-tight gradient-text-purple hidden sm:block">STAGEFRONT</Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/dashboard" className="text-slate-500 hover:text-white transition-colors hidden sm:flex items-center gap-1 text-sm">
          <LayoutDashboard className="w-3.5 h-3.5" />
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/show-builder" className="text-slate-500 hover:text-white transition-colors text-sm hidden sm:block">Show Builder</Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />

        {/* Event identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}60)` }} />
          <span className="text-white font-bold text-sm truncate">{event.name}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${statusCfg.color}20`, color: statusCfg.color, border: `1px solid ${statusCfg.color}30` }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Meta */}
        <div className="hidden md:flex items-center gap-4 ml-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{event.date}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />{confirmedCount} confirmed
          </span>
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3 h-3" />{pendingCount} pending
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Collaborator presence */}
          <div className="hidden md:flex items-center gap-1.5">
            {event.collaborators.filter((c) => c.viewing).map((c) => (
              <div key={c.id} className="relative" title={c.name}>
                <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full object-cover border border-[#060608]" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#060608]" />
              </div>
            ))}
            <span className="text-slate-600 text-[10px] ml-1">
              {event.collaborators.filter((c) => c.viewing).length} online
            </span>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={saved
              ? { backgroundColor: '#10b98120', borderColor: '#10b98140', color: '#10b981' }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }
            }
          >
            {saved ? <><CheckCircle2 className="w-3.5 h-3.5" />Saved</> : <><Save className="w-3.5 h-3.5" />Save</>}
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-white border border-white/[0.08] transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-white border border-white/[0.08] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Workspace body */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Artist Search Panel */}
        <aside
          className="flex-shrink-0 border-r border-white/[0.06] flex flex-col transition-all duration-300 overflow-hidden"
          style={{ width: searchOpen ? '260px' : '0px' }}
        >
          {searchOpen && (
            <ArtistSearchPanel
              lineup={lineup}
              onAddArtist={addArtist}
              onDragStart={(artist) => {
                dragRef.current = artist;
                setDraggedArtist(artist);
              }}
            />
          )}
        </aside>

        {/* TOGGLE + CENTER: Main canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Canvas toolbar */}
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06]">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
              title="Toggle artist panel"
            >
              {searchOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* View toggle */}
            <div className="flex glass rounded-lg p-0.5 border border-white/[0.06] gap-0.5">
              <button
                onClick={() => setActiveView('lineup')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                style={activeView === 'lineup'
                  ? { backgroundColor: `${accentColor}20`, color: accentColor }
                  : { color: '#64748b' }
                }
              >
                <AlignJustify className="w-3.5 h-3.5" />Lineup
              </button>
              <button
                onClick={() => setActiveView('timeline')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                style={activeView === 'timeline'
                  ? { backgroundColor: `${accentColor}20`, color: accentColor }
                  : { color: '#64748b' }
                }
              >
                <Clock className="w-3.5 h-3.5" />Timeline
              </button>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <Zap className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-slate-400 text-xs">{lineup.length} artist{lineup.length !== 1 ? 's' : ''} in lineup</span>
            </div>
          </div>

          {/* Canvas content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'lineup' && (
              <LineupCanvas
                lineup={lineup}
                accentColor={accentColor}
                draggedArtist={draggedArtist}
                onReorder={reorderSlots}
                onRemove={removeSlot}
                onUpdateRole={updateRole}
                onUpdateTime={updateTime}
                onDrop={handleDrop}
                onAddEmpty={addEmptySlot}
              />
            )}
            {activeView === 'timeline' && (
              <div className="h-full overflow-y-auto p-5">
                <TimelineView
                  lineup={lineup}
                  doorsTime={event.doorsTime}
                  endTime={event.endTime}
                  accentColor={accentColor}
                />

                {/* Timeline artist detail blocks */}
                {lineup.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-slate-500 text-xs uppercase tracking-wider mb-3">Set Order</h3>
                    {[...lineup]
                      .sort((a, b) => {
                        const ta = parseInt(a.startTime.replace(':', ''));
                        const tb = parseInt(b.startTime.replace(':', ''));
                        return ta - tb;
                      })
                      .map((slot, i) => (
                        <div key={slot.id} className="flex items-center gap-3 glass rounded-xl p-3 border border-white/[0.06]">
                          <div className="text-slate-700 font-bold text-xs w-5 text-center">{i + 1}</div>
                          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: slot.artist.accentColor }} />
                          <img src={slot.artist.image} alt={slot.artist.name} className="w-9 h-9 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm">{slot.artist.name}</div>
                            <div className="text-slate-600 text-xs">{slot.role} · {slot.startTime} · {slot.duration}m</div>
                          </div>
                          <div className="text-slate-500 text-xs">{slot.fee}</div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Stats / Collab / Pitch panel */}
        <aside className="flex-shrink-0 w-72 xl:w-80 border-l border-white/[0.06] flex flex-col overflow-hidden hidden md:flex">
          <EventStatsPanel
            event={event}
            lineup={lineup}
            accentColor={accentColor}
          />
        </aside>
      </div>
    </div>
  );
}

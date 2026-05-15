'use client';

import { useState } from 'react';
import { GripVertical, X, ChevronUp, ChevronDown, Clock, DollarSign, CheckCircle2, AlertCircle, Clock3, XCircle, Zap, Plus } from 'lucide-react';
import type { LineupSlot, Artist } from './showData';

interface Props {
  lineup: LineupSlot[];
  accentColor: string;
  draggedArtist: Artist | null;
  onReorder: (from: number, to: number) => void;
  onRemove: (id: string) => void;
  onUpdateRole: (id: string, role: LineupSlot['role']) => void;
  onUpdateTime: (id: string, time: string) => void;
  onDrop: () => void;
  onAddEmpty: () => void;
}

const ROLE_OPTIONS: LineupSlot['role'][] = ['opener', 'support', 'live-act', 'b2b', 'headliner', 'visual-artist'];
const ROLE_LABELS: Record<LineupSlot['role'], string> = {
  opener: 'Opener', support: 'Support', 'live-act': 'Live Act', b2b: 'B2B', headliner: 'Headliner', 'visual-artist': 'Visual Artist',
};
const ROLE_COLORS: Record<LineupSlot['role'], string> = {
  opener: '#64748b', support: '#06b6d4', 'live-act': '#ec4899', b2b: '#f59e0b', headliner: '#f43f5e', 'visual-artist': '#a855f7',
};

const STATUS_CONFIG = {
  confirmed:   { icon: CheckCircle2, color: '#10b981', label: 'Confirmed' },
  pending:     { icon: Clock3,        color: '#f59e0b', label: 'Pending' },
  invited:     { icon: AlertCircle,   color: '#06b6d4', label: 'Invited' },
  negotiating: { icon: AlertCircle,   color: '#a855f7', label: 'Negotiating' },
  declined:    { icon: AlertCircle,   color: '#f43f5e', label: 'Declined' },
};

export default function LineupCanvas({
  lineup, accentColor, draggedArtist, onReorder, onRemove, onUpdateRole, onUpdateTime, onDrop, onAddEmpty,
}: Props) {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSlotDragStart = (idx: number) => setDraggingIdx(idx);
  const handleSlotDragEnd = () => { setDraggingIdx(null); setOverIdx(null); };

  const handleSlotDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

  const handleSlotDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggingIdx !== null && draggingIdx !== idx) {
      onReorder(draggingIdx, idx);
    }
    setDraggingIdx(null);
    setOverIdx(null);
  };

  const isDropZone = (lineup.length === 0) || draggedArtist !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Canvas header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}>
            <Zap className="w-3 h-3" style={{ color: accentColor }} />
          </div>
          <span className="text-white font-bold text-sm">Lineup</span>
          <span className="text-slate-600 text-xs ml-1">
            {lineup.length} {lineup.length === 1 ? 'artist' : 'artists'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <GripVertical className="w-3 h-3" />
          Drag to reorder
        </div>
      </div>

      {/* Drop zone + slots */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (draggedArtist) onDrop();
        }}
      >
        {/* Empty state / global drop zone */}
        {lineup.length === 0 && (
          <div
            className="h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300"
            style={{
              borderColor: isDragOver ? accentColor : 'rgba(255,255,255,0.08)',
              backgroundColor: isDragOver ? `${accentColor}08` : 'transparent',
            }}
          >
            <div className="w-12 h-12 rounded-2xl border border-dashed border-white/10 flex items-center justify-center"
              style={{ backgroundColor: isDragOver ? `${accentColor}15` : 'rgba(255,255,255,0.03)' }}>
              <Plus className="w-5 h-5" style={{ color: isDragOver ? accentColor : '#334155' }} />
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm font-medium">Drop artists here</p>
              <p className="text-slate-600 text-xs mt-0.5">Drag from the panel or search for artists</p>
            </div>
          </div>
        )}

        {/* Lineup slots */}
        {lineup.map((slot, idx) => {
          const isDragging = draggingIdx === idx;
          const isOver = overIdx === idx && draggingIdx !== null && draggingIdx !== idx;
          const statusCfg = STATUS_CONFIG[slot.status];
          const StatusIcon = statusCfg.icon;
          const roleColor = ROLE_COLORS[slot.role];

          return (
            <div
              key={slot.id}
              draggable
              onDragStart={() => handleSlotDragStart(idx)}
              onDragEnd={handleSlotDragEnd}
              onDragOver={(e) => handleSlotDragOver(e, idx)}
              onDrop={(e) => handleSlotDrop(e, idx)}
              className="group relative rounded-2xl border transition-all duration-200"
              style={{
                opacity: isDragging ? 0.4 : 1,
                borderColor: isOver ? accentColor : 'rgba(255,255,255,0.07)',
                backgroundColor: isOver ? `${accentColor}06` : 'rgba(255,255,255,0.03)',
                transform: isOver ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isOver ? `0 0 20px ${accentColor}20` : 'none',
              }}
            >
              {/* Position indicator + drag handle */}
              <div className="flex items-stretch">
                {/* Left: position + drag */}
                <div className="flex flex-col items-center justify-between w-10 py-3 gap-2 flex-shrink-0 cursor-grab active:cursor-grabbing">
                  <span className="text-slate-700 text-[10px] font-bold tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                  <GripVertical className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => idx > 0 && onReorder(idx, idx - 1)}
                      className="text-slate-700 hover:text-slate-400 transition-colors">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < lineup.length - 1 && onReorder(idx, idx + 1)}
                      className="text-slate-700 hover:text-slate-400 transition-colors">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Center accent line */}
                <div className="w-0.5 flex-shrink-0 my-3 rounded-full" style={{ backgroundColor: slot.artist.accentColor }} />

                {/* Main card content */}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start gap-3">
                    <img src={slot.artist.image} alt={slot.artist.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm">{slot.artist.name}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}30` }}
                        >
                          {ROLE_LABELS[slot.role]}
                        </span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" style={{ color: statusCfg.color }} />
                          <span className="text-[10px]" style={{ color: statusCfg.color }}>{statusCfg.label}</span>
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">{slot.artist.role}</div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {/* Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => onUpdateTime(slot.id, e.target.value)}
                            className="bg-transparent text-slate-300 text-xs outline-none w-[4.5rem] tabular-nums"
                          />
                          <span className="text-slate-600 text-[10px]">({slot.duration}m)</span>
                        </div>
                        {/* Fee */}
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <DollarSign className="w-3 h-3 text-slate-600" />
                          {slot.fee}
                        </div>
                        {/* Draw */}
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <span>~{slot.artist.draw} draw</span>
                        </div>
                      </div>
                    </div>

                    {/* Role selector + remove */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => onRemove(slot.id)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <select
                        value={slot.role}
                        onChange={(e) => onUpdateRole(slot.id, e.target.value as LineupSlot['role'])}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r} className="bg-[#0c0c14]">{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Genre chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {slot.artist.genres.map((g) => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-600 border border-white/[0.04]">{g}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drop indicator line at bottom when dragging over */}
              {isOver && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
              )}
            </div>
          );
        })}

        {/* Drop zone when lineup has items */}
        {lineup.length > 0 && draggedArtist && (
          <div
            className="h-16 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              borderColor: isDragOver ? accentColor : 'rgba(255,255,255,0.06)',
              backgroundColor: isDragOver ? `${accentColor}08` : 'transparent',
            }}
          >
            <Plus className="w-4 h-4" style={{ color: isDragOver ? accentColor : '#334155' }} />
            <span className="text-xs" style={{ color: isDragOver ? accentColor : '#334155' }}>
              Drop {draggedArtist.name} to add
            </span>
          </div>
        )}

        {/* Add slot button */}
        {lineup.length > 0 && !draggedArtist && (
          <button
            onClick={onAddEmpty}
            className="w-full py-3 rounded-xl border border-dashed border-white/[0.06] text-slate-600 text-xs hover:border-white/[0.12] hover:text-slate-400 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add slot
          </button>
        )}
      </div>
    </div>
  );
}

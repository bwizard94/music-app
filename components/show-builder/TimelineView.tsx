'use client';

import type { LineupSlot } from './showData';

interface Props {
  lineup: LineupSlot[];
  doorsTime: string;
  endTime: string;
  accentColor: string;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  // Treat times after midnight as next day
  const total = h * 60 + (m || 0);
  return total < 8 * 60 ? total + 24 * 60 : total; // e.g. 02:00 → 26:00
}

function minutesToDisplay(mins: number): string {
  const wrapped = mins % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const suffix = h >= 12 && h < 24 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${suffix}`;
}

const ROLE_COLORS: Record<LineupSlot['role'], string> = {
  opener: '#64748b', support: '#06b6d4', 'live-act': '#ec4899', b2b: '#f59e0b', headliner: '#f43f5e', 'visual-artist': '#a855f7',
};

export default function TimelineView({ lineup, doorsTime, endTime, accentColor }: Props) {
  if (lineup.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-600 text-sm">
        Add artists to see the timeline
      </div>
    );
  }

  const doorsMin = timeToMinutes(doorsTime);
  const endMin = timeToMinutes(endTime);
  const totalSpan = endMin - doorsMin;

  // Build timeline items including doors and end
  const items: Array<{ label: string; start: number; duration: number; color: string; artist?: LineupSlot }> = [
    { label: 'Doors', start: doorsMin, duration: 30, color: '#1e293b' },
  ];

  // Sort lineup by start time
  const sorted = [...lineup].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  sorted.forEach((slot) => {
    items.push({
      label: slot.artist.name,
      start: timeToMinutes(slot.startTime),
      duration: slot.duration,
      color: ROLE_COLORS[slot.role],
      artist: slot,
    });
  });

  // Hour marks
  const hourMarks: number[] = [];
  for (let m = Math.ceil(doorsMin / 60) * 60; m <= endMin; m += 60) {
    hourMarks.push(m);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs uppercase tracking-wider">Event Timeline</span>
        <span className="text-slate-600 text-xs">{minutesToDisplay(doorsMin)} — {minutesToDisplay(endMin)}</span>
      </div>

      {/* Main timeline track */}
      <div className="relative h-20 glass rounded-xl border border-white/[0.06] overflow-hidden">
        {/* Hour gridlines */}
        {hourMarks.map((m) => {
          const pct = ((m - doorsMin) / totalSpan) * 100;
          if (pct <= 0 || pct >= 100) return null;
          return (
            <div key={m} className="absolute top-0 bottom-0 w-px bg-white/[0.06]"
              style={{ left: `${pct}%` }} />
          );
        })}

        {/* Blocks */}
        {items.map((item, i) => {
          const left = Math.max(0, ((item.start - doorsMin) / totalSpan) * 100);
          const width = Math.min(100 - left, (item.duration / totalSpan) * 100);
          if (width <= 0) return null;

          const isB2B = item.artist?.role === 'b2b';
          return (
            <div
              key={i}
              className="absolute top-2 bottom-2 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: `${item.color}25`,
                border: `1px solid ${item.color}40`,
                ...(isB2B ? { borderStyle: 'dashed' } : {}),
              }}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-lg"
                style={{ backgroundColor: item.color }} />
              <span className="text-white text-[9px] font-bold px-1 text-center leading-tight truncate max-w-full">
                {item.label}
              </span>
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 glass rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/[0.1]">
                {item.label} · {minutesToDisplay(item.start)} ({item.duration}m)
              </div>
            </div>
          );
        })}
      </div>

      {/* Hour labels */}
      <div className="relative h-4">
        {hourMarks.map((m) => {
          const pct = ((m - doorsMin) / totalSpan) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <span
              key={m}
              className="absolute text-[10px] text-slate-700 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {minutesToDisplay(m)}
            </span>
          );
        })}
      </div>

      {/* Slot detail row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sorted.map((slot) => (
          <div
            key={slot.id}
            className="flex-shrink-0 flex items-center gap-2 glass rounded-lg px-2.5 py-2 border border-white/[0.06]"
          >
            <div className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: ROLE_COLORS[slot.role] }} />
            <div>
              <div className="text-white text-[10px] font-bold">{slot.artist.name}</div>
              <div className="text-slate-600 text-[9px]">{slot.startTime} · {slot.duration}m</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

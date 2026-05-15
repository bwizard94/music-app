import type { Artist, LineupSlot } from '@/lib/types';

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Format a follower count: 12400 → "12.4k", 1200000 → "1.2M" */
export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/** Format a fee range from numeric min/max: (400, 600) → "$400–$600" */
export function formatFeeRange(min: number, max: number): string {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  return `${fmt(min)}–${fmt(max)}`;
}

/** Parse min fee from a display string like "$400–$600" */
export function parseFeeMin(fee: string): number {
  const match = fee.match(/\$?([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

/** "Sat Jun 21, 2025" → Date object */
export function parseDisplayDate(dateStr: string): Date {
  return new Date(dateStr);
}

/** ISO string → "May 23, 2025" */
export function formatISODate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Time Utilities ───────────────────────────────────────────────────────────

/** "23:30" → minutes since midnight (handles post-midnight as >1440) */
export function timeToMinutes(time: string, postMidnight = false): number {
  const [h, m] = time.split(':').map(Number);
  const mins = h * 60 + m;
  // Treat 00:00–05:59 as next-day (add 24h) when postMidnight flag set
  if (postMidnight && h < 6) return mins + 24 * 60;
  return mins;
}

/** minutes → "23:30" */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ─── Show Builder Scoring ─────────────────────────────────────────────────────

/**
 * Returns 0–100 compatibility score for an artist relative to a lineup.
 * Based on genre overlap and shared audience age brackets.
 */
export function getCompatibility(artist: Artist, lineup: LineupSlot[]): number {
  if (lineup.length === 0) return 0;
  const lineupGenres = lineup.flatMap((s) => s.artist.genres);
  const overlaps = artist.genres.filter((g) => lineupGenres.includes(g)).length;
  const audienceMatch = lineup.some((s) => s.artist.audienceAge === artist.audienceAge) ? 15 : 0;
  const base = Math.min(95, Math.round((overlaps / artist.genres.length) * 70) + audienceMatch);
  return Math.max(10, base);
}

/**
 * Estimates turnout range for a lineup at a given venue capacity.
 * Applies an audience overlap discount as lineup grows.
 */
export function estimateTurnout(
  lineup: LineupSlot[],
  capacity: number
): { low: number; mid: number; high: number; pct: number } {
  if (lineup.length === 0) return { low: 0, mid: 0, high: 0, pct: 0 };
  const totalDraw = lineup.reduce((sum, s) => sum + s.artist.draw, 0);
  const overlapFactor = 1 - (lineup.length - 1) * 0.08;
  const mid = Math.round(Math.min(capacity, totalDraw * overlapFactor));
  return {
    low: Math.round(mid * 0.82),
    mid,
    high: Math.min(capacity, Math.round(mid * 1.12)),
    pct: Math.round((mid / capacity) * 100),
  };
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

/** Append hex alpha to a color: ('#a855f7', 20) → '#a855f720' */
export function withAlpha(color: string, alpha: number): string {
  return `${color}${alpha.toString(16).padStart(2, '0')}`;
}

/** Inline style helper for accent-colored background + border */
export function accentStyle(color: string, bgAlpha = 0x18, borderAlpha = 0x28) {
  return {
    backgroundColor: `${color}${bgAlpha.toString(16)}`,
    border: `1px solid ${color}${borderAlpha.toString(16)}`,
  };
}

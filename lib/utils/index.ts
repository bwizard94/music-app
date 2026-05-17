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

// ─── Advanced Scoring Functions ───────────────────────────────────────────────

/**
 * Genre coherence: how well all genres in the lineup cohere (0–100).
 * Score high when 2–4 cohesive genres. Penalize too many (>5) or single genre.
 */
export function getGenreFit(lineup: LineupSlot[]): number {
  if (lineup.length === 0) return 0;
  const allGenres = lineup.flatMap((s) => s.artist.genres);
  const uniqueGenres = new Set(allGenres);
  const count = uniqueGenres.size;

  if (count <= 1) return 50; // single genre — coherent but boring
  if (count === 2) return 90;
  if (count === 3) return 95;
  if (count === 4) return 85;
  if (count === 5) return 70;
  // >5 unique genres — too scattered
  return Math.max(20, 70 - (count - 5) * 10);
}

/**
 * Venue fit: how well total draw fits the venue capacity (0–100).
 * Uses estimateTurnout to get fill percentage.
 */
export function getVenueFit(lineup: LineupSlot[], capacity: number): number {
  if (lineup.length === 0 || capacity === 0) return 0;
  const { pct } = estimateTurnout(lineup, capacity);
  if (pct >= 80 && pct <= 100) return 95;
  if (pct >= 60) return 80;
  if (pct >= 40) return 65;
  if (pct > 100) return 70; // over capacity — too big or oversold
  return 40; // under 40%
}

/**
 * Promo strength: based on socialScore and verified status (0–100).
 * Average socialScore of all artists, bonus for verified (+5 each, max +20).
 */
export function getPromoStrength(lineup: LineupSlot[]): number {
  if (lineup.length === 0) return 0;
  const avgSocial = lineup.reduce((sum, s) => sum + s.artist.socialScore, 0) / lineup.length;
  const verifiedCount = lineup.filter((s) => s.artist.verified).length;
  const verifiedBonus = Math.min(20, verifiedCount * 5);
  return Math.min(100, Math.max(20, Math.round(avgSocial + verifiedBonus)));
}

/**
 * Overall show score: weighted average of all factors (0–100).
 * Weights: genreFit*0.25 + venueFit*0.25 + promoStrength*0.2 + avgCompat*0.3
 */
export function getOverallScore(lineup: LineupSlot[], capacity: number): number {
  if (lineup.length === 0) return 0;

  const genreFit = getGenreFit(lineup);
  const venueFit = getVenueFit(lineup, capacity);
  const promoStrength = getPromoStrength(lineup);

  // Compute average pairwise compatibility
  let compatSum = 0;
  let compatCount = 0;
  for (let i = 0; i < lineup.length; i++) {
    for (let j = 0; j < lineup.length; j++) {
      if (i !== j) {
        compatSum += getCompatibility(lineup[i].artist, [lineup[j]]);
        compatCount++;
      }
    }
  }
  const avgCompat = compatCount > 0 ? compatSum / compatCount : 50;

  return Math.round(
    genreFit * 0.25 + venueFit * 0.25 + promoStrength * 0.2 + avgCompat * 0.3
  );
}

/**
 * Risk warnings: array of warning strings based on lineup state.
 */
export function getRiskWarnings(
  lineup: LineupSlot[],
  capacity: number
): Array<{ level: 'critical' | 'warning'; text: string }> {
  const warnings: Array<{ level: 'critical' | 'warning'; text: string }> = [];

  if (lineup.length === 0) return warnings;

  // No headliner
  const hasHeadliner = lineup.some((s) => s.role === 'headliner');
  if (!hasHeadliner) {
    warnings.push({ level: 'critical', text: 'No headliner — lineup lacks a top-billed act' });
  }

  // Only 1 artist
  if (lineup.length === 1) {
    warnings.push({ level: 'warning', text: 'Only one artist in lineup — add more for a full show' });
  }

  // Very low venue fill
  const { pct } = estimateTurnout(lineup, capacity);
  if (pct < 40) {
    warnings.push({ level: 'warning', text: `Low projected fill (${pct}%) — consider a smaller venue or more draw` });
  }

  // No confirmed artists
  const confirmedCount = lineup.filter((s) => s.status === 'confirmed').length;
  if (confirmedCount === 0) {
    warnings.push({ level: 'critical', text: 'No artists confirmed — lineup is all pending or unconfirmed' });
  }

  // Overlapping set times
  const sortedByTime = [...lineup].sort((a, b) => {
    const toMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return (h < 6 ? h + 24 : h) * 60 + m;
    };
    return toMins(a.startTime) - toMins(b.startTime);
  });
  for (let i = 0; i < sortedByTime.length - 1; i++) {
    const curr = sortedByTime[i];
    const next = sortedByTime[i + 1];
    const toMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return (h < 6 ? h + 24 : h) * 60 + m;
    };
    const currEnd = toMins(curr.startTime) + curr.duration;
    const nextStart = toMins(next.startTime);
    if (currEnd > nextStart && curr.role !== 'b2b' && next.role !== 'b2b') {
      warnings.push({ level: 'warning', text: `Set time overlap: ${curr.artist.name} and ${next.artist.name}` });
    }
  }

  return warnings;
}

/**
 * Missing pieces: suggested additions based on lineup state.
 */
export function getMissingPieces(lineup: LineupSlot[]): string[] {
  const suggestions: string[] = [];

  if (lineup.length === 0) return suggestions;

  // No headliner
  const hasHeadliner = lineup.some((s) => s.role === 'headliner');
  if (!hasHeadliner) {
    suggestions.push('Add a headliner to anchor your lineup');
  }

  // No opener when 2+ artists
  if (lineup.length >= 2) {
    const hasOpener = lineup.some((s) => s.role === 'opener');
    if (!hasOpener) {
      suggestions.push('Add an opener to warm up the crowd');
    }
  }

  // All same genre — suggest variety
  const allGenres = lineup.flatMap((s) => s.artist.genres);
  const uniqueGenres = new Set(allGenres);
  if (uniqueGenres.size === 1 && lineup.length >= 2) {
    suggestions.push('All artists share the same genre — consider adding variety');
  }

  // Low promo strength
  const promoStrength = getPromoStrength(lineup);
  if (promoStrength < 50) {
    suggestions.push('Low promo reach — add a verified artist to boost promotion');
  }

  // No support act when 3+ artists
  if (lineup.length >= 3) {
    const hasSupport = lineup.some((s) => s.role === 'support');
    if (!hasSupport) {
      suggestions.push('Consider adding a support act to fill the mid-lineup slot');
    }
  }

  return suggestions;
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

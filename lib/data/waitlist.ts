// ─── Waitlist & Invite System Data ───────────────────────────────────────────

export interface WaitlistEntry {
  name: string;
  email: string;
  role: string;
  city: string;
  position: number;
  referralCode: string;
  referredBy?: string;
  joinedAt: string;
  referralCount: number;
}

export interface RoleOption {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export interface CityOption {
  id: string;
  label: string;
  queue: number;
  trend: string;
  active: boolean;
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export const ROLE_OPTIONS: RoleOption[] = [
  { id: 'dj',           label: 'DJ',               emoji: '🎧', desc: 'Selector, turntablist, club DJ' },
  { id: 'artist',       label: 'Artist',            emoji: '🎤', desc: 'Vocalist, instrumentalist, live performer' },
  { id: 'producer',     label: 'Producer',          emoji: '🎛', desc: 'Beat maker, composer, studio engineer' },
  { id: 'venue',        label: 'Venue',             emoji: '🏛', desc: 'Club, bar, warehouse, gallery' },
  { id: 'promoter',     label: 'Promoter',          emoji: '📣', desc: 'Event organizer, booker, manager' },
  { id: 'photographer', label: 'Photographer',      emoji: '📷', desc: 'Event, press, editorial' },
  { id: 'videographer', label: 'Videographer',      emoji: '🎬', desc: 'Music video, live, documentary' },
  { id: 'visual',       label: 'Visual Artist',     emoji: '🎨', desc: 'Flyer artist, VJ, installation' },
  { id: 'collective',   label: 'Collective / Crew', emoji: '👥', desc: 'Label, promoter crew, artist collective' },
];

// ─── Cities ───────────────────────────────────────────────────────────────────

export const CITY_OPTIONS: CityOption[] = [
  { id: 'chicago',     label: 'Chicago',      queue: 847,  trend: '+24 today', active: true  },
  { id: 'detroit',     label: 'Detroit',      queue: 312,  trend: '+8 today',  active: true  },
  { id: 'new-york',    label: 'New York',     queue: 2104, trend: '+67 today', active: true  },
  { id: 'los-angeles', label: 'Los Angeles',  queue: 1876, trend: '+51 today', active: true  },
  { id: 'berlin',      label: 'Berlin',       queue: 1203, trend: '+38 today', active: true  },
  { id: 'london',      label: 'London',       queue: 934,  trend: '+29 today', active: true  },
  { id: 'amsterdam',   label: 'Amsterdam',    queue: 445,  trend: '+14 today', active: false },
  { id: 'brooklyn',    label: 'Brooklyn',     queue: 673,  trend: '+22 today', active: false },
  { id: 'toronto',     label: 'Toronto',      queue: 389,  trend: '+11 today', active: false },
  { id: 'melbourne',   label: 'Melbourne',    queue: 274,  trend: '+9 today',  active: false },
  { id: 'paris',       label: 'Paris',        queue: 521,  trend: '+17 today', active: false },
  { id: 'other',       label: 'Other city',   queue: 0,    trend: '',          active: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a deterministic-looking but pseudo-random 8-char referral code.
 * Avoids visually confusing chars (0/O, 1/I/L).
 */
export function generateReferralCode(email: string): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const seed = email.toLowerCase().split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 3), 0);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.abs(seed * (i + 7) * 1009 + i * 31) % chars.length];
  }
  return code;
}

/**
 * Generates a realistic-feeling queue position (15–160) based on email hash.
 * Invited users get a boosted position (1–25).
 */
export function generatePosition(email: string, invited = false): number {
  const hash = email.toLowerCase().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  if (invited) return (hash % 25) + 1;
  return (hash % 140) + 18;
}

/** Returns the number of spots moved up per referral */
export const SPOTS_PER_REFERRAL = 10;

/** localStorage key for the current user's waitlist entry */
export const WAITLIST_LS_KEY = 'sf_waitlist_v1';

/** Reads the waitlist entry from localStorage */
export function readWaitlistEntry(): WaitlistEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(WAITLIST_LS_KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry) : null;
  } catch {
    return null;
  }
}

/** Writes the waitlist entry to localStorage */
export function writeWaitlistEntry(entry: WaitlistEntry): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WAITLIST_LS_KEY, JSON.stringify(entry));
}

/** Computes current effective position after referrals */
export function effectivePosition(entry: WaitlistEntry): number {
  return Math.max(1, entry.position - entry.referralCount * SPOTS_PER_REFERRAL);
}

/** Mock recent activity feed per city */
export const RECENT_ACTIVITY: Record<string, string[]> = {
  chicago:     ['A DJ from Wicker Park just joined', '3 promoters from the South Side signed up', 'A venue in Logan Square is in the queue', '2 producers from Pilsen joined'],
  detroit:     ['A DJ from Corktown just joined', '2 artists from Midtown signed up', 'A promoter crew from Eastern Market is in'],
  'new-york':  ['A DJ from Bushwick just joined', '4 artists from the Lower East Side signed up', 'A venue in Ridgewood is in the queue'],
  'los-angeles': ['A producer from Echo Park just joined', '3 DJs from Koreatown signed up', 'A venue in DTLA is in the queue'],
  berlin:      ['A DJ from Neukölln just joined', '2 producers from Friedrichshain signed up', 'A venue in Mitte is in'],
  london:      ['A DJ from Peckham just joined', '3 artists from Dalston signed up', 'A promoter crew from Hackney is in'],
  default:     ['A DJ just joined', '3 artists signed up', 'A promoter crew is in', '2 producers joined'],
};

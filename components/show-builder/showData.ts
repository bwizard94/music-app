// Re-export canonical types and data
export type { Artist, LineupSlot, Collaborator, EventBuild } from '@/lib/types';
export { ARTISTS as ARTIST_POOL } from '@/lib/data/artists';
export { getCompatibility, estimateTurnout } from '@/lib/utils';
import type { Collaborator, LineupSlot, EventBuild } from '@/lib/types';
import { ARTISTS } from '@/lib/data/artists';

// Alias for internal use
const ARTIST_POOL = ARTISTS;

// ─── Collaborators ───────────────────────────────────────────────────────────

const COLLABS_NEURAL: Collaborator[] = [
  { id: 'c1', name: 'Marcus Bell', role: 'Venue Booker', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', viewing: true, approved: true },
  { id: 'c2', name: 'Jess Okafor', role: 'Promoter', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', viewing: true, approved: false },
  { id: 'c3', name: 'Dev Shin', role: 'Sound Engineer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', viewing: false, approved: true },
];

const COLLABS_SIGNAL: Collaborator[] = [
  { id: 'c4', name: 'Sofia Ren', role: 'Promoter', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', viewing: true, approved: true },
  { id: 'c5', name: 'Tomas V.', role: 'Venue Booker', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', viewing: false, approved: true },
];

const COLLABS_DARK: Collaborator[] = [
  { id: 'c6', name: 'Aaliyah Cross', role: 'Booking Agent', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80', viewing: true, approved: true },
  { id: 'c7', name: 'Ryo Tanaka', role: 'Lighting Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', viewing: false, approved: true },
  { id: 'c8', name: 'Priya N.', role: 'Promoter', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80', viewing: true, approved: true },
];

// ─── Helper: make a slot id ──────────────────────────────────────────────────
function slot(id: string, artistId: string, role: LineupSlot['role'], time: string, dur: number, fee: string, status: LineupSlot['status']): LineupSlot {
  const artist = ARTIST_POOL.find((a) => a.id === artistId)!;
  return { id, artist, role, startTime: time, duration: dur, fee, status };
}

// ─── Event Builds ────────────────────────────────────────────────────────────

export const EVENT_BUILDS: EventBuild[] = [
  {
    id: 'neural-drift',
    name: 'NEURAL DRIFT',
    tagline: 'An evening of dark electronic transmissions',
    date: 'Sat Jun 21, 2025',
    venue: 'The Blind Pig',
    venueCity: 'Chicago, IL',
    venueCapacity: 300,
    accentColor: '#c026d3',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    status: 'draft',
    genres: ['Dark Techno', 'Industrial', 'Dark Electro'],
    doorsTime: '21:00',
    endTime: '03:00',
    ticketPrice: '$15 / $20',
    estimatedRevenue: '$4,200–$5,800',
    collaborators: COLLABS_NEURAL,
    lineup: [
      slot('s1', 'static-forma', 'opener', '21:30', 60, '$150', 'confirmed'),
      slot('s2', 'nova-vega', 'support', '22:45', 75, '$450', 'confirmed'),
      slot('s3', 'lux', 'headliner', '00:15', 105, '$400', 'confirmed'),
    ],
  },
  {
    id: 'signal-collapse',
    name: 'SIGNAL COLLAPSE',
    tagline: 'Techno from the front lines of sound',
    date: 'Sat Jul 12, 2025',
    venue: 'Smart Bar',
    venueCity: 'Chicago, IL',
    venueCapacity: 200,
    accentColor: '#06b6d4',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',
    status: 'pitching',
    genres: ['Ambient Techno', 'Minimal', 'Dub Techno'],
    doorsTime: '22:00',
    endTime: '04:00',
    ticketPrice: '$20 / $25',
    estimatedRevenue: '$3,800–$4,900',
    collaborators: COLLABS_SIGNAL,
    lineup: [
      slot('s4', 'drift-state', 'opener', '22:00', 90, '$500', 'confirmed'),
      slot('s5', 'echo-prime', 'b2b', '23:30', 60, '$700', 'pending'),
      slot('s6', 'vessel-theory', 'b2b', '23:30', 60, '$900', 'negotiating'),
      slot('s7', 'kira-solaris', 'headliner', '01:30', 150, '$1,400', 'invited'),
    ],
  },
  {
    id: 'dark-matter-4',
    name: 'DARK MATTER vol.4',
    tagline: 'The fourth chapter — heavier than ever',
    date: 'Sun Aug 3, 2025',
    venue: 'Schuba\'s Tavern',
    venueCity: 'Chicago, IL',
    venueCapacity: 250,
    accentColor: '#f43f5e',
    coverImage: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=1200&q=80',
    status: 'confirmed',
    genres: ['Industrial', 'Dark Electro', 'EBM'],
    doorsTime: '21:00',
    endTime: '04:00',
    ticketPrice: '$18 / $22',
    estimatedRevenue: '$4,100–$5,200',
    collaborators: COLLABS_DARK,
    lineup: [
      slot('s8', 'cipher-run', 'opener', '21:00', 60, '$200', 'confirmed'),
      slot('s9', 'frequency-ghost', 'support', '22:15', 75, '$300', 'confirmed'),
      slot('s10', 'adan-boolean', 'support', '23:30', 75, '$300', 'confirmed'),
      slot('s11', 'nite-protocol', 'b2b', '01:00', 60, '$350', 'confirmed'),
      slot('s12', 'mira-null', 'headliner', '02:15', 105, '$900', 'confirmed'),
    ],
  },
];


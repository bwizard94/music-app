/**
 * Stagefront — Unified Discover Entity Pool
 *
 * Aggregates all searchable entity types into a single pool for the
 * Explore/Discovery page. Artists and Venues are mapped from their
 * canonical data files; Crew, Events, and Scenes are defined here.
 */

import { ARTISTS } from './artists';
import { VENUES } from './venues';

// ─── Entity kind ──────────────────────────────────────────────────────────────

export type EntityKind =
  | 'artist'
  | 'venue'
  | 'promoter'
  | 'photographer'
  | 'videographer'
  | 'lighting'
  | 'sound'
  | 'event'
  | 'scene';

// ─── Unified search entry ─────────────────────────────────────────────────────

export interface DiscoverEntry {
  id: string;
  kind: EntityKind;
  name: string;
  city: string;
  country: string;
  image: string;
  coverImage?: string;
  accentColor: string;
  verified: boolean;
  href: string;

  bio?: string;
  genres: string[];
  rating?: number;        // 0–5
  reviewCount?: number;
  followers?: number;
  fee?: string;           // display string e.g. "$400–$600"
  feeMin?: number;
  available?: boolean;
  collabInterest?: boolean;

  // Artist / crew
  role?: string;
  draw?: number;          // estimated audience pull
  audienceAge?: string;

  // Venue
  capacity?: number;
  tagline?: string;

  // Event
  date?: string;
  venueName?: string;
  headliner?: string;
  ticketsSold?: number;
  totalTickets?: number;
  ticketPrice?: string;

  // Scene
  artistCount?: number;
  venueCount?: number;
  eventsMonth?: number;

  // Crew
  specialties?: string[];
}

// ─── Crew profiles ────────────────────────────────────────────────────────────

const CREW: DiscoverEntry[] = [
  // ── Promoters ────────────────────────────────────────────────────────────────
  {
    id: 'jess-okafor',
    kind: 'promoter',
    name: 'Jess Okafor',
    role: 'Independent Promoter',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80',
    accentColor: '#a855f7',
    verified: true,
    href: '/profile/jess-okafor',
    bio: 'Chicago-based promoter specialising in dark electronic events. 5+ years building the underground circuit at venues like The Blind Pig and Smart Bar.',
    genres: ['Dark Techno', 'Industrial', 'EBM'],
    rating: 4.8, reviewCount: 24,
    followers: 2800,
    fee: '$300–$800',
    feeMin: 300,
    available: true,
    collabInterest: true,
    specialties: ['Event Production', 'Marketing', 'Artist Liaison', 'Social Media'],
  },
  {
    id: 'sofia-ren',
    kind: 'promoter',
    name: 'Sofia Ren',
    role: 'Event Curator',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    accentColor: '#06b6d4',
    verified: false,
    href: '/profile/sofia-ren',
    bio: 'Emerging promoter and event curator focused on experimental music and cross-disciplinary art events.',
    genres: ['Experimental', 'Ambient', 'Noise'],
    rating: 4.2, reviewCount: 9,
    followers: 640,
    fee: '$150–$400',
    feeMin: 150,
    available: true,
    collabInterest: true,
    specialties: ['Booking', 'Marketing', 'Graphic Design'],
  },
  {
    id: 'omar-vasquez',
    kind: 'promoter',
    name: 'Omar Vasquez',
    role: 'Scene Promoter',
    city: 'Detroit', country: 'US',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    accentColor: '#f59e0b',
    verified: true,
    href: '/profile/omar-vasquez',
    bio: 'Detroit-rooted promoter with 8 years on the techno circuit. Co-founder of the SIGNAL collective. Deep relationships across the Midwest scene.',
    genres: ['Techno', 'House', 'EBM'],
    rating: 4.9, reviewCount: 41,
    followers: 5100,
    fee: '$500–$1,200',
    feeMin: 500,
    available: false,
    collabInterest: true,
    specialties: ['Event Strategy', 'Artist Relations', 'PR', 'International Bookings'],
  },

  // ── Photographers ─────────────────────────────────────────────────────────────
  {
    id: 'maya-chen-photo',
    kind: 'photographer',
    name: 'Maya Chen',
    role: 'Event Photographer',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=300&q=80',
    accentColor: '#ec4899',
    verified: true,
    href: '/profile/maya-chen',
    bio: 'Chicago-based event and portrait photographer. Specialising in low-light club photography and artist promo shoots. Published in Resident Advisor and RA Europe.',
    genres: ['Techno', 'Electronic', 'Industrial'],
    rating: 4.9, reviewCount: 57,
    followers: 6800,
    fee: '$400–$900',
    feeMin: 400,
    available: true,
    collabInterest: true,
    specialties: ['Low-Light Photography', 'Artist Portraits', 'Event Documentation', 'Licensing'],
  },
  {
    id: 'kai-brooks',
    kind: 'photographer',
    name: 'Kai Brooks',
    role: 'Live Event Photographer',
    city: 'Detroit', country: 'US',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80',
    accentColor: '#3b82f6',
    verified: true,
    href: '/profile/kai-brooks',
    bio: 'Detroit photographer documenting the city\'s music culture for over a decade. Known for gritty, cinematic venue photography.',
    genres: ['Techno', 'House', 'Punk'],
    rating: 4.7, reviewCount: 38,
    followers: 4200,
    fee: '$350–$700',
    feeMin: 350,
    available: true,
    collabInterest: false,
    specialties: ['Venue Photography', 'Press Shots', 'Film Photography'],
  },
  {
    id: 'nina-osei',
    kind: 'photographer',
    name: 'Nina Osei',
    role: 'Music Photographer',
    city: 'New York', country: 'US',
    image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300&q=80',
    accentColor: '#10b981',
    verified: false,
    href: '/profile/nina-osei',
    bio: 'NYC-based music photographer with a focus on underground electronic, jazz-fusion, and performance art documentation.',
    genres: ['Electronic', 'Experimental', 'Jazz'],
    rating: 4.5, reviewCount: 22,
    followers: 2900,
    fee: '$300–$600',
    feeMin: 300,
    available: true,
    collabInterest: true,
    specialties: ['Documentary Photography', 'Portrait', 'Editorial'],
  },

  // ── Videographers ─────────────────────────────────────────────────────────────
  {
    id: 'dan-reeves-video',
    kind: 'videographer',
    name: 'Dan Reeves',
    role: 'Music Videographer',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
    accentColor: '#c026d3',
    verified: true,
    href: '/profile/dan-reeves',
    bio: 'Videographer and director specialising in live music documentation, artist promo videos, and short-form content for the underground electronic scene.',
    genres: ['Techno', 'Electronic', 'Experimental'],
    rating: 4.8, reviewCount: 31,
    followers: 3900,
    fee: '$600–$1,500',
    feeMin: 600,
    available: true,
    collabInterest: true,
    specialties: ['Live Capture', 'Music Videos', 'Social Content', 'Color Grading'],
  },
  {
    id: 'lena-park-video',
    kind: 'videographer',
    name: 'Lena Park',
    role: 'AV Artist / Videographer',
    city: 'Berlin', country: 'DE',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80',
    accentColor: '#f43f5e',
    verified: true,
    href: '/profile/lena-park',
    bio: 'Berlin-based AV artist and videographer creating immersive visual environments for live performances. Collaborates with techno labels and AV collectives.',
    genres: ['Techno', 'Ambient', 'AV Performance'],
    rating: 4.9, reviewCount: 44,
    followers: 7200,
    fee: '$800–$2,000',
    feeMin: 800,
    available: false,
    collabInterest: true,
    specialties: ['VJing', 'Projection Mapping', 'Music Videos', 'Installations'],
  },

  // ── Lighting Designers ────────────────────────────────────────────────────────
  {
    id: 'ryo-tanaka-light',
    kind: 'lighting',
    name: 'Ryo Tanaka',
    role: 'Lighting Designer',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    accentColor: '#f59e0b',
    verified: true,
    href: '/profile/ryo-tanaka',
    bio: 'Lighting designer with 10 years creating immersive environments for underground clubs and festivals. Resident LD at The Blind Pig and Smart Bar.',
    genres: ['Techno', 'Industrial', 'EBM'],
    rating: 4.9, reviewCount: 63,
    followers: 2100,
    fee: '$300–$800',
    feeMin: 300,
    available: true,
    collabInterest: true,
    specialties: ['DMX Programming', 'Haze & Atmospherics', 'Strobe Design', 'LED Installation'],
  },
  {
    id: 'claire-wu-light',
    kind: 'lighting',
    name: 'Claire Wu',
    role: 'Lighting Designer / VJ',
    city: 'New York', country: 'US',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&q=80',
    accentColor: '#06b6d4',
    verified: false,
    href: '/profile/claire-wu',
    bio: 'NYC-based lighting and visual designer. Fuses traditional LD with live visuals for hybrid AV experiences.',
    genres: ['House', 'Electronic', 'Experimental'],
    rating: 4.6, reviewCount: 29,
    followers: 1600,
    fee: '$250–$600',
    feeMin: 250,
    available: true,
    collabInterest: true,
    specialties: ['LED Mapping', 'Live Visuals', 'Stage Design', 'Festivals'],
  },

  // ── Sound Engineers ────────────────────────────────────────────────────────────
  {
    id: 'dev-shin-sound',
    kind: 'sound',
    name: 'Dev Shin',
    role: 'Sound Engineer',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    accentColor: '#10b981',
    verified: false,
    href: '/profile/dev-shin',
    bio: 'Freelance sound engineer specialising in electronic music events. Experienced with complex DJ setups, modular synthesis rigs, and live electronic acts.',
    genres: ['Techno', 'Electronic', 'Experimental'],
    rating: 4.7, reviewCount: 18,
    followers: 480,
    fee: '$200–$500',
    feeMin: 200,
    available: true,
    collabInterest: true,
    specialties: ['Live Sound', 'Monitor Mixing', 'System Design', 'Modular Rigs'],
  },
  {
    id: 'alex-torres-sound',
    kind: 'sound',
    name: 'Alex Torres',
    role: 'FOH Engineer',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80',
    accentColor: '#a855f7',
    verified: true,
    href: '/profile/alex-torres',
    bio: 'FOH and monitor engineer with 12 years on Chicago\'s live circuit. Touring experience across North America and Europe.',
    genres: ['Techno', 'House', 'Live Electronics'],
    rating: 4.8, reviewCount: 52,
    followers: 1900,
    fee: '$350–$900',
    feeMin: 350,
    available: false,
    collabInterest: false,
    specialties: ['FOH Mixing', 'RF Management', 'Festival Sound', 'Touring'],
  },
  {
    id: 'priya-nair-sound',
    kind: 'sound',
    name: 'Priya Nair',
    role: 'Sound Engineer / Producer',
    city: 'Detroit', country: 'US',
    image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=300&q=80',
    accentColor: '#f43f5e',
    verified: true,
    href: '/profile/priya-nair',
    bio: 'Detroit-based sound engineer and producer. Combines live sound expertise with studio production — specialising in recording live electronic performances.',
    genres: ['Techno', 'Industrial', 'Experimental'],
    rating: 4.9, reviewCount: 34,
    followers: 2300,
    fee: '$300–$700',
    feeMin: 300,
    available: true,
    collabInterest: true,
    specialties: ['Live Recording', 'Studio Production', 'Mastering', 'System Design'],
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const DISCOVER_EVENTS: DiscoverEntry[] = [
  {
    id: 'evt-neural-drift',
    kind: 'event',
    name: 'NEURAL DRIFT',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    accentColor: '#c026d3',
    verified: true,
    href: '/show-builder/neural-drift',
    genres: ['Dark Techno', 'Industrial', 'Dark Electro'],
    date: 'Sat Jun 21, 2025',
    venueName: 'The Blind Pig',
    headliner: 'LUX',
    ticketsSold: 240,
    totalTickets: 300,
    ticketPrice: '$15 / $20',
  },
  {
    id: 'evt-signal-collapse',
    kind: 'event',
    name: 'SIGNAL COLLAPSE',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    accentColor: '#06b6d4',
    verified: true,
    href: '/show-builder/signal-collapse',
    genres: ['Ambient Techno', 'Minimal', 'Dub Techno'],
    date: 'Sat Jul 12, 2025',
    venueName: 'Smart Bar',
    headliner: 'KIRA SÓLARIS',
    ticketsSold: 140,
    totalTickets: 200,
    ticketPrice: '$20 / $25',
  },
  {
    id: 'evt-dark-matter-4',
    kind: 'event',
    name: 'DARK MATTER vol.4',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=600&q=80',
    accentColor: '#f43f5e',
    verified: true,
    href: '/show-builder/dark-matter-4',
    genres: ['Industrial', 'Dark Electro', 'EBM'],
    date: 'Sun Aug 3, 2025',
    venueName: 'Schuba\'s Tavern',
    headliner: 'MIRA NULL',
    ticketsSold: 250,
    totalTickets: 250,
    ticketPrice: '$18 / $22',
  },
  {
    id: 'evt-void-circuit',
    kind: 'event',
    name: 'VOID CIRCUIT',
    city: 'Detroit', country: 'US',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    accentColor: '#f59e0b',
    verified: false,
    href: '/show-builder/void-circuit',
    genres: ['Techno', 'Industrial', 'Noise'],
    date: 'Fri Aug 22, 2025',
    venueName: 'Marble Bar',
    headliner: 'VESSEL THEORY',
    ticketsSold: 180,
    totalTickets: 450,
    ticketPrice: '$15 / $20',
  },
  {
    id: 'evt-transmission',
    kind: 'event',
    name: 'TRANSMISSION',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
    accentColor: '#10b981',
    verified: true,
    href: '/show-builder/transmission',
    genres: ['Minimal Techno', 'Dub Techno', 'Ambient'],
    date: 'Sat Sep 6, 2025',
    venueName: 'Subterranean',
    headliner: 'DRIFT STATE',
    ticketsSold: 310,
    totalTickets: 500,
    ticketPrice: '$12 / $18',
  },
  {
    id: 'evt-void-state',
    kind: 'event',
    name: 'VOID STATE',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    accentColor: '#a855f7',
    verified: false,
    href: '/show-builder/void-state',
    genres: ['EBM', 'Industrial', 'Harsh Noise'],
    date: 'Sat Sep 20, 2025',
    venueName: 'Empty Bottle',
    headliner: 'CIPHER RUN',
    ticketsSold: 95,
    totalTickets: 400,
    ticketPrice: '$10 / $15',
  },
  {
    id: 'evt-pulse-night',
    kind: 'event',
    name: 'PULSE NIGHT',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    accentColor: '#ec4899',
    verified: true,
    href: '/show-builder/pulse-night',
    genres: ['Electronic', 'Live Electronics', 'Experimental'],
    date: 'Fri Oct 10, 2025',
    venueName: 'The Blind Pig',
    headliner: 'PULSE COLLECTIVE',
    ticketsSold: 160,
    totalTickets: 300,
    ticketPrice: '$15 / $20',
  },
];

// ─── Scenes ────────────────────────────────────────────────────────────────────

export const DISCOVER_SCENES: DiscoverEntry[] = [
  {
    id: 'scene-chicago',
    kind: 'scene',
    name: 'Chicago Underground',
    city: 'Chicago', country: 'US',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    accentColor: '#a855f7',
    verified: true,
    href: '/scene/chicago',
    genres: ['Techno', 'Industrial', 'EBM', 'Dark Electro'],
    artistCount: 312, venueCount: 24, eventsMonth: 68,
    bio: 'Chicago\'s underground electronic scene is one of the most storied in North America — birthplace of house, home of dark techno.',
  },
  {
    id: 'scene-detroit',
    kind: 'scene',
    name: 'Detroit Techno',
    city: 'Detroit', country: 'US',
    image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=600&q=80',
    accentColor: '#f59e0b',
    verified: true,
    href: '/scene/detroit',
    genres: ['Techno', 'Industrial', 'Electro', 'House'],
    artistCount: 240, venueCount: 18, eventsMonth: 45,
    bio: 'The birthplace of techno. Detroit\'s scene continues to define the global underground with raw, machine-driven energy.',
  },
  {
    id: 'scene-berlin',
    kind: 'scene',
    name: 'Berlin Techno',
    city: 'Berlin', country: 'DE',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    accentColor: '#06b6d4',
    verified: true,
    href: '/scene/berlin',
    genres: ['Techno', 'Minimal', 'Ambient', 'Industrial'],
    artistCount: 890, venueCount: 64, eventsMonth: 310,
    bio: 'The global capital of techno. Berlin\'s 24-hour club culture and legendary venues set the global standard for underground electronic music.',
  },
  {
    id: 'scene-nyc',
    kind: 'scene',
    name: 'NYC Underground',
    city: 'New York', country: 'US',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80',
    accentColor: '#f43f5e',
    verified: true,
    href: '/scene/new-york',
    genres: ['House', 'Techno', 'Experimental', 'Noise'],
    artistCount: 540, venueCount: 38, eventsMonth: 180,
    bio: 'New York\'s underground music scene spans house, techno, noise, and experimental — from Brooklyn warehouses to Manhattan lofts.',
  },
  {
    id: 'scene-london',
    kind: 'scene',
    name: 'London Underground',
    city: 'London', country: 'UK',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    accentColor: '#10b981',
    verified: true,
    href: '/scene/london',
    genres: ['Techno', 'Grime', 'Drum & Bass', 'House'],
    artistCount: 680, venueCount: 52, eventsMonth: 240,
    bio: 'London\'s underground music scene is defined by its diversity — from fabric\'s techno nights to Fabric\'s drum & bass to South London warehouse parties.',
  },
  {
    id: 'scene-milwaukee',
    kind: 'scene',
    name: 'Milwaukee Scene',
    city: 'Milwaukee', country: 'US',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
    accentColor: '#ec4899',
    verified: false,
    href: '/scene/milwaukee',
    genres: ['House', 'Afro-Tech', 'Electronic', 'Techno'],
    artistCount: 87, venueCount: 11, eventsMonth: 22,
    bio: 'Milwaukee\'s emerging electronic scene is rapidly growing, with strong influences from Chicago house and Detroit techno traditions.',
  },
];

// ─── Map canonical data to DiscoverEntry ──────────────────────────────────────

const ARTIST_ENTRIES: DiscoverEntry[] = ARTISTS.map((a) => ({
  id: a.id,
  kind: 'artist' as const,
  name: a.name,
  city: a.city,
  country: a.country,
  image: a.image,
  coverImage: a.coverImage,
  accentColor: a.accentColor,
  verified: a.verified,
  href: `/profile/${a.slug}`,
  bio: a.bio,
  genres: a.genres,
  role: a.role,
  rating: a.stats.avgRating,
  reviewCount: a.stats.reviewCount,
  followers: a.followers,
  fee: a.fee,
  feeMin: a.feeMin,
  draw: a.draw,
  audienceAge: a.audienceAge,
  available: true,
  collabInterest: true,
}));

const VENUE_ENTRIES: DiscoverEntry[] = VENUES.map((v) => ({
  id: v.id,
  kind: 'venue' as const,
  name: v.name,
  city: v.city,
  country: v.country,
  image: v.coverImage,
  coverImage: v.coverImage,
  accentColor: v.accentColor,
  verified: v.verified,
  href: `/venue/${v.slug}`,
  genres: v.genres,
  capacity: v.capacity,
  tagline: v.tagline,
  rating: 4.6,
  reviewCount: 28,
  available: true,
  collabInterest: true,
}));

// ─── Full discover pool ───────────────────────────────────────────────────────

export const ALL_ENTRIES: DiscoverEntry[] = [
  ...ARTIST_ENTRIES,
  ...VENUE_ENTRIES,
  ...CREW,
  ...DISCOVER_EVENTS,
  ...DISCOVER_SCENES,
];

// ─── Filter helpers ───────────────────────────────────────────────────────────

export const ALL_CITIES = [...new Set(ALL_ENTRIES.map((e) => e.city))].sort();

export const ALL_GENRES = [...new Set(ALL_ENTRIES.flatMap((e) => e.genres))].sort();

export const KIND_LABELS: Record<EntityKind, string> = {
  artist: 'Artist',
  venue: 'Venue',
  promoter: 'Promoter',
  photographer: 'Photographer',
  videographer: 'Videographer',
  lighting: 'Lighting Designer',
  sound: 'Sound Engineer',
  event: 'Event',
  scene: 'Scene',
};

export const KIND_COLOR: Record<EntityKind, string> = {
  artist: '#a855f7',
  venue: '#06b6d4',
  promoter: '#f59e0b',
  photographer: '#ec4899',
  videographer: '#c026d3',
  lighting: '#f59e0b',
  sound: '#10b981',
  event: '#f43f5e',
  scene: '#06b6d4',
};

/** Saved search shape */
export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  kinds: EntityKind[];
  city: string;
  genres: string[];
  createdAt: string;
}

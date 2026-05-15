// ─── Types ───────────────────────────────────────────────────────────────────

export interface SceneCity {
  id: string;
  name: string;
  slug: string;
  country: string;
  accentColor: string;
  coverImage: string;
  tagline: string;
  description: string;
  stats: { artists: number; venues: number; eventsMonth: number; collectives: number };
  topGenres: string[];
  topVenues: string[];
  trending: string;
}

export type FeedPostType =
  | 'open-slot' | 'musician-wanted' | 'event' | 'discussion'
  | 'release' | 'collab-request' | 'collective-forming' | 'workshop' | 'venue-call';

export interface FeedPost {
  id: string;
  type: FeedPostType;
  author: string;
  authorRole: string;
  authorImage: string;
  city: string;
  time: string;
  content: string;
  tags: string[];
  accentColor: string;
  stat: string;
  statLabel: string;
  cta: string;
  // Optional rich fields
  eventName?: string;
  eventDate?: string;
  eventVenue?: string;
  venue?: string;
  slotDate?: string;
  slotType?: string;
  seeking?: string;
  genre?: string;
  coverImage?: string;
}

export interface Collective {
  id: string;
  name: string;
  slug: string;
  city: string;
  genres: string[];
  accentColor: string;
  image: string;
  coverImage: string;
  bio: string;
  memberCount: number;
  eventsHosted: number;
  founded: string;
  openSpots?: string;
  members: { name: string; role: string; image: string }[];
}

export interface BoardPost {
  id: string;
  type: 'open-slot' | 'musician-wanted' | 'collab-request' | 'collective-forming' | 'gear-share' | 'venue-call';
  author: string;
  authorRole: string;
  authorImage: string;
  city: string;
  time: string;
  title: string;
  body: string;
  tags: string[];
  accentColor: string;
  responses: number;
  interested: number;
  compensation?: string;
  seeking?: string;
  deadline?: string;
  urgent?: boolean;
}

export interface Conversation {
  id: string;
  type: 'dm' | 'group';
  name: string;
  image?: string;
  members?: { name: string; image: string; online: boolean }[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  accentColor: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  from: string;
  fromImage: string;
  content: string;
  time: string;
  isMe: boolean;
}

export interface DiscoverArtist {
  id: string;
  name: string;
  city: string;
  role: string;
  image: string;
  accentColor: string;
  genre: string;
  momentum: number; // % growth
  followers: number;
  recentDraw: number;
  tag: string;
}

export interface DiscoverRelease {
  id: string;
  title: string;
  artist: string;
  artistImage: string;
  type: 'mix' | 'ep' | 'album' | 'single' | 'live-recording';
  genre: string;
  date: string;
  image: string;
  accentColor: string;
  duration?: string;
  label?: string;
}

// ─── Scenes ──────────────────────────────────────────────────────────────────

export const SCENES: SceneCity[] = [
  {
    id: 'chicago',
    name: 'Chicago',
    slug: 'chicago',
    country: 'US',
    accentColor: '#a855f7',
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    tagline: 'Industrial roots, neon futures',
    description: 'Chicago\'s underground is one of the most tightly-knit in North America — a DIY culture built on house, techno, and industrial that continues to evolve with new voices every season.',
    stats: { artists: 847, venues: 34, eventsMonth: 62, collectives: 19 },
    topGenres: ['Dark Techno', 'Industrial', 'House', 'EBM', 'Experimental'],
    topVenues: ['The Blind Pig', 'Smart Bar', 'Empty Bottle', 'Schuba\'s Tavern', 'Subterranean'],
    trending: 'Industrial + EBM crossover events selling out consistently',
  },
  {
    id: 'detroit',
    name: 'Detroit',
    slug: 'detroit',
    country: 'US',
    accentColor: '#f59e0b',
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80',
    tagline: 'Where techno was born',
    description: 'The birthplace of techno remains one of its most vital laboratories. Detroit\'s underground is raw, uncompromising, and deeply political — a scene that built the blueprint.',
    stats: { artists: 612, venues: 21, eventsMonth: 38, collectives: 12 },
    topGenres: ['Techno', 'Industrial Techno', 'Electro', 'Hardcore', 'Ambient'],
    topVenues: ['Marble Bar', 'TV Lounge', 'Tangent Gallery', 'Deluxx Fluxx', 'PJ\'s Lager House'],
    trending: 'Electro revival bringing fresh Detroit energy',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    slug: 'berlin',
    country: 'DE',
    accentColor: '#06b6d4',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
    tagline: 'Global capital of the underground',
    description: 'Berlin\'s club culture is mythologized worldwide, but its underground remains a living organism — experimental, boundary-dissolving, and brutally honest about sound.',
    stats: { artists: 2140, venues: 89, eventsMonth: 310, collectives: 67 },
    topGenres: ['Techno', 'Ambient Techno', 'Dub Techno', 'Minimal', 'Noise'],
    topVenues: ['Berghain', 'Tresor', 'OHM', '://about blank', 'Watergate'],
    trending: 'Post-pandemic scene renaissance with new hybrid formats',
  },
  {
    id: 'london',
    name: 'London',
    slug: 'london',
    country: 'UK',
    accentColor: '#f43f5e',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
    tagline: 'Dark, heavy, and relentless',
    description: 'London\'s underground leans hard into darkness — industrial, hardcore, grime hybrids, and experimental electronics define a scene that refuses to be comfortable.',
    stats: { artists: 1890, venues: 74, eventsMonth: 241, collectives: 53 },
    topGenres: ['Industrial', 'Hardcore', 'Grime', 'Dark Ambient', 'UK Bass'],
    topVenues: ['fabric', 'EartH', 'Corsica Studios', 'Fold', 'Village Underground'],
    trending: 'Industrial / UK bass crossovers drawing massive crowds',
  },
  {
    id: 'new-york',
    name: 'New York',
    slug: 'new-york',
    country: 'US',
    accentColor: '#3b82f6',
    coverImage: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=1200&q=80',
    tagline: 'The city that never stops the music',
    description: 'New York\'s underground never sleeps — a labyrinthine network of lofts, warehouses, basement clubs, and after-hours spaces constantly reinventing what a \'scene\' means.',
    stats: { artists: 3200, venues: 112, eventsMonth: 480, collectives: 91 },
    topGenres: ['House', 'Techno', 'Ambient', 'Experimental', 'Afro-Tech'],
    topVenues: ['Good Room', 'Bossa Nova Civic Club', 'Nowadays', 'Knockdown Center', 'Elsewhere'],
    trending: 'Afro-Tech and diasporic sounds reshaping the underground',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    slug: 'los-angeles',
    country: 'US',
    accentColor: '#10b981',
    coverImage: 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=1200&q=80',
    tagline: 'Desert frequencies, ocean noise',
    description: 'LA\'s underground is vast and decentralized — from warehouse districts to canyon raves, experimental art spaces to DIY lofts, the scene sprawls like the city itself.',
    stats: { artists: 2760, venues: 68, eventsMonth: 198, collectives: 48 },
    topGenres: ['Experimental', 'Bass', 'Ambient', 'Noise', 'Electronic'],
    topVenues: ['Resident', 'LODGIC', 'Sound', 'The Echoplex', 'This Is Not A Venue'],
    trending: 'Experimental / ambient crossover events drawing diverse crowds',
  },
];

// ─── Feed Posts ───────────────────────────────────────────────────────────────

export const FEED_POSTS: FeedPost[] = [
  {
    id: 'fp1',
    type: 'open-slot',
    author: 'Marcus Bell',
    authorRole: 'Venue Booker · The Blind Pig',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    city: 'chicago',
    time: '8m ago',
    content: 'We have an opener slot open for our Jun 28th full-night session. Looking for dark techno or industrial — someone who sets the room right before it hits hard. 1.5hr set. Paid.',
    tags: ['Dark Techno', 'Industrial', 'Opener'],
    accentColor: '#c026d3',
    stat: '14', statLabel: 'interested',
    cta: 'Apply for Slot',
    venue: 'The Blind Pig',
    slotDate: 'Jun 28',
    slotType: 'Opener · 1.5hr',
  },
  {
    id: 'fp2',
    type: 'event',
    author: 'NOVA VEGA',
    authorRole: 'DJ · Dark Electro',
    authorImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
    city: 'chicago',
    time: '24m ago',
    content: 'NEURAL DRIFT is locked and loaded for Jun 21. Come get your brain rewired at The Blind Pig. LUX headlining, STATIC FORMA opening, and I\'m playing support. Tickets in bio.',
    tags: ['Industrial', 'Dark Techno', 'Dark Electro'],
    accentColor: '#f43f5e',
    stat: '89', statLabel: 'going',
    cta: 'Get Tickets',
    eventName: 'NEURAL DRIFT',
    eventDate: 'Jun 21',
    eventVenue: 'The Blind Pig',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  },
  {
    id: 'fp3',
    type: 'musician-wanted',
    author: 'SIGNAL BLOC',
    authorRole: 'Collective · Chicago',
    authorImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80',
    city: 'chicago',
    time: '1h ago',
    content: 'We\'re expanding SIGNAL BLOC and looking for a 3rd resident DJ to join our bimonthly series at Smart Bar. Genre: dark techno, industrial, or hard minimal. Must be Chicago-based. We vote as a collective.',
    tags: ['Dark Techno', 'Resident', 'Collective', 'Chicago'],
    accentColor: '#c026d3',
    stat: '22', statLabel: 'applicants',
    cta: 'Apply to Join',
    seeking: 'Resident DJ',
    genre: 'Dark Techno / Industrial',
  },
  {
    id: 'fp4',
    type: 'collab-request',
    author: 'NOVA VEGA',
    authorRole: 'DJ / Dark Electro',
    authorImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
    city: 'chicago',
    time: '2h ago',
    content: 'Looking for a visual artist / VJ for my Aug 3rd show at Schuba\'s (DARK MATTER vol.4). I want industrial-inspired visuals — glitch, machinery, architecture, negative space. Budget available. Let\'s talk.',
    tags: ['Visual Art', 'VJ', 'Industrial Aesthetic'],
    accentColor: '#f43f5e',
    stat: '7', statLabel: 'responses',
    cta: 'Reach Out',
  },
  {
    id: 'fp5',
    type: 'release',
    author: 'LUX',
    authorRole: 'DJ / Dark Techno',
    authorImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80',
    city: 'chicago',
    time: '3h ago',
    content: 'SPECTRA SERIES vol.3 is out. 90 minutes of uncut dark techno. Recorded live at The Blind Pig during the April residency. No edits, no mercy.',
    tags: ['Dark Techno', 'Live Recording', 'Mix'],
    accentColor: '#c026d3',
    stat: '340', statLabel: 'plays',
    cta: 'Listen Now',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  },
  {
    id: 'fp6',
    type: 'discussion',
    author: 'MOANA SHIFT',
    authorRole: 'Producer / DJ',
    authorImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80',
    city: 'chicago',
    time: '4h ago',
    content: 'Real talk — is Chicago\'s industrial/techno scene hitting a genuine renaissance right now or are we in an echo chamber? I\'m seeing more packed shows than ever but wondering if we\'re growing an actual audience or just consolidating the same 300 people.',
    tags: ['Discussion', 'Chicago Scene', 'Industrial'],
    accentColor: '#06b6d4',
    stat: '31', statLabel: 'replies',
    cta: 'Join Discussion',
  },
  {
    id: 'fp7',
    type: 'collective-forming',
    author: 'HALF LIFE',
    authorRole: 'DJ / Industrial',
    authorImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&q=80',
    city: 'chicago',
    time: '6h ago',
    content: 'Starting a noise/power electronics collective in Pilsen. Looking for 2-3 more artists — DJs, live acts, visual artists welcome. Monthly residency talks underway with a venue TBA. Chicago underground roots, no mainstream crossover.',
    tags: ['Noise', 'Power Electronics', 'Industrial', 'Collective Forming'],
    accentColor: '#f59e0b',
    stat: '9', statLabel: 'interested',
    cta: 'I\'m Interested',
    seeking: '2-3 artists',
  },
  {
    id: 'fp8',
    type: 'workshop',
    author: 'PULSE COLLECTIVE',
    authorRole: 'Live Act / Chicago',
    authorImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80',
    city: 'chicago',
    time: '8h ago',
    content: 'Free Ableton workshop this Saturday in Logan Square — "Building Industrial Sound Palettes from Hardware." 2pm. Limited to 20 spots. DM to reserve. This is for producers who want to learn, not impress.',
    tags: ['Workshop', 'Ableton', 'Industrial', 'Production', 'Free'],
    accentColor: '#ec4899',
    stat: '18', statLabel: 'attending',
    cta: 'Reserve Spot',
  },
  {
    id: 'fp9',
    type: 'venue-call',
    author: 'Empty Bottle Staff',
    authorRole: 'Venue · Wicker Park',
    authorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
    city: 'chicago',
    time: '1d ago',
    content: 'Now accepting residency applications for our Fall 2025 season. Looking for artists, promoters, and collectives with a distinct sound and proven local following. Priority to Chicago-based applicants. Apply via link.',
    tags: ['Residency', 'Open Call', 'Fall 2025', 'Venue'],
    accentColor: '#10b981',
    stat: '47', statLabel: 'applicants',
    cta: 'Apply Now',
    venue: 'Empty Bottle',
  },
  {
    id: 'fp10',
    type: 'musician-wanted',
    author: 'ADAN BOOLEAN',
    authorRole: 'Electronic Artist · Detroit',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    city: 'detroit',
    time: '2h ago',
    content: 'Looking for a live drummer with industrial / electronic music experience to record with. Not a session gig — looking for someone to co-write with. Detroit or will travel. Project has label interest.',
    tags: ['Industrial', 'Live Drummer', 'Collab', 'Detroit'],
    accentColor: '#f59e0b',
    stat: '6', statLabel: 'responses',
    cta: 'Connect',
    seeking: 'Live Drummer',
  },
  {
    id: 'fp11',
    type: 'open-slot',
    author: 'Marble Bar',
    authorRole: 'Venue · Detroit',
    authorImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80',
    city: 'detroit',
    time: '3h ago',
    content: 'Headliner slot available for our Jul 19th session. Looking for someone with a genuine Detroit connection — techno or electro. 3hr set, door split deal. Detroit artists get priority.',
    tags: ['Techno', 'Electro', 'Headliner', 'Detroit'],
    accentColor: '#f59e0b',
    stat: '11', statLabel: 'interested',
    cta: 'Apply',
    venue: 'Marble Bar',
    slotDate: 'Jul 19',
    slotType: 'Headliner · 3hr',
  },
  {
    id: 'fp12',
    type: 'event',
    author: 'DRIFT STATE',
    authorRole: 'DJ / Minimal Techno',
    authorImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80',
    city: 'berlin',
    time: '5h ago',
    content: 'Playing OHM this Friday alongside KIRA SÓLARIS. 6-hour back-to-back session starting 2am. This one\'s going to go very deep, very dark. Come ready.',
    tags: ['Minimal Techno', 'Dub Techno', 'Berlin'],
    accentColor: '#14b8a6',
    stat: '124', statLabel: 'going',
    cta: 'View Event',
    eventName: 'DRIFT × KIRA',
    eventDate: 'This Friday',
    eventVenue: 'OHM, Berlin',
  },
];

// ─── Collectives ─────────────────────────────────────────────────────────────

export const COLLECTIVES: Collective[] = [
  {
    id: 'signal-bloc',
    name: 'SIGNAL BLOC',
    slug: 'signal-bloc',
    city: 'Chicago',
    genres: ['Dark Techno', 'Industrial', 'EBM'],
    accentColor: '#c026d3',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    bio: 'Bimonthly techno and industrial residency at Smart Bar. We curate sounds from the harder, darker edge of the electronic spectrum. Chicago-rooted, community-first.',
    memberCount: 8,
    eventsHosted: 24,
    founded: '2022',
    openSpots: '1 DJ slot open',
    members: [
      { name: 'LUX', role: 'Resident DJ', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80' },
      { name: 'STATIC FORMA', role: 'Resident DJ', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80' },
      { name: 'AXIS POINT', role: 'Resident DJ', image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=80&q=80' },
    ],
  },
  {
    id: 'void-circuit',
    name: 'VOID CIRCUIT',
    slug: 'void-circuit',
    city: 'Chicago',
    genres: ['Dark Electro', 'Noise', 'Power Electronics'],
    accentColor: '#f43f5e',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    bio: 'Dark electronic collective focused on the outer edges — harsh noise, power electronics, dark ambient, post-industrial. Monthly warehouse events in Pilsen and Bridgeport.',
    memberCount: 5,
    eventsHosted: 16,
    founded: '2023',
    members: [
      { name: 'NOVA VEGA', role: 'Founder / DJ', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80' },
      { name: 'CIPHER RUN', role: 'Resident', image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=80&q=80' },
      { name: 'HALF LIFE', role: 'Resident', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&q=80' },
    ],
  },
  {
    id: 'basement-theory',
    name: 'BASEMENT THEORY',
    slug: 'basement-theory',
    city: 'Chicago',
    genres: ['Experimental', 'Drone', 'Ambient Techno'],
    accentColor: '#a855f7',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=800&q=80',
    bio: 'Experimental electronic collective blending live performance, installation, and improvisation. Quarterly events at unconventional venues — galleries, warehouses, disused spaces.',
    memberCount: 6,
    eventsHosted: 9,
    founded: '2023',
    openSpots: 'Looking for a live keyboardist',
    members: [
      { name: 'FORMA VITAE', role: 'Founder', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'PULSE COLLECTIVE', role: 'Live Act', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80' },
    ],
  },
  {
    id: 'meridian-crew',
    name: 'MERIDIAN CREW',
    slug: 'meridian-crew',
    city: 'Chicago',
    genres: ['House', 'Afro-Tech', 'Deep Techno'],
    accentColor: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    bio: 'House and techno crossover collective celebrating the African and diaspora roots of electronic music. Monthly events with rotating international guests.',
    memberCount: 7,
    eventsHosted: 18,
    founded: '2021',
    members: [
      { name: 'MOANA SHIFT', role: 'Founder / DJ', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80' },
      { name: 'SABLE CURRENT', role: 'Guest Resident', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80' },
    ],
  },
  {
    id: 'iron-frequencies',
    name: 'IRON FREQUENCIES',
    slug: 'iron-frequencies',
    city: 'Detroit',
    genres: ['Industrial Techno', 'Hardcore', 'Noise'],
    accentColor: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    bio: 'Detroit-rooted industrial techno collective. Brutal, political, uncompromising. We operate at the intersection of techno\'s birthplace and its most extreme sonic expressions.',
    memberCount: 5,
    eventsHosted: 14,
    founded: '2020',
    members: [
      { name: 'ADAN BOOLEAN', role: 'Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'NITE PROTOCOL', role: 'Resident', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdbbf0?w=80&q=80' },
      { name: 'FREQUENCY GHOST', role: 'Resident', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80' },
    ],
  },
];

// ─── Board Posts ──────────────────────────────────────────────────────────────

export const BOARD_POSTS: BoardPost[] = [
  {
    id: 'bp1',
    type: 'open-slot',
    author: 'Marcus Bell',
    authorRole: 'Venue Booker · The Blind Pig',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    city: 'Chicago, IL',
    time: '8m ago',
    title: 'Opener Slot — Jun 28 Full Night',
    body: 'Looking for an opener (21:30–23:00) for our Jun 28th session. Genre fit: dark techno, industrial, hard minimal. Payment: $150. Must be Chicago-based or available to play locally.',
    tags: ['Dark Techno', 'Industrial', 'Opener', 'Paid'],
    accentColor: '#c026d3',
    responses: 14,
    interested: 14,
    compensation: '$150',
    deadline: 'Jun 20',
    urgent: true,
  },
  {
    id: 'bp2',
    type: 'musician-wanted',
    author: 'SIGNAL BLOC',
    authorRole: 'Collective · Chicago',
    authorImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80',
    city: 'Chicago, IL',
    time: '1h ago',
    title: 'Seeking Dark Techno Resident DJ',
    body: 'SIGNAL BLOC is looking for a 3rd resident DJ to join our bimonthly Smart Bar series. We vote as a collective on all bookings. You must be Chicago-based and have a strong, defined sound in dark techno or industrial.',
    tags: ['Resident', 'Dark Techno', 'Industrial', 'Smart Bar'],
    accentColor: '#c026d3',
    responses: 22,
    interested: 22,
    seeking: 'Resident DJ',
  },
  {
    id: 'bp3',
    type: 'collab-request',
    author: 'NOVA VEGA',
    authorRole: 'DJ / Dark Electro',
    authorImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
    city: 'Chicago, IL',
    time: '2h ago',
    title: 'VJ / Visual Artist — Aug 3rd at Schuba\'s',
    body: 'Looking for a VJ or visual artist for DARK MATTER vol.4 at Schuba\'s Tavern. I want industrial-inspired visuals — glitch textures, machinery, negative space, generative. Budget available. Let\'s create something together.',
    tags: ['VJ', 'Visual Art', 'Industrial', 'Paid'],
    accentColor: '#f43f5e',
    responses: 7,
    interested: 7,
    compensation: 'Budget negotiable',
    deadline: 'Jul 20',
  },
  {
    id: 'bp4',
    type: 'collective-forming',
    author: 'HALF LIFE',
    authorRole: 'DJ / Industrial',
    authorImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&q=80',
    city: 'Chicago, IL',
    time: '6h ago',
    title: 'Noise / Power Electronics Collective — Pilsen',
    body: 'Starting a new collective focused on noise and power electronics. Monthly events at a Pilsen venue (TBA — deal in progress). Looking for 2-3 artists: DJs, live acts, or visual artists. Chicago underground roots, no crossover compromises.',
    tags: ['Noise', 'Power Electronics', 'Pilsen', 'Collective'],
    accentColor: '#f59e0b',
    responses: 9,
    interested: 9,
    seeking: '2–3 artists',
  },
  {
    id: 'bp5',
    type: 'venue-call',
    author: 'Empty Bottle Staff',
    authorRole: 'Venue · Wicker Park',
    authorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
    city: 'Chicago, IL',
    time: '1d ago',
    title: 'Fall 2025 Residency Applications Open',
    body: 'Empty Bottle is now accepting residency applications for Fall 2025. All genres considered — we prioritize artists with a distinct identity and real local following. Chicago-based applicants prioritized.',
    tags: ['Residency', 'Open Call', 'All Genres', 'Chicago'],
    accentColor: '#10b981',
    responses: 47,
    interested: 47,
    deadline: 'Jul 1',
  },
  {
    id: 'bp6',
    type: 'musician-wanted',
    author: 'ADAN BOOLEAN',
    authorRole: 'Electronic Artist · Detroit',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    city: 'Detroit, MI',
    time: '2h ago',
    title: 'Live Drummer — Industrial / Electronic Project',
    body: 'Looking for a live drummer with experience in industrial or electronic music for a recording project. This is a co-writing situation, not a session gig. Project has label interest. Detroit-based preferred.',
    tags: ['Drums', 'Industrial', 'Recording', 'Detroit', 'Label Interest'],
    accentColor: '#f59e0b',
    responses: 6,
    interested: 6,
    seeking: 'Live Drummer',
  },
  {
    id: 'bp7',
    type: 'open-slot',
    author: 'Marble Bar',
    authorRole: 'Venue · Detroit',
    authorImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80',
    city: 'Detroit, MI',
    time: '3h ago',
    title: 'Headliner — Jul 19th · Detroit Techno / Electro',
    body: 'Looking for a headliner with genuine Detroit roots for our Jul 19th session. Techno or electro, 3hr set. Door split deal. We want artists connected to the culture, not just passing through.',
    tags: ['Techno', 'Electro', 'Headliner', 'Door Split', 'Detroit'],
    accentColor: '#f59e0b',
    responses: 11,
    interested: 11,
    compensation: 'Door split',
    urgent: true,
  },
  {
    id: 'bp8',
    type: 'gear-share',
    author: 'Dev Shin',
    authorRole: 'Sound Engineer · Chicago',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    city: 'Chicago, IL',
    time: '4h ago',
    title: 'Pioneer CDJ-3000s — Wicker Park Studio / Hourly',
    body: 'Offering Pioneer CDJ-3000 (×2) + DJM-900NXS2 for hourly rental in my Wicker Park home studio. Great for recording, practice, or recording demos. $25/hr. Daytime hours only. Sound engineer on call for additional fee.',
    tags: ['Pioneer CDJ-3000', 'DJM-900NXS2', 'Gear Rental', 'Wicker Park'],
    accentColor: '#14b8a6',
    responses: 3,
    interested: 8,
    compensation: '$25/hr',
  },
  {
    id: 'bp9',
    type: 'collab-request',
    author: 'PULSE COLLECTIVE',
    authorRole: 'Live Act · Chicago',
    authorImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80',
    city: 'Chicago, IL',
    time: '5h ago',
    title: 'Looking for Lighting Designer — Ongoing',
    body: 'PULSE COLLECTIVE performs live electronics every 6-8 weeks and we\'re looking for a dedicated lighting designer to join us as a permanent collaborator. We have consistent gigs, fair splits, and creative freedom.',
    tags: ['Lighting Design', 'Live Electronics', 'Ongoing', 'Creative Split'],
    accentColor: '#ec4899',
    responses: 4,
    interested: 12,
    seeking: 'Lighting Designer',
    compensation: 'Revenue split',
  },
  {
    id: 'bp10',
    type: 'musician-wanted',
    author: 'FORMA VITAE',
    authorRole: 'Electronic Artist · Chicago',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    city: 'Chicago, IL',
    time: '8h ago',
    title: 'Collaborator for Ambient / Drone Installation',
    body: 'Working on a sound installation piece for a Logan Square gallery opening in September. Looking for a collaborator — could be another musician, a visual artist, or a poet. Open to experimentation. Unpaid but credited and exhibited.',
    tags: ['Ambient', 'Drone', 'Installation', 'Gallery', 'Unpaid / Credit'],
    accentColor: '#8b5cf6',
    responses: 5,
    interested: 18,
    seeking: 'Musician or Visual Artist',
    deadline: 'Aug 1',
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'neural-drift-crew',
    type: 'group',
    name: 'NEURAL DRIFT crew',
    accentColor: '#c026d3',
    members: [
      { name: 'Marcus Bell', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', online: true },
      { name: 'Jess Okafor', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', online: true },
      { name: 'Dev Shin', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', online: false },
      { name: 'You (NOVA VEGA)', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', online: true },
    ],
    lastMessage: 'Marcus: Doors are at 9, not 9:30. Update the flyer.',
    lastTime: '12m',
    unread: 3,
    messages: [
      { id: 'm1', from: 'Jess Okafor', fromImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', content: 'LUX just confirmed the full headliner fee. We\'re good to go 🤘', time: '2h ago', isMe: false },
      { id: 'm2', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'That\'s the news. What\'s the final flyer situation — STATIC FORMA needs a slot time listed.', time: '1h 45m ago', isMe: true },
      { id: 'm3', from: 'Dev Shin', fromImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', content: 'STATIC at 21:30. You at 22:45. LUX from 00:15. I\'ll tell the designer.', time: '1h 30m ago', isMe: false },
      { id: 'm4', from: 'Marcus Bell', fromImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', content: 'Also the sound check is at 18:00 not 19:00. Venue needs earlier setup.', time: '45m ago', isMe: false },
      { id: 'm5', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'Got it — I\'ll be there at 17:30 to get levels sorted before anyone else arrives.', time: '30m ago', isMe: true },
      { id: 'm6', from: 'Marcus Bell', fromImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', content: 'Doors are at 9, not 9:30. Update the flyer.', time: '12m ago', isMe: false },
    ],
  },
  {
    id: 'kira-solaris',
    type: 'dm',
    name: 'KIRA SÓLARIS',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
    accentColor: '#10b981',
    lastMessage: 'I\'d be open to Chicago in August. What\'s the venue?',
    lastTime: '2h',
    unread: 1,
    messages: [
      { id: 'k1', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'Hi Kira — huge fan of your work. I\'m Nova Vega, DJ/producer based in Chicago.', time: '1d ago', isMe: true },
      { id: 'k2', from: 'KIRA SÓLARIS', fromImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', content: 'Hey! I know your name — your SPECTRA release was excellent. What\'s up?', time: '22h ago', isMe: false },
      { id: 'k3', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'We\'re building a summer event series here — SIGNAL COLLAPSE at Smart Bar. Would love to have you as headliner for one of the dates. Budget is serious.', time: '20h ago', isMe: true },
      { id: 'k4', from: 'KIRA SÓLARIS', fromImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', content: 'I\'d be open to Chicago in August. What\'s the venue?', time: '2h ago', isMe: false },
    ],
  },
  {
    id: 'signal-bloc',
    type: 'group',
    name: 'SIGNAL BLOC',
    accentColor: '#c026d3',
    members: [
      { name: 'LUX', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80', online: true },
      { name: 'STATIC FORMA', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', online: false },
      { name: 'AXIS POINT', image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=80&q=80', online: false },
      { name: 'You', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', online: true },
    ],
    lastMessage: 'LUX: Vote on the July date — we need 3/4 to confirm.',
    lastTime: '4h',
    unread: 0,
    messages: [
      { id: 's1', from: 'LUX', fromImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80', content: 'Smart Bar just offered us the full night on Jul 26. Do we want it or hold for August?', time: '6h ago', isMe: false },
      { id: 's2', from: 'STATIC FORMA', fromImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', content: 'Jul 26 works for me. I say take it.', time: '5h 30m ago', isMe: false },
      { id: 's3', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'Same — July gives us more time to promote than August would anyway.', time: '5h ago', isMe: true },
      { id: 's4', from: 'LUX', fromImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80', content: 'Vote on the July date — we need 3/4 to confirm.', time: '4h ago', isMe: false },
    ],
  },
  {
    id: 'marcus-bell',
    type: 'dm',
    name: 'Marcus Bell',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    accentColor: '#c026d3',
    lastMessage: 'You: Confirmed — see you at load-in.',
    lastTime: '1d',
    unread: 0,
    messages: [
      { id: 'mb1', from: 'Marcus Bell', fromImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', content: 'Nova — contracts are signed. NEURAL DRIFT is officially booked. I\'ll send the full tech rider request this week.', time: '2d ago', isMe: false },
      { id: 'mb2', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'Let\'s go. I\'ll have my rider back to you within 48hrs.', time: '2d ago', isMe: true },
      { id: 'mb3', from: 'Marcus Bell', fromImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', content: 'Load-in is 18:00. Soundcheck at 18:30. You\'re on at 22:45.', time: '1d ago', isMe: false },
      { id: 'mb4', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'Confirmed — see you at load-in.', time: '1d ago', isMe: true },
    ],
  },
  {
    id: 'chicago-underground',
    type: 'group',
    name: 'Chicago Underground',
    accentColor: '#a855f7',
    members: [
      { name: 'MOANA SHIFT', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', online: true },
      { name: 'ADAN BOOLEAN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', online: false },
      { name: 'Dev Shin', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', online: true },
    ],
    lastMessage: 'MOANA SHIFT: Agreed — the crossover crowds are killing the vibe.',
    lastTime: '5h',
    unread: 7,
    messages: [
      { id: 'cu1', from: 'MOANA SHIFT', fromImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', content: 'Did anyone catch the Empty Bottle show last weekend? Crowd was different. More tourists, less locals.', time: '7h ago', isMe: false },
      { id: 'cu2', from: 'ADAN BOOLEAN', fromImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', content: 'That\'s been the trend all spring. Marketing is reaching outside the scene now.', time: '6h ago', isMe: false },
      { id: 'cu3', from: 'You', fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', content: 'I think it depends on the event. Community-organized stuff still feels right. Promoter-led stuff is getting diluted.', time: '5h 30m ago', isMe: true },
      { id: 'cu4', from: 'MOANA SHIFT', fromImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', content: 'Agreed — the crossover crowds are killing the vibe.', time: '5h ago', isMe: false },
    ],
  },
];

// ─── Discover Data ────────────────────────────────────────────────────────────

export const RISING_ARTISTS: DiscoverArtist[] = [
  { id: 'da1', name: 'SPECTRA VOID', city: 'Detroit', role: 'Live Act / Visual', image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80', accentColor: '#c026d3', genre: 'Experimental Techno', momentum: 38, followers: 4900, recentDraw: 145, tag: 'Breaking' },
  { id: 'da2', name: 'CIPHER RUN', city: 'Chicago', role: 'DJ / Electro', image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=300&q=80', accentColor: '#eab308', genre: 'Industrial Electro', momentum: 24, followers: 4600, recentDraw: 130, tag: 'Rising' },
  { id: 'da3', name: 'DRIFT STATE', city: 'Berlin', role: 'DJ / Minimal', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80', accentColor: '#14b8a6', genre: 'Minimal Techno', momentum: 45, followers: 9800, recentDraw: 190, tag: 'Momentum' },
  { id: 'da4', name: 'NITE PROTOCOL', city: 'Detroit', role: 'DJ / Industrial', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdbbf0?w=300&q=80', accentColor: '#6366f1', genre: 'Industrial / EBM', momentum: 19, followers: 5800, recentDraw: 150, tag: 'Watch' },
  { id: 'da5', name: 'FORMA VITAE', city: 'Chicago', role: 'Electronic Artist', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', accentColor: '#8b5cf6', genre: 'Experimental / Drone', momentum: 31, followers: 3800, recentDraw: 120, tag: 'Emerging' },
  { id: 'da6', name: 'AXIS POINT', city: 'Chicago', role: 'DJ / Techno', image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=300&q=80', accentColor: '#06b6d4', genre: 'Techno / Minimal', momentum: 22, followers: 6400, recentDraw: 160, tag: 'Local Buzz' },
];

export const FRESH_RELEASES: DiscoverRelease[] = [
  { id: 'r1', title: 'SPECTRA SERIES vol.3', artist: 'LUX', artistImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80', type: 'live-recording', genre: 'Dark Techno', date: 'Jun 12', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', accentColor: '#c026d3', duration: '1h 29m', label: 'Self-released' },
  { id: 'r2', title: 'Threshold', artist: 'NOVA VEGA', artistImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80', type: 'ep', genre: 'Dark Electro', date: 'Jun 5', image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=400&q=80', accentColor: '#f43f5e', label: 'VOID CIRCUIT' },
  { id: 'r3', title: 'Meridian II', artist: 'KIRA SÓLARIS', artistImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', type: 'album', genre: 'Ambient Techno', date: 'May 28', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', accentColor: '#10b981', label: 'Mute Records' },
  { id: 'r4', title: 'Faultline (Live at Tresor)', artist: 'VESSEL THEORY', artistImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', type: 'live-recording', genre: 'Dark Techno', date: 'Jun 8', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80', accentColor: '#f43f5e', duration: '2h 15m', label: 'Candlestick' },
  { id: 'r5', title: 'Erosion Studies', artist: 'STATIC FORMA', artistImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', type: 'ep', genre: 'Noise / Industrial', date: 'Jun 1', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80', accentColor: '#a855f7', label: 'SIGNAL BLOC' },
  { id: 'r6', title: 'Motor City Transmissions', artist: 'ECHO PRIME', artistImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', type: 'mix', genre: 'EBM / Industrial', date: 'May 20', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', accentColor: '#06b6d4', duration: '58m', label: 'IRON FREQUENCIES' },
];

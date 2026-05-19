// ─── Admin Mock Data ──────────────────────────────────────────────────────────

// ─── Platform Metrics ─────────────────────────────────────────────────────────

export const PLATFORM_METRICS = {
  totalUsers: 14287,
  activeThisWeek: 3241,
  newThisMonth: 892,
  totalArtists: 9840,
  totalVenues: 1203,
  totalProposals: 4871,
  totalEvents: 3102,
  messagesTotal: 28940,
  waitlistTotal: 8412,
  cities: 24,
  userGrowth: 12.4,
  proposalGrowth: 8.7,
  eventGrowth: 15.2,
  proSubscriptions: 341,
  avgSessionMinutes: 14.2,
  dailyActiveUsers: 1840,
};

export const DAILY_SIGNUPS = [
  { date: 'May 5',  count: 48  },
  { date: 'May 6',  count: 61  },
  { date: 'May 7',  count: 55  },
  { date: 'May 8',  count: 72  },
  { date: 'May 9',  count: 83  },
  { date: 'May 10', count: 91  },
  { date: 'May 11', count: 78  },
  { date: 'May 12', count: 104 },
  { date: 'May 13', count: 117 },
  { date: 'May 14', count: 98  },
  { date: 'May 15', count: 134 },
  { date: 'May 16', count: 121 },
  { date: 'May 17', count: 148 },
  { date: 'May 18', count: 89  },
];

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  status: UserStatus;
  joinedAt: string;
  verified: boolean;
  proMember: boolean;
  proposals: number;
  lastSeen: string;
  avatar: string;
  reports: number;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'u1', name: 'Marcus Webb', email: 'marcus@novavega.com',
    role: 'DJ', city: 'Chicago, IL', status: 'active',
    joinedAt: 'Jan 12, 2025', verified: true, proMember: true,
    proposals: 14, lastSeen: '2h ago', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u2', name: 'Selin Arslan', email: 'selin@kirasolaris.com',
    role: 'Artist', city: 'Berlin, DE', status: 'active',
    joinedAt: 'Feb 3, 2025', verified: true, proMember: true,
    proposals: 9, lastSeen: '1d ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u3', name: 'Daniel Rowe', email: 'daniel@vesseltheory.co',
    role: 'Producer / DJ', city: 'London, UK', status: 'active',
    joinedAt: 'Dec 19, 2024', verified: true, proMember: true,
    proposals: 21, lastSeen: '4h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u4', name: 'Priya Mehta', email: 'priya@echoprime.nl',
    role: 'Live Act', city: 'Amsterdam, NL', status: 'active',
    joinedAt: 'Mar 7, 2025', verified: true, proMember: false,
    proposals: 5, lastSeen: '3d ago', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80',
    reports: 1,
  },
  {
    id: 'u5', name: 'Jake Torrence', email: 'jake@blindpig.com',
    role: 'Venue', city: 'Chicago, IL', status: 'active',
    joinedAt: 'Nov 4, 2024', verified: true, proMember: false,
    proposals: 0, lastSeen: '6h ago', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u6', name: 'Rosa Caliente', email: 'rosa@promoter.mx',
    role: 'Promoter', city: 'Mexico City, MX', status: 'pending',
    joinedAt: 'May 15, 2025', verified: false, proMember: false,
    proposals: 1, lastSeen: '1d ago', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u7', name: 'Devin Cross', email: 'devin.cross@gmail.com',
    role: 'DJ', city: 'Detroit, MI', status: 'suspended',
    joinedAt: 'Oct 22, 2024', verified: false, proMember: false,
    proposals: 3, lastSeen: '14d ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    reports: 3,
  },
  {
    id: 'u8', name: 'Tara Singh', email: 'tara@moanashift.com',
    role: 'Producer / DJ', city: 'Milwaukee, WI', status: 'active',
    joinedAt: 'Apr 1, 2025', verified: true, proMember: false,
    proposals: 7, lastSeen: '5h ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u9', name: 'Leon Okafor', email: 'leon@pulsecollective.com',
    role: 'Live Act', city: 'Chicago, IL', status: 'active',
    joinedAt: 'Jan 30, 2025', verified: true, proMember: false,
    proposals: 6, lastSeen: '2d ago', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u10', name: 'Ana Ferreira', email: 'ana@sablecurrent.nyc',
    role: 'DJ', city: 'New York, NY', status: 'active',
    joinedAt: 'Feb 18, 2025', verified: true, proMember: true,
    proposals: 11, lastSeen: '1h ago', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u11', name: 'Chris Nakamura', email: 'chris@marble-bar.com',
    role: 'Venue', city: 'Detroit, MI', status: 'pending',
    joinedAt: 'May 10, 2025', verified: false, proMember: false,
    proposals: 0, lastSeen: '3d ago', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80',
    reports: 0,
  },
  {
    id: 'u12', name: 'Sam Holloway', email: 'sam.h@freqghost.us',
    role: 'DJ', city: 'Detroit, MI', status: 'suspended',
    joinedAt: 'Sep 8, 2024', verified: false, proMember: false,
    proposals: 2, lastSeen: '30d ago', avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80',
    reports: 2,
  },
];

// ─── Verification Queue ────────────────────────────────────────────────────────

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  name: string;
  type: 'artist' | 'venue';
  city: string;
  role: string;
  submittedAt: string;
  avatar: string;
  socialLinks: string[];
  drawEstimate: number;
  reason: string;
  status: VerificationStatus;
  decidedBy?: string;
  decidedAt?: string;
}

export const VERIFICATION_QUEUE: VerificationRequest[] = [
  {
    id: 'vr1', name: 'ADAN BOOLEAN', type: 'artist', city: 'Detroit, MI',
    role: 'Electronic Artist / Noise', submittedAt: 'May 14, 2025',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    socialLinks: ['soundcloud.com/adan-boolean', 'instagram.com/adanboolean'],
    drawEstimate: 160,
    reason: 'Label releases on No-Audience Underground and self-released cassettes. Regular performer at Trinosophes Detroit.',
    status: 'pending',
  },
  {
    id: 'vr2', name: 'STATIC FORMA', type: 'artist', city: 'Chicago, IL',
    role: 'DJ / Noise', submittedAt: 'May 13, 2025',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
    socialLinks: ['soundcloud.com/static-forma', 'bandcamp.com/staticforma'],
    drawEstimate: 140,
    reason: 'Active on Chicago noise circuit. Monthly residency at Empty Bottle. Press coverage in Pitchfork and RA.',
    status: 'pending',
  },
  {
    id: 'vr3', name: 'Subterranean Club', type: 'venue', city: 'Chicago, IL',
    role: 'Venue', submittedAt: 'May 12, 2025',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80',
    socialLinks: ['instagram.com/subterranean_chi', 'ra.co/promoters/subterranean'],
    drawEstimate: 500,
    reason: 'Licensed venue operating since 2011. Two-floor layout, 500 cap. Worked with 200+ artists.',
    status: 'pending',
  },
  {
    id: 'vr4', name: 'SPECTRA VOID', type: 'artist', city: 'Detroit, MI',
    role: 'Live Act / Visual Artist', submittedAt: 'May 11, 2025',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80',
    socialLinks: ['soundcloud.com/spectra-void', 'vimeo.com/spectravoid'],
    drawEstimate: 145,
    reason: 'AV performer with custom-built generative visual system. Featured at Mutek Montréal 2024.',
    status: 'pending',
  },
  {
    id: 'vr5', name: 'HALF LIFE', type: 'artist', city: 'Chicago, IL',
    role: 'DJ / Industrial', submittedAt: 'May 10, 2025',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&q=80',
    socialLinks: ['soundcloud.com/half-life-chi'],
    drawEstimate: 125,
    reason: 'Cult following in Chicago industrial underground. Regular at Dungeon, Smartbar late-nights.',
    status: 'pending',
  },
  {
    id: 'vr6', name: 'FORMA VITAE', type: 'artist', city: 'Chicago, IL',
    role: 'Electronic Artist', submittedAt: 'May 9, 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    socialLinks: ['bandcamp.com/formavitae', 'instagram.com/formavitae'],
    drawEstimate: 120,
    reason: 'Released on Kranky records. Field recording and drone artist with international audience.',
    status: 'pending',
  },
  {
    id: 'vr7', name: 'CIPHER RUN', type: 'artist', city: 'Chicago, IL',
    role: 'DJ / Industrial Electro', submittedAt: 'May 8, 2025',
    avatar: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=300&q=80',
    socialLinks: ['soundcloud.com/cipher-run', 'instagram.com/cipherrun'],
    drawEstimate: 130,
    reason: 'EBM and harsh noise DJ. Self-released three EPs and touring across midwest circuit.',
    status: 'pending',
  },
  {
    id: 'vr8', name: 'NITE PROTOCOL', type: 'artist', city: 'Detroit, MI',
    role: 'DJ / Industrial', submittedAt: 'May 7, 2025',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdbbf0?w=300&q=80',
    socialLinks: ['soundcloud.com/nite-protocol'],
    drawEstimate: 150,
    reason: 'Deep catalog knowledge of Belgian EBM and German industrial. Resident at Marble Bar.',
    status: 'approved', decidedBy: 'stagefront2025', decidedAt: 'May 7, 2025',
  },
  {
    id: 'vr9', name: 'AXIS POINT', type: 'artist', city: 'Chicago, IL',
    role: 'DJ / Techno', submittedAt: 'May 6, 2025',
    avatar: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=300&q=80',
    socialLinks: ['soundcloud.com/axis-point'],
    drawEstimate: 160,
    reason: 'Fixture on Chicago late-night circuit. Six years active. No label releases but strong draw.',
    status: 'rejected', decidedBy: 'stagefront2025', decidedAt: 'May 6, 2025',
  },
  {
    id: 'vr10', name: 'MOANA SHIFT', type: 'artist', city: 'Milwaukee, WI',
    role: 'Producer / DJ', submittedAt: 'May 5, 2025',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80',
    socialLinks: ['soundcloud.com/moana-shift', 'open.spotify.com/artist/moanashift'],
    drawEstimate: 180,
    reason: 'Signed to Phantom Trax. Spotify monthly listeners 5,700. Touring midwest and northeast.',
    status: 'approved', decidedBy: 'stagefront2025', decidedAt: 'May 6, 2025',
  },
];

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ReportType = 'profile' | 'content' | 'proposal' | 'message';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';
export type ReportSeverity = 'low' | 'medium' | 'high';

export interface Report {
  id: string;
  type: ReportType;
  reportedName: string;
  reportedImage: string;
  reportedBy: string;
  reason: string;
  description: string;
  submittedAt: string;
  status: ReportStatus;
  severity: ReportSeverity;
}

export const REPORTS: Report[] = [
  {
    id: 'rp1', type: 'profile', reportedName: 'FAKE_ARTIST_99',
    reportedImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    reportedBy: 'Marcus Webb', reason: 'Impersonation',
    description: 'This account is using NOVA VEGA\'s photos and bio text. The profile was created 3 days ago and has already sent multiple booking requests with fake rates.',
    submittedAt: 'May 16, 2025', status: 'pending', severity: 'high',
  },
  {
    id: 'rp2', type: 'proposal', reportedName: 'GHOST RAVE CHICAGO',
    reportedImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80',
    reportedBy: 'Jake Torrence', reason: 'Fraudulent proposal',
    description: 'This proposal claims to have The Blind Pig as the venue but we never agreed to this event. The promoter is collecting ticket deposits on external site.',
    submittedAt: 'May 15, 2025', status: 'pending', severity: 'high',
  },
  {
    id: 'rp3', type: 'message', reportedName: 'Devin Cross',
    reportedImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    reportedBy: 'Priya Mehta', reason: 'Harassment',
    description: 'Repeated unsolicited messages after being told to stop. Third incident from this user this month.',
    submittedAt: 'May 14, 2025', status: 'pending', severity: 'medium',
  },
  {
    id: 'rp4', type: 'content', reportedName: 'SPAM PROMOTER',
    reportedImage: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80',
    reportedBy: 'Leon Okafor', reason: 'Spam',
    description: 'This profile is spamming open calls with identical low-effort proposals and not responding to venue counteroffers.',
    submittedAt: 'May 13, 2025', status: 'reviewed', severity: 'low',
  },
  {
    id: 'rp5', type: 'profile', reportedName: 'SAM HOLLOWAY',
    reportedImage: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=80&q=80',
    reportedBy: 'Ana Ferreira', reason: 'Misleading information',
    description: 'Profile claims verified artist status and major festival credits that are not verifiable. Has sent misleading booking inquiries to multiple venues.',
    submittedAt: 'May 12, 2025', status: 'pending', severity: 'medium',
  },
  {
    id: 'rp6', type: 'content', reportedName: 'DROPOUT COLLECTIVE',
    reportedImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
    reportedBy: 'Tara Singh', reason: 'Hate speech',
    description: 'Event description contains discriminatory language targeting a specific community. Screenshots attached.',
    submittedAt: 'May 11, 2025', status: 'dismissed', severity: 'high',
  },
];

// ─── Cities / Scenes ──────────────────────────────────────────────────────────

export type CityStatus = 'active' | 'launching' | 'waitlist';

export interface AdminCity {
  id: string;
  name: string;
  status: CityStatus;
  artists: number;
  venues: number;
  events: number;
  waitlistCount: number;
  trend: string;
  launchDate?: string;
}

export const ADMIN_CITIES: AdminCity[] = [
  { id: 'chicago',       name: 'Chicago',       status: 'active',    artists: 2840, venues: 142, events: 891, waitlistCount: 847,  trend: '+24 today'  },
  { id: 'detroit',       name: 'Detroit',        status: 'active',    artists: 1204, venues: 67,  events: 341, waitlistCount: 312,  trend: '+8 today'   },
  { id: 'new-york',      name: 'New York',       status: 'active',    artists: 3210, venues: 298, events: 1102, waitlistCount: 2104, trend: '+67 today'  },
  { id: 'los-angeles',   name: 'Los Angeles',    status: 'active',    artists: 2108, venues: 184, events: 743, waitlistCount: 1876, trend: '+51 today'  },
  { id: 'berlin',        name: 'Berlin',         status: 'active',    artists: 1890, venues: 210, events: 820, waitlistCount: 1203, trend: '+38 today'  },
  { id: 'london',        name: 'London',         status: 'active',    artists: 1540, venues: 178, events: 612, waitlistCount: 934,  trend: '+29 today'  },
  { id: 'amsterdam',     name: 'Amsterdam',      status: 'launching', artists: 480,  venues: 52,  events: 140, waitlistCount: 445,  trend: '+14 today', launchDate: 'Jun 1, 2025'  },
  { id: 'brooklyn',      name: 'Brooklyn',       status: 'launching', artists: 620,  venues: 71,  events: 198, waitlistCount: 673,  trend: '+22 today', launchDate: 'Jun 15, 2025' },
  { id: 'toronto',       name: 'Toronto',        status: 'waitlist',  artists: 0,    venues: 0,   events: 0,   waitlistCount: 389,  trend: '+11 today'  },
  { id: 'melbourne',     name: 'Melbourne',      status: 'waitlist',  artists: 0,    venues: 0,   events: 0,   waitlistCount: 274,  trend: '+9 today'   },
  { id: 'paris',         name: 'Paris',          status: 'waitlist',  artists: 0,    venues: 0,   events: 0,   waitlistCount: 521,  trend: '+17 today'  },
  { id: 'mexico-city',   name: 'Mexico City',    status: 'waitlist',  artists: 0,    venues: 0,   events: 0,   waitlistCount: 312,  trend: '+10 today'  },
];

// ─── Waitlist (Admin View) ────────────────────────────────────────────────────

export type WaitlistEntryStatus = 'pending' | 'invited' | 'joined';

export interface AdminWaitlistEntry {
  id: string;
  name: string;
  email: string;
  city: string;
  role: string;
  position: number;
  referralCode: string;
  referralCount: number;
  joinedAt: string;
  status: WaitlistEntryStatus;
}

export const ADMIN_WAITLIST: AdminWaitlistEntry[] = [
  { id: 'wl1',  name: 'Jordan Blake',    email: 'jordan@blake.io',        city: 'Chicago',     role: 'DJ',           position: 1,   referralCode: 'JBL8K2MN', referralCount: 12, joinedAt: 'May 1, 2025',  status: 'invited'  },
  { id: 'wl2',  name: 'Mei Nakamura',    email: 'mei.n@nakamura.jp',      city: 'New York',    role: 'Artist',       position: 2,   referralCode: 'MNK7X4PQ', referralCount: 9,  joinedAt: 'Apr 28, 2025', status: 'joined'   },
  { id: 'wl3',  name: 'Felix Strauss',   email: 'felix@berlin-dj.de',     city: 'Berlin',      role: 'Producer',     position: 3,   referralCode: 'FST2R9YW', referralCount: 8,  joinedAt: 'Apr 25, 2025', status: 'joined'   },
  { id: 'wl4',  name: 'Camille Dubois',  email: 'camille@dubois.fr',      city: 'Paris',       role: 'Venue',        position: 4,   referralCode: 'CDU5A3BV', referralCount: 6,  joinedAt: 'May 3, 2025',  status: 'invited'  },
  { id: 'wl5',  name: 'Rico Navarro',    email: 'rico@navarro.mx',        city: 'Mexico City', role: 'Promoter',     position: 5,   referralCode: 'RNV8J1KZ', referralCount: 5,  joinedAt: 'May 5, 2025',  status: 'pending'  },
  { id: 'wl6',  name: 'Aisha Johnson',   email: 'aisha.j@atl.us',         city: 'Los Angeles', role: 'DJ',           position: 8,   referralCode: 'AJH4L7MX', referralCount: 4,  joinedAt: 'May 6, 2025',  status: 'pending'  },
  { id: 'wl7',  name: 'Tomasz Wiśnik',   email: 'tomasz@wishnik.pl',      city: 'Berlin',      role: 'Artist',       position: 11,  referralCode: 'TWI3N8QP', referralCount: 4,  joinedAt: 'May 7, 2025',  status: 'pending'  },
  { id: 'wl8',  name: 'Lauren Hayes',    email: 'l.hayes@chi.edu',        city: 'Chicago',     role: 'Visual Artist',position: 14,  referralCode: 'LHA6T2WR', referralCount: 3,  joinedAt: 'May 8, 2025',  status: 'pending'  },
  { id: 'wl9',  name: 'Darius Osei',     email: 'darius@oseisound.uk',    city: 'London',      role: 'Producer',     position: 17,  referralCode: 'DOS9Y5NM', referralCount: 3,  joinedAt: 'May 9, 2025',  status: 'pending'  },
  { id: 'wl10', name: 'Yuki Tanaka',     email: 'yuki@tanaka-dj.jp',      city: 'Amsterdam',   role: 'DJ',           position: 21,  referralCode: 'YTA2B8VK', referralCount: 2,  joinedAt: 'May 10, 2025', status: 'pending'  },
  { id: 'wl11', name: 'Phoebe Turner',   email: 'phoebe@turnersound.au',  city: 'Melbourne',   role: 'Artist',       position: 24,  referralCode: 'PTU7X3JL', referralCount: 2,  joinedAt: 'May 10, 2025', status: 'pending'  },
  { id: 'wl12', name: 'Marcus Greene',   email: 'mgreene@detroit.mi',     city: 'Detroit',     role: 'Venue',        position: 27,  referralCode: 'MGR5K9WY', referralCount: 1,  joinedAt: 'May 11, 2025', status: 'pending'  },
  { id: 'wl13', name: 'Sofia Reyes',     email: 'sofia@reyesmusic.es',    city: 'Los Angeles', role: 'Promoter',     position: 31,  referralCode: 'SRE8A4NP', referralCount: 1,  joinedAt: 'May 11, 2025', status: 'pending'  },
  { id: 'wl14', name: 'James O\'Brien',  email: 'james@obrien.ie',        city: 'London',      role: 'DJ',           position: 38,  referralCode: 'JOB3T7MX', referralCount: 1,  joinedAt: 'May 12, 2025', status: 'pending'  },
  { id: 'wl15', name: 'Nina Voigt',      email: 'nina.voigt@berlin.de',   city: 'Berlin',      role: 'Artist',       position: 44,  referralCode: 'NVO6R2KQ', referralCount: 0,  joinedAt: 'May 12, 2025', status: 'pending'  },
  { id: 'wl16', name: 'Carlos Mendez',   email: 'c.mendez@ny.us',         city: 'New York',    role: 'Producer',     position: 52,  referralCode: 'CME9X5WB', referralCount: 0,  joinedAt: 'May 13, 2025', status: 'pending'  },
  { id: 'wl17', name: 'Lia Fontaine',    email: 'lia@fontainemusic.fr',   city: 'Paris',       role: 'DJ',           position: 61,  referralCode: 'LFO4J8YV', referralCount: 0,  joinedAt: 'May 13, 2025', status: 'pending'  },
  { id: 'wl18', name: 'Sam Ortega',      email: 'sam.ortega@la.us',       city: 'Los Angeles', role: 'Visual Artist',position: 74,  referralCode: 'SOR7N3KP', referralCount: 0,  joinedAt: 'May 14, 2025', status: 'pending'  },
  { id: 'wl19', name: 'Rajan Patel',     email: 'rajan@patelsound.ca',    city: 'Toronto',     role: 'Artist',       position: 89,  referralCode: 'RPA2W6TX', referralCount: 0,  joinedAt: 'May 14, 2025', status: 'pending'  },
  { id: 'wl20', name: 'Britta Svensson', email: 'britta@svensson.se',     city: 'Amsterdam',   role: 'Venue',        position: 104, referralCode: 'BSV5Q9MN', referralCount: 0,  joinedAt: 'May 15, 2025', status: 'pending'  },
];

// ─── Featured Slots ────────────────────────────────────────────────────────────

export type FeaturedSection = 'hero' | 'artists' | 'venues' | 'events';

export interface FeaturedSlot {
  id: string;
  section: FeaturedSection;
  entityName: string;
  entityImage: string;
  entityType: 'artist' | 'venue' | 'event';
  entitySlug: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const FEATURED_SLOTS: FeaturedSlot[] = [
  {
    id: 'fs1', section: 'artists', entityName: 'KIRA SÓLARIS', entityType: 'artist',
    entitySlug: 'kira-solaris',
    entityImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    startDate: 'May 12, 2025', endDate: 'May 26, 2025', active: true,
  },
  {
    id: 'fs2', section: 'artists', entityName: 'NOVA VEGA', entityType: 'artist',
    entitySlug: 'nova-vega',
    entityImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    startDate: 'May 12, 2025', endDate: 'May 26, 2025', active: true,
  },
  {
    id: 'fs3', section: 'venues', entityName: 'Smart Bar', entityType: 'venue',
    entitySlug: 'smart-bar',
    entityImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80',
    startDate: 'May 10, 2025', endDate: 'May 24, 2025', active: true,
  },
  {
    id: 'fs4', section: 'artists', entityName: 'VESSEL THEORY', entityType: 'artist',
    entitySlug: 'vessel-theory',
    entityImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    startDate: 'May 26, 2025', endDate: 'Jun 9, 2025', active: false,
  },
  {
    id: 'fs5', section: 'venues', entityName: 'Marble Bar', entityType: 'venue',
    entitySlug: 'marble-bar',
    entityImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80',
    startDate: 'May 26, 2025', endDate: 'Jun 9, 2025', active: false,
  },
];

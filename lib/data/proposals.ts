import { ARTISTS } from '@/lib/data/artists';
import { VENUES } from '@/lib/data/venues';

// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type ProposalStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'accepted'
  | 'rejected'
  | 'changes-requested';

export type EventType = 'one-night' | 'residency' | 'festival-slot' | 'pop-up';

export type DrawConfidence = 'low' | 'medium' | 'high';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface ProposalLineupArtist {
  artistId: string;
  name: string;
  role: 'headliner' | 'support' | 'opener' | 'b2b' | 'live-act' | 'visual-artist';
  startTime: string;
  duration: number;
  fee: number;
  image: string;
  accentColor: string;
  genres: string[];
  draw: number;
}

export interface ProposalCollaborator {
  id: string;
  name: string;
  role: string;
  email?: string;
  image: string;
}

// ─── Main Type ────────────────────────────────────────────────────────────────

export interface ShowProposal {
  id: string;
  // Concept
  name: string;
  tagline: string;
  eventType: EventType;
  genres: string[];
  accentColor: string;
  coverImage: string;
  // Date & Venue
  venueId: string;
  venueName: string;
  venueCity: string;
  venueCapacity: number;
  proposedDate: string;
  doorsTime: string;
  endTime: string;
  dateNotes: string;
  // Lineup
  lineup: ProposalLineupArtist[];
  // Crew
  collaborators: ProposalCollaborator[];
  // Draw
  estimatedDraw: number;
  drawConfidence: DrawConfidence;
  drawNotes: string;
  // Promo
  promoChannels: string[];
  promoNotes: string;
  promoTimeline: string;
  // Budget
  totalArtistFees: number;
  productionBudget: number;
  marketingBudget: number;
  ticketPrice: string;
  revenueSplit: string;
  budgetNotes: string;
  // Meta
  submittedById: string;
  submittedByName: string;
  submittedByImage: string;
  submittedByRole: string;
  status: ProposalStatus;
  createdAt: string;
  submittedAt?: string;
  venueResponse?: string;
  venueRespondedAt?: string;
  venueNote?: string;
  changeRequests?: string[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const PROPOSAL_STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; color: string; description: string }
> = {
  draft: {
    label: 'Draft',
    color: '#64748b',
    description: 'Not yet submitted',
  },
  submitted: {
    label: 'Submitted',
    color: '#06b6d4',
    description: 'Awaiting venue review',
  },
  'under-review': {
    label: 'Under Review',
    color: '#f59e0b',
    description: 'Venue is reviewing your proposal',
  },
  accepted: {
    label: 'Accepted',
    color: '#10b981',
    description: 'Venue has accepted your proposal',
  },
  rejected: {
    label: 'Rejected',
    color: '#f43f5e',
    description: 'Venue has declined your proposal',
  },
  'changes-requested': {
    label: 'Changes Requested',
    color: '#a855f7',
    description: 'Venue requested modifications',
  },
};

export const GENRE_OPTIONS = [
  'Techno',
  'Industrial',
  'Dark Electro',
  'EBM',
  'Ambient Techno',
  'Dub Techno',
  'Minimal',
  'Noise',
  'Power Electronics',
  'House',
  'Dark House',
  'Breakbeat',
  'Experimental',
  'Drone',
  'Afro-Tech',
  'Hardcore',
  'Live Electronics',
  'AV Performance',
  'Synth',
  'Post-Industrial',
];

export const PROMO_CHANNEL_OPTIONS = [
  'Instagram',
  'Resident Advisor',
  'Facebook Events',
  'Email List',
  'Flyering / Postering',
  'Spotify Playlists',
  'SoundCloud',
  'Bandcamp',
  'Local Press',
  'Word of Mouth / Scene Network',
];

export const CREW_ROLES = [
  'Promoter',
  'Sound Engineer',
  'Lighting Designer',
  'Booking Agent',
  'Photographer',
  'Videographer',
  'Visual Artist',
  'Stage Manager',
  'PR / Press',
  'Door Manager',
];

// ─── Helpers (lookup) ─────────────────────────────────────────────────────────

const artistById = new Map(ARTISTS.map((a) => [a.id, a]));
const venueById = new Map(VENUES.map((v) => [v.id, v]));

function makeLineupArtist(
  artistId: string,
  role: ProposalLineupArtist['role'],
  startTime: string,
  duration: number,
  fee: number
): ProposalLineupArtist {
  const a = artistById.get(artistId);
  if (!a) throw new Error(`Artist not found: ${artistId}`);
  return {
    artistId,
    name: a.name,
    role,
    startTime,
    duration,
    fee,
    image: a.image,
    accentColor: a.accentColor,
    genres: a.genres,
    draw: a.draw,
  };
}

const SUBMITTER_IMAGE =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80';

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PROPOSALS: ShowProposal[] = [
  // ── Proposal 1: NEURAL DRIFT ─────────────────────────────────────────────
  {
    id: 'prop-001',
    name: 'NEURAL DRIFT',
    tagline: 'A descent into dark electro architecture — one night only',
    eventType: 'one-night',
    genres: ['Dark Electro', 'Industrial', 'EBM', 'Techno'],
    accentColor: '#c026d3',
    coverImage:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',

    venueId: 'the-blind-pig',
    venueName: venueById.get('the-blind-pig')!.name,
    venueCity: venueById.get('the-blind-pig')!.city,
    venueCapacity: venueById.get('the-blind-pig')!.capacity,
    proposedDate: '2025-06-21',
    doorsTime: '22:00',
    endTime: '04:00',
    dateNotes: 'Summer solstice — ideal for a long dark night.',

    lineup: [
      makeLineupArtist('nova-vega', 'headliner', '01:00', 120, 450),
      makeLineupArtist('lux', 'support', '23:00', 90, 350),
      makeLineupArtist('static-forma', 'opener', '22:00', 60, 150),
    ],

    collaborators: [
      {
        id: 'collab-001',
        name: 'REN VALE',
        role: 'Lighting Designer',
        email: 'ren@valestudio.com',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
      },
      {
        id: 'collab-002',
        name: 'DANA CROSS',
        role: 'Sound Engineer',
        image:
          'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80',
      },
    ],

    estimatedDraw: 240,
    drawConfidence: 'high',
    drawNotes:
      'Nova Vega has a strong Chicago following. The solstice date drives additional walk-in traffic from the neighborhood.',

    promoChannels: [
      'Instagram',
      'Resident Advisor',
      'Flyering / Postering',
      'Email List',
      'Word of Mouth / Scene Network',
    ],
    promoTimeline:
      '6 weeks out: RA listing + Instagram announcement. 4 weeks: flyer drop in Wicker Park and Logan Square. 2 weeks: email blast to 1,400 subscribers. 1 week: daily story reposts from all three artists.',
    promoNotes:
      'All three artists will post to their socials. Nova Vega has a combined reach of ~25k across platforms.',

    totalArtistFees: 950,
    productionBudget: 300,
    marketingBudget: 250,
    ticketPrice: '$15 adv / $20 door',
    revenueSplit: '70/30 after costs, venue takes bar',
    budgetNotes:
      'Breakeven at ~100 tickets. Expecting 220–260 in attendance based on artist histories.',

    submittedById: 'nova-vega',
    submittedByName: 'NOVA VEGA',
    submittedByRole: 'DJ / Dark Electro',
    submittedByImage: SUBMITTER_IMAGE,
    status: 'under-review',
    createdAt: '2025-04-28T10:00:00Z',
    submittedAt: '2025-05-01T14:30:00Z',
  },

  // ── Proposal 2: SIGNAL COLLAPSE ──────────────────────────────────────────
  {
    id: 'prop-002',
    name: 'SIGNAL COLLAPSE',
    tagline: 'Ambient techno for the long haul — sunrise guaranteed',
    eventType: 'one-night',
    genres: ['Ambient Techno', 'Dub Techno', 'Minimal'],
    accentColor: '#06b6d4',
    coverImage:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',

    venueId: 'smart-bar',
    venueName: venueById.get('smart-bar')!.name,
    venueCity: venueById.get('smart-bar')!.city,
    venueCapacity: venueById.get('smart-bar')!.capacity,
    proposedDate: '2025-07-12',
    doorsTime: '22:00',
    endTime: '06:00',
    dateNotes: 'Saturday night into Sunday sunrise.',

    lineup: [
      makeLineupArtist('kira-solaris', 'headliner', '02:00', 180, 1400),
      makeLineupArtist('drift-state', 'opener', '22:00', 120, 600),
    ],

    collaborators: [
      {
        id: 'collab-003',
        name: 'MARA LENZ',
        role: 'Promoter',
        email: 'mara@collapseevents.com',
        image:
          'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80',
      },
    ],

    estimatedDraw: 185,
    drawConfidence: 'high',
    drawNotes:
      'Kira Sólaris has a dedicated Chicago audience from her previous Smart Bar appearance in 2023, which sold out at 190.',

    promoChannels: [
      'Resident Advisor',
      'Instagram',
      'Email List',
      'Spotify Playlists',
      'Word of Mouth / Scene Network',
    ],
    promoTimeline:
      '8 weeks: RA listing + international outreach to ambient techno communities. 4 weeks: Instagram campaign + Berlin/Chicago cross-promo. 2 weeks: final email push.',
    promoNotes:
      'Kira has agreed to share the event to her 28k RA followers. Drift State will handle Chicago-local outreach.',

    totalArtistFees: 2000,
    productionBudget: 400,
    marketingBudget: 350,
    ticketPrice: '$20 adv / $25 door',
    revenueSplit: '65/35 gross after artist fees, venue takes bar',
    budgetNotes:
      'Higher fee for Kira offset by strong ticket expectations. Breakeven at ~130 tickets at adv price.',

    submittedById: 'nova-vega',
    submittedByName: 'NOVA VEGA',
    submittedByRole: 'DJ / Dark Electro',
    submittedByImage: SUBMITTER_IMAGE,
    status: 'accepted',
    createdAt: '2025-04-15T09:00:00Z',
    submittedAt: '2025-04-18T16:00:00Z',
    venueResponse:
      'Great lineup. We love the ambient techno direction. Confirmed for July 12.',
    venueRespondedAt: '2025-05-10T14:23:00Z',
  },

  // ── Proposal 3: DARK MATTER VOL.5 ────────────────────────────────────────
  {
    id: 'prop-003',
    name: 'DARK MATTER VOL.5',
    tagline: 'The fifth chapter — darker, deeper, louder',
    eventType: 'one-night',
    genres: ['Dark Electro', 'Industrial', 'Noise', 'Synth'],
    accentColor: '#f43f5e',
    coverImage:
      'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=1200&q=80',

    venueId: 'empty-bottle',
    venueName: venueById.get('empty-bottle')!.name,
    venueCity: venueById.get('empty-bottle')!.city,
    venueCapacity: venueById.get('empty-bottle')!.capacity,
    proposedDate: '2025-08-09',
    doorsTime: '21:00',
    endTime: '03:00',
    dateNotes:
      'August heat drives strong indoor attendance. This is the fifth Dark Matter event — established series.',

    lineup: [
      makeLineupArtist('mira-null', 'headliner', '00:00', 120, 900),
      makeLineupArtist('vessel-theory', 'support', '22:30', 90, 1000),
      makeLineupArtist('adan-boolean', 'opener', '21:00', 75, 250),
    ],

    collaborators: [
      {
        id: 'collab-004',
        name: 'ZERO SIGNAL',
        role: 'Visual Artist',
        image:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
      },
      {
        id: 'collab-005',
        name: 'CAL BERG',
        role: 'Photographer',
        email: 'cal@bergphoto.com',
        image:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
      },
    ],

    estimatedDraw: 310,
    drawConfidence: 'medium',
    drawNotes:
      'Dark Matter Vol.4 drew 275. With Vessel Theory on the bill the draw should increase. Empty Bottle is slightly larger which helps.',

    promoChannels: [
      'Instagram',
      'Resident Advisor',
      'Flyering / Postering',
      'Facebook Events',
      'Email List',
      'Local Press',
    ],
    promoTimeline:
      '6 weeks: announce via all artist socials + RA. 4 weeks: flyer drop Wicker Park/Bucktown/Logan Square. 3 weeks: local press pitch to Chicago Reader + Pitchfork. 2 weeks: email blast. 1 week: FOMO campaign.',
    promoNotes:
      'Dark Matter is a recognized series in Chicago. Vol.4 received press coverage in the Chicago Reader. We expect similar or stronger reception.',

    totalArtistFees: 2150,
    productionBudget: 500,
    marketingBudget: 400,
    ticketPrice: '$18 adv / $22 door',
    revenueSplit: '60/40 gross after artist fees',
    budgetNotes:
      'Higher production budget for custom visuals by Zero Signal. Breakeven at ~160 tickets.',

    submittedById: 'nova-vega',
    submittedByName: 'NOVA VEGA',
    submittedByRole: 'DJ / Dark Electro',
    submittedByImage: SUBMITTER_IMAGE,
    status: 'submitted',
    createdAt: '2025-05-05T11:00:00Z',
    submittedAt: '2025-05-12T09:45:00Z',
  },

  // ── Proposal 4: VOID CIRCUIT SHOWCASE ────────────────────────────────────
  {
    id: 'prop-004',
    name: 'VOID CIRCUIT SHOWCASE',
    tagline: 'Detroit meets Chicago on the industrial floor',
    eventType: 'one-night',
    genres: ['Techno', 'Industrial', 'EBM', 'Breakbeat'],
    accentColor: '#f59e0b',
    coverImage:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',

    venueId: 'marble-bar',
    venueName: venueById.get('marble-bar')!.name,
    venueCity: venueById.get('marble-bar')!.city,
    venueCapacity: venueById.get('marble-bar')!.capacity,
    proposedDate: '2025-07-05',
    doorsTime: '22:00',
    endTime: '04:00',
    dateNotes: 'Post-July 4th weekend — Detroit locals will be energized.',

    lineup: [
      makeLineupArtist('echo-prime', 'headliner', '01:00', 120, 900),
      makeLineupArtist('frequency-ghost', 'support', '23:00', 90, 300),
    ],

    collaborators: [
      {
        id: 'collab-006',
        name: 'PETRA MOS',
        role: 'Booking Agent',
        email: 'petra@voidcircuit.com',
        image:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
      },
    ],

    estimatedDraw: 280,
    drawConfidence: 'medium',
    drawNotes:
      'Echo Prime is strong in both Amsterdam and Detroit touring markets. Frequency Ghost has a loyal Detroit following.',

    promoChannels: [
      'Instagram',
      'Resident Advisor',
      'Facebook Events',
      'Email List',
      'Flyering / Postering',
    ],
    promoTimeline:
      '5 weeks: RA listing + social announcement. 3 weeks: flyer campaign across Detroit. 2 weeks: email blast. 1 week: ticket giveaway on socials.',
    promoNotes: 'Petra Mos has existing relationships with Marble Bar staff.',

    totalArtistFees: 1200,
    productionBudget: 350,
    marketingBudget: 300,
    ticketPrice: '$15 adv / $20 door',
    revenueSplit: '65/35 after costs',
    budgetNotes: 'Lean budget — this showcase is designed to test the Detroit market.',

    submittedById: 'nova-vega',
    submittedByName: 'NOVA VEGA',
    submittedByRole: 'DJ / Dark Electro',
    submittedByImage: SUBMITTER_IMAGE,
    status: 'rejected',
    createdAt: '2025-04-20T08:30:00Z',
    submittedAt: '2025-04-25T12:00:00Z',
    venueNote:
      'Date conflict with existing booking. Please propose an alternative weekend.',
    venueRespondedAt: '2025-05-08T09:15:00Z',
  },

  // ── Proposal 5: TRANSMISSION ─────────────────────────────────────────────
  {
    id: 'prop-005',
    name: 'TRANSMISSION',
    tagline: 'Four artists, one signal — lose yourself in the frequency',
    eventType: 'one-night',
    genres: ['Dark Electro', 'Industrial', 'EBM', 'Industrial Electro'],
    accentColor: '#a855f7',
    coverImage:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',

    venueId: 'subterranean',
    venueName: venueById.get('subterranean')!.name,
    venueCity: venueById.get('subterranean')!.city,
    venueCapacity: venueById.get('subterranean')!.capacity,
    proposedDate: '2025-07-26',
    doorsTime: '21:00',
    endTime: '04:00',
    dateNotes: 'Late July — peak summer underground season.',

    lineup: [
      makeLineupArtist('nova-vega', 'headliner', '01:00', 120, 500),
      makeLineupArtist('lux', 'support', '23:30', 90, 400),
      makeLineupArtist('nite-protocol', 'opener', '22:00', 75, 250),
      makeLineupArtist('cipher-run', 'opener', '21:00', 60, 200),
    ],

    collaborators: [
      {
        id: 'collab-007',
        name: 'SIGRID VAEL',
        role: 'Lighting Designer',
        email: 'sigrid@vaellight.com',
        image:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80',
      },
    ],

    estimatedDraw: 380,
    drawConfidence: 'medium',
    drawNotes:
      'Four artists means broader combined reach. Subterranean holds 500 so a 380 draw is realistic.',

    promoChannels: [
      'Instagram',
      'Resident Advisor',
      'Email List',
      'Flyering / Postering',
      'Facebook Events',
      'SoundCloud',
      'Word of Mouth / Scene Network',
    ],
    promoTimeline:
      '7 weeks: announce all four artists simultaneously across socials. 5 weeks: RA listing + Chicago event aggregators. 3 weeks: flyer campaign. 2 weeks: SoundCloud mix release teasing the event. 1 week: ticket urgency push.',
    promoNotes:
      'Combined social reach across all four artists exceeds 30k. Strong word-of-mouth expected from the industrial/EBM community.',

    totalArtistFees: 1350,
    productionBudget: 450,
    marketingBudget: 350,
    ticketPrice: '$12 adv / $18 door',
    revenueSplit: '60/40 gross after costs',
    budgetNotes:
      'Lower ticket price to maximize attendance and bar revenue at a larger room.',

    submittedById: 'nova-vega',
    submittedByName: 'NOVA VEGA',
    submittedByRole: 'DJ / Dark Electro',
    submittedByImage: SUBMITTER_IMAGE,
    status: 'changes-requested',
    createdAt: '2025-04-30T13:00:00Z',
    submittedAt: '2025-05-05T10:15:00Z',
    venueRespondedAt: '2025-05-13T11:30:00Z',
    changeRequests: [
      'Reduce lineup to 3 artists maximum for this venue',
      'Increase marketing budget to at least $500',
      'Provide sound engineer contact 2 weeks before event',
    ],
  },
];

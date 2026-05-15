// ─── Message System Types ─────────────────────────────────────────────────────

export type ConvoType = 'dm' | 'group' | 'proposal' | 'collab';

export interface ConvoMember {
  name: string;
  image: string;
  online: boolean;
}

// ─── Message Attachment Cards ─────────────────────────────────────────────────

export interface EventCard {
  kind: 'event';
  id: string;
  name: string;
  venue: string;
  date: string;
  status: 'draft' | 'pitching' | 'confirmed';
  accentColor: string;
  coverImage: string;
  lineup: string[];
  href: string;
}

export interface ProposalCard {
  kind: 'proposal';
  id: string;
  name: string;
  venue: string;
  proposedDate: string;
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'changes-requested';
  accentColor: string;
  lineupCount: number;
  estimatedDraw: number;
  totalBudget: number;
  href: string;
}

export interface ArtistCard {
  kind: 'artist';
  name: string;
  role: string;
  image: string;
  accentColor: string;
  draw: number;
  fee: string;
  city: string;
  href: string;
}

export type MsgCard = EventCard | ProposalCard | ArtistCard;

// ─── Reactions ────────────────────────────────────────────────────────────────

export interface Reaction {
  emoji: string;
  count: number;
  mine: boolean;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface RichMessage {
  id: string;
  from: string;
  fromImage: string;
  content: string;
  time: string;
  isMe: boolean;
  isSystem?: boolean;
  card?: MsgCard;
  reactions?: Reaction[];
}

// ─── Thread Context (for proposal/collab types) ───────────────────────────────

export interface ProposalContext {
  kind: 'proposal';
  proposalId: string;
  eventName: string;
  venueName: string;
  proposedDate: string;
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'changes-requested';
  accentColor: string;
}

export interface CollabContext {
  kind: 'collab';
  collabType: 'compilation' | 'show' | 'residency' | 'b2b';
  projectName: string;
  initiator: string;
  status: 'pending' | 'active' | 'declined';
  accentColor: string;
}

export type ThreadContext = ProposalContext | CollabContext;

// ─── Conversation ─────────────────────────────────────────────────────────────

export interface RichConversation {
  id: string;
  type: ConvoType;
  name: string;
  image?: string;
  members?: ConvoMember[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  accentColor: string;
  messages: RichMessage[];
  context?: ThreadContext;
  pinned?: boolean;
}

// ─── Shared Images ────────────────────────────────────────────────────────────

const ME_IMG = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80';
const MARCUS_IMG = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80';
const JESS_IMG = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80';
const DEV_IMG = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80';
const KIRA_IMG = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80';
const LUX_IMG = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80';
const STATIC_IMG = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80';
const SOFIA_IMG = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80';
const VOID_IMG = 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=80&q=80';
const AALIYAH_IMG = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80';

// ─── Conversations ────────────────────────────────────────────────────────────

export const RICH_CONVERSATIONS: RichConversation[] = [

  // ── GROUP: NEURAL DRIFT show planning ─────────────────────────────────────
  {
    id: 'neural-drift-crew',
    type: 'group',
    name: 'NEURAL DRIFT crew',
    accentColor: '#c026d3',
    pinned: true,
    members: [
      { name: 'Marcus Bell',   image: MARCUS_IMG, online: true },
      { name: 'Jess Okafor',  image: JESS_IMG,   online: true },
      { name: 'Dev Shin',     image: DEV_IMG,    online: false },
      { name: 'You (NOVA VEGA)', image: ME_IMG,  online: true },
    ],
    lastMessage: 'Marcus: Doors 9pm, not 9:30. Update the flyer.',
    lastTime: '12m',
    unread: 3,
    messages: [
      {
        id: 'nd-1',
        from: 'Jess Okafor', fromImage: JESS_IMG,
        content: 'LUX confirmed the full headliner fee. We\'re good to go.',
        time: '2h ago', isMe: false,
        reactions: [{ emoji: '🤘', count: 3, mine: true }],
      },
      {
        id: 'nd-2',
        from: 'You', fromImage: ME_IMG,
        content: 'Here\'s the current event build — review the timeline before Dev finalizes the schedule.',
        time: '1h 55m ago', isMe: true,
        card: {
          kind: 'event',
          id: 'neural-drift',
          name: 'NEURAL DRIFT',
          venue: 'The Blind Pig',
          date: 'Sat Jun 21, 2025',
          status: 'draft',
          accentColor: '#c026d3',
          coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
          lineup: ['STATIC FORMA', 'NOVA VEGA', 'LUX'],
          href: '/show-builder/neural-drift',
        },
      },
      {
        id: 'nd-3',
        from: 'Dev Shin', fromImage: DEV_IMG,
        content: 'STATIC at 21:30 · NOVA at 22:45 · LUX from 00:15. Sending slots to the designer now.',
        time: '1h 30m ago', isMe: false,
      },
      {
        id: 'nd-4',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Sound check moved to 18:00. Venue needs earlier setup for the new PA config.',
        time: '45m ago', isMe: false,
      },
      {
        id: 'nd-5',
        from: 'You', fromImage: ME_IMG,
        content: 'Got it. I\'ll be there at 17:30 to sort levels before anyone else arrives.',
        time: '30m ago', isMe: true,
      },
      {
        id: 'nd-6',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Doors 9pm, not 9:30. Update the flyer.',
        time: '12m ago', isMe: false,
      },
    ],
  },

  // ── PROPOSAL: NEURAL DRIFT → The Blind Pig (under-review) ─────────────────
  {
    id: 'prop-neural-drift',
    type: 'proposal',
    name: 'NEURAL DRIFT — The Blind Pig',
    accentColor: '#c026d3',
    image: MARCUS_IMG,
    pinned: true,
    context: {
      kind: 'proposal',
      proposalId: 'prop-001',
      eventName: 'NEURAL DRIFT',
      venueName: 'The Blind Pig',
      proposedDate: 'Jun 21, 2025',
      status: 'under-review',
      accentColor: '#c026d3',
    },
    lastMessage: 'Marcus: Stay tuned — looks strong.',
    lastTime: '1h',
    unread: 1,
    messages: [
      {
        id: 'pnd-1',
        from: 'You', fromImage: ME_IMG,
        content: 'Marcus — here\'s the full proposal for NEURAL DRIFT at The Blind Pig. Dark electro night with three confirmed artists.',
        time: '3d ago', isMe: true,
        card: {
          kind: 'proposal',
          id: 'prop-001',
          name: 'NEURAL DRIFT',
          venue: 'The Blind Pig',
          proposedDate: 'Jun 21, 2025',
          status: 'under-review',
          accentColor: '#c026d3',
          lineupCount: 3,
          estimatedDraw: 240,
          totalBudget: 1000,
          href: '/venue/proposals/prop-001',
        },
      },
      {
        id: 'pnd-sys-1',
        from: '', fromImage: '',
        content: 'Proposal submitted to The Blind Pig — May 8, 2025',
        time: '3d ago', isMe: false, isSystem: true,
      },
      {
        id: 'pnd-2',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Got it — in the queue now. Should have feedback by end of week.',
        time: '2d ago', isMe: false,
      },
      {
        id: 'pnd-3',
        from: 'You', fromImage: ME_IMG,
        content: 'Perfect. Happy to jump on a call if it helps speed up the review.',
        time: '2d ago', isMe: true,
      },
      {
        id: 'pnd-4',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Quick question — is STATIC FORMA confirmed or still pending?',
        time: '1d ago', isMe: false,
      },
      {
        id: 'pnd-5',
        from: 'You', fromImage: ME_IMG,
        content: 'STATIC FORMA is locked in. I have their signed rider already.',
        time: '1d ago', isMe: true,
        reactions: [{ emoji: '✓', count: 1, mine: false }],
      },
      {
        id: 'pnd-sys-2',
        from: '', fromImage: '',
        content: 'Marcus Bell viewed the full proposal — May 10, 2025',
        time: '1h ago', isMe: false, isSystem: true,
      },
      {
        id: 'pnd-6',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Stay tuned — looks strong.',
        time: '1h ago', isMe: false,
      },
    ],
  },

  // ── PROPOSAL: SIGNAL COLLAPSE → Smart Bar (accepted) ──────────────────────
  {
    id: 'prop-signal-collapse',
    type: 'proposal',
    name: 'SIGNAL COLLAPSE — Smart Bar',
    accentColor: '#06b6d4',
    image: SOFIA_IMG,
    context: {
      kind: 'proposal',
      proposalId: 'prop-002',
      eventName: 'SIGNAL COLLAPSE',
      venueName: 'Smart Bar',
      proposedDate: 'Jul 12, 2025',
      status: 'accepted',
      accentColor: '#06b6d4',
    },
    lastMessage: 'Sofia: Can you share KIRA\'s tech rider?',
    lastTime: '4h',
    unread: 0,
    messages: [
      {
        id: 'psc-1',
        from: 'You', fromImage: ME_IMG,
        content: 'Sofia — sending the SIGNAL COLLAPSE proposal for Smart Bar. Ambient techno direction, KIRA SÓLARIS headlining.',
        time: '5d ago', isMe: true,
        card: {
          kind: 'proposal',
          id: 'prop-002',
          name: 'SIGNAL COLLAPSE',
          venue: 'Smart Bar',
          proposedDate: 'Jul 12, 2025',
          status: 'accepted',
          accentColor: '#06b6d4',
          lineupCount: 2,
          estimatedDraw: 190,
          totalBudget: 2300,
          href: '/venue/proposals/prop-002',
        },
      },
      {
        id: 'psc-sys-1',
        from: '', fromImage: '',
        content: 'Proposal submitted to Smart Bar — May 6, 2025',
        time: '5d ago', isMe: false, isSystem: true,
      },
      {
        id: 'psc-2',
        from: 'Sofia Ren', fromImage: SOFIA_IMG,
        content: 'SIGNAL COLLAPSE looks great — ambient techno is exactly what we\'re programming this summer.',
        time: '4d ago', isMe: false,
      },
      {
        id: 'psc-3',
        from: 'You', fromImage: ME_IMG,
        content: 'Excited about this one. KIRA\'s sets are next level.',
        time: '4d ago', isMe: true,
      },
      {
        id: 'psc-sys-2',
        from: '', fromImage: '',
        content: 'Proposal accepted by Smart Bar — May 10, 2025',
        time: '4h ago', isMe: false, isSystem: true,
      },
      {
        id: 'psc-4',
        from: 'Sofia Ren', fromImage: SOFIA_IMG,
        content: 'We\'re in. Confirming July 12. Can you share KIRA\'s tech rider when you have it?',
        time: '4h ago', isMe: false,
      },
    ],
  },

  // ── COLLAB: VOID CIRCUIT compilation invite ────────────────────────────────
  {
    id: 'collab-void-circuit',
    type: 'collab',
    name: 'VOID CIRCUIT',
    image: VOID_IMG,
    accentColor: '#f59e0b',
    context: {
      kind: 'collab',
      collabType: 'compilation',
      projectName: 'Dark Electro Compilation Vol.3',
      initiator: 'VOID CIRCUIT',
      status: 'pending',
      accentColor: '#f59e0b',
    },
    lastMessage: 'Revenue split is 70/30 after costs.',
    lastTime: '2h',
    unread: 2,
    messages: [
      {
        id: 'vc-1',
        from: 'VOID CIRCUIT', fromImage: VOID_IMG,
        content: 'Nova — we\'re compiling a dark electro volume and we want you on it. Your SPECTRA release fits exactly.',
        time: '1d ago', isMe: false,
      },
      {
        id: 'vc-2',
        from: 'You', fromImage: ME_IMG,
        content: 'This is exactly the kind of project I want to be part of. What\'s the brief?',
        time: '22h ago', isMe: true,
      },
      {
        id: 'vc-3',
        from: 'VOID CIRCUIT', fromImage: VOID_IMG,
        content: '8–12 minute original, unreleased. Industrial/EBM direction. Bandcamp + all streaming. Here\'s the project brief.',
        time: '20h ago', isMe: false,
      },
      {
        id: 'vc-4',
        from: 'You', fromImage: ME_IMG,
        content: 'I have something that fits perfectly. What\'s the deadline?',
        time: '18h ago', isMe: true,
      },
      {
        id: 'vc-5',
        from: 'VOID CIRCUIT', fromImage: VOID_IMG,
        content: 'June 30. Revenue split is 70/30 after costs.',
        time: '2h ago', isMe: false,
      },
    ],
  },

  // ── COLLAB: AALIYAH CROSS booking agent ───────────────────────────────────
  {
    id: 'collab-aaliyah',
    type: 'collab',
    name: 'Aaliyah Cross',
    image: AALIYAH_IMG,
    accentColor: '#a855f7',
    context: {
      kind: 'collab',
      collabType: 'b2b',
      projectName: 'US East Coast B2B Tour',
      initiator: 'Aaliyah Cross',
      status: 'pending',
      accentColor: '#a855f7',
    },
    lastMessage: 'I represent several industrial artists interested in a B2B.',
    lastTime: '6h',
    unread: 1,
    messages: [
      {
        id: 'ac-1',
        from: 'Aaliyah Cross', fromImage: AALIYAH_IMG,
        content: 'Hi Nova — I\'m a booking agent and I represent several industrial artists who are interested in doing a B2B tour with you this fall.',
        time: '6h ago', isMe: false,
      },
      {
        id: 'ac-sys-1',
        from: '', fromImage: '',
        content: 'Aaliyah Cross sent a collaboration request',
        time: '6h ago', isMe: false, isSystem: true,
      },
    ],
  },

  // ── DM: KIRA SÓLARIS ──────────────────────────────────────────────────────
  {
    id: 'kira-solaris',
    type: 'dm',
    name: 'KIRA SÓLARIS',
    image: KIRA_IMG,
    accentColor: '#10b981',
    lastMessage: 'I\'d be open to Chicago in August. What\'s the venue?',
    lastTime: '2h',
    unread: 1,
    messages: [
      {
        id: 'k-1',
        from: 'You', fromImage: ME_IMG,
        content: 'Hi Kira — I\'m Nova Vega, DJ/producer from Chicago. Huge fan of Meridian II.',
        time: '1d ago', isMe: true,
      },
      {
        id: 'k-2',
        from: 'KIRA SÓLARIS', fromImage: KIRA_IMG,
        content: 'Hey! Your SPECTRA release was excellent. What\'s on your mind?',
        time: '22h ago', isMe: false,
      },
      {
        id: 'k-3',
        from: 'You', fromImage: ME_IMG,
        content: 'We\'re building SIGNAL COLLAPSE at Smart Bar — summer ambient techno series. Serious budget. Would love you to headline.',
        time: '20h ago', isMe: true,
        card: {
          kind: 'artist',
          name: 'KIRA SÓLARIS',
          role: 'DJ / Ambient Techno',
          image: KIRA_IMG,
          accentColor: '#10b981',
          draw: 320,
          fee: '$1,200–$2,000',
          city: 'Berlin',
          href: '/profile/kira-solaris',
        },
      },
      {
        id: 'k-4',
        from: 'KIRA SÓLARIS', fromImage: KIRA_IMG,
        content: 'I\'d be open to Chicago in August. What\'s the venue?',
        time: '2h ago', isMe: false,
      },
    ],
  },

  // ── DM: Marcus Bell (venue booker) ────────────────────────────────────────
  {
    id: 'marcus-bell',
    type: 'dm',
    name: 'Marcus Bell',
    image: MARCUS_IMG,
    accentColor: '#c026d3',
    lastMessage: 'You: Confirmed — see you at load-in.',
    lastTime: '1d',
    unread: 0,
    messages: [
      {
        id: 'mb-1',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Nova — contracts are signed. NEURAL DRIFT is officially booked. Sending the full tech rider request this week.',
        time: '2d ago', isMe: false,
        reactions: [{ emoji: '🔥', count: 2, mine: true }],
      },
      {
        id: 'mb-2',
        from: 'You', fromImage: ME_IMG,
        content: 'Let\'s go. I\'ll have my rider back within 48hrs.',
        time: '2d ago', isMe: true,
      },
      {
        id: 'mb-3',
        from: 'Marcus Bell', fromImage: MARCUS_IMG,
        content: 'Load-in 18:00 · Soundcheck 18:30 · You\'re on 22:45.',
        time: '1d ago', isMe: false,
      },
      {
        id: 'mb-4',
        from: 'You', fromImage: ME_IMG,
        content: 'Confirmed — see you at load-in.',
        time: '1d ago', isMe: true,
      },
    ],
  },

  // ── GROUP: SIGNAL BLOC collective ─────────────────────────────────────────
  {
    id: 'signal-bloc',
    type: 'group',
    name: 'SIGNAL BLOC',
    accentColor: '#a855f7',
    members: [
      { name: 'LUX',         image: LUX_IMG,    online: true },
      { name: 'STATIC FORMA',image: STATIC_IMG, online: false },
      { name: 'You',         image: ME_IMG,     online: true },
    ],
    lastMessage: 'LUX: Vote on Jul 26 — need 3/4 to confirm.',
    lastTime: '4h',
    unread: 0,
    messages: [
      {
        id: 'sb-1',
        from: 'LUX', fromImage: LUX_IMG,
        content: 'Smart Bar offered us the full night on Jul 26. Take it or hold for August?',
        time: '6h ago', isMe: false,
      },
      {
        id: 'sb-2',
        from: 'STATIC FORMA', fromImage: STATIC_IMG,
        content: 'Jul 26 works for me. Take it.',
        time: '5h 30m ago', isMe: false,
      },
      {
        id: 'sb-3',
        from: 'You', fromImage: ME_IMG,
        content: 'Same — July gives more promo runway than August would.',
        time: '5h ago', isMe: true,
      },
      {
        id: 'sb-4',
        from: 'LUX', fromImage: LUX_IMG,
        content: 'Vote on Jul 26 — need 3/4 to confirm.',
        time: '4h ago', isMe: false,
      },
    ],
  },

  // ── DM: Dev Shin (sound engineer) ─────────────────────────────────────────
  {
    id: 'dev-shin',
    type: 'dm',
    name: 'Dev Shin',
    image: DEV_IMG,
    accentColor: '#06b6d4',
    lastMessage: 'You: Updated rider sent. Thanks for flagging the sub issue.',
    lastTime: '3h',
    unread: 0,
    messages: [
      {
        id: 'ds-1',
        from: 'Dev Shin', fromImage: DEV_IMG,
        content: 'Got the updated tech rider. Everything looks good — one note: the sub frequencies you\'re requesting may conflict with the Blind Pig\'s new PA setup.',
        time: '5h ago', isMe: false,
      },
      {
        id: 'ds-2',
        from: 'You', fromImage: ME_IMG,
        content: 'Good catch. I\'ll adjust the low-end request. What\'s their current sub config?',
        time: '4h ago', isMe: true,
      },
      {
        id: 'ds-3',
        from: 'Dev Shin', fromImage: DEV_IMG,
        content: 'Single 18" sub per side. You\'ll want to cap at 60hz for the mix to translate properly.',
        time: '3h 30m ago', isMe: false,
      },
      {
        id: 'ds-4',
        from: 'You', fromImage: ME_IMG,
        content: 'Updated rider sent. Thanks for flagging the sub issue.',
        time: '3h ago', isMe: true,
      },
    ],
  },

];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const CONVERSATION_BY_ID = new Map(
  RICH_CONVERSATIONS.map((c) => [c.id, c])
);

export const totalUnread = (convos: RichConversation[]) =>
  convos.reduce((s, c) => s + c.unread, 0);

export const typeLabel: Record<ConvoType, string> = {
  dm:       'DM',
  group:    'Group',
  proposal: 'Proposal',
  collab:   'Collab',
};

export const typeColor: Record<ConvoType, string> = {
  dm:       '#06b6d4',
  group:    '#a855f7',
  proposal: '#f59e0b',
  collab:   '#10b981',
};

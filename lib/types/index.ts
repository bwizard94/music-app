/**
 * Stagefront — Canonical Type Definitions
 *
 * These types are the single source of truth for all data shapes
 * across the platform. All components and data files should
 * reference these types rather than defining their own.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export type ID = string;
export type HexColor = string;
export type ISODate = string; // ISO 8601 string

// ─── Role / Status Unions ─────────────────────────────────────────────────────

export type UserRole =
  | 'solo_artist' | 'band' | 'dj' | 'producer' | 'venue'
  | 'promoter' | 'photographer' | 'videographer' | 'visual_artist'
  | 'lighting_designer' | 'sound_engineer' | 'booking_agent';

export type EventStatus = 'draft' | 'pitching' | 'confirmed' | 'cancelled' | 'completed';

export type BookingStatus = 'pending' | 'invited' | 'negotiating' | 'confirmed' | 'declined';

export type LineupRole =
  | 'headliner' | 'support' | 'opener' | 'b2b' | 'live-act' | 'visual-artist';

export type ReleaseType = 'mix' | 'ep' | 'album' | 'single' | 'live-recording';

export type MediaAssetType = 'photo' | 'video' | 'audio';

export type BoardPostType =
  | 'open-slot' | 'musician-wanted' | 'collab-request'
  | 'collective-forming' | 'gear-share' | 'venue-call';

export type FeedPostType =
  | 'open-slot' | 'musician-wanted' | 'event' | 'discussion'
  | 'release' | 'collab-request' | 'collective-forming' | 'workshop' | 'venue-call';

export type ConversationType = 'dm' | 'group';

// ─── Shared Structures ────────────────────────────────────────────────────────

/**
 * Normalised location — used by venues, scenes, and wherever a city
 * needs richer metadata. Artists keep flat `city`/`country` strings
 * for backward-compat with the many components that read them directly.
 */
export interface Location {
  city: string;
  state?: string;
  country: string;
  /** Human-readable form, e.g. "Chicago, IL" or "Berlin, DE" */
  displayName: string;
}

/** Social platform links — all optional */
export interface SocialLinks {
  soundcloud?: string;
  mixcloud?: string;
  spotify?: string;
  bandcamp?: string;
  beatport?: string;
  residentAdvisor?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: ID;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  verified: boolean;
  proMember: boolean;
  createdAt: ISODate;
  /** Flat city string kept for compat with profile components */
  city: string;
  country: string;
  bio: string;
  socialLinks: Partial<SocialLinks>;
  followers: number;
  following: number;
  /** ID of the Artist / Venue / Promoter profile tied to this account */
  profileId?: ID;
}

// ─── Artist ───────────────────────────────────────────────────────────────────

export interface ArtistStats {
  monthlyListeners: number;
  totalPlays: number;
  upcomingShows: number;
  eventsLastYear: number;
  avgRating: number;
  reviewCount: number;
}

/**
 * Core artist record — shared between show-builder, scene hubs,
 * discovery, and profile pages.
 *
 * `city` / `country` are flat strings (not a Location object) so that
 * the many components that render `artist.city` directly need zero changes.
 * `fee` is a display string (e.g. "$400–$600") matching the existing pattern.
 */
export interface Artist {
  id: ID;
  name: string;
  slug: string;
  role: string; // display string, e.g. "DJ / Dark Electro"
  genres: string[];
  city: string;
  country: string;
  bio: string;
  draw: number;          // estimated attendance pull
  followers: number;
  accentColor: HexColor;
  image: string;
  coverImage?: string;
  verified: boolean;
  proMember?: boolean;
  fee: string;           // display range, e.g. "$400–$600"
  feeMin: number;        // parsed minimum for calculations
  feeMax: number;        // parsed maximum for calculations
  socialScore: number;   // 0–100 social reach index
  tags: string[];
  recentShows: number;
  audienceAge: string;   // e.g. "23–32"
  stats: ArtistStats;
  socialLinks: Partial<SocialLinks>;
}

export interface Track {
  id: ID;
  title: string;
  duration: string;
  plays: number;
  waveform: number[]; // 80 values, 0–100
  accentColor: HexColor;
}

export interface DJSet {
  id: ID;
  title: string;
  venue?: string;
  date: string;
  duration: string;
  plays: number;
  coverImage?: string;
}

/**
 * Extended artist profile — the Artist entity plus page-specific rich data.
 * Used exclusively by the artist profile page components.
 */
export interface ArtistProfile extends Artist {
  tracks: Track[];
  sets: DJSet[];
  photos: MediaAsset[];
  videos: VideoAsset[];
  upcomingShows: Show[];
  pastShows: PastShow[];
  reviews: Review[];
  collaborationBadges: CollaborationBadge[];
  analytics: ArtistAnalytics;
}

// ─── Venue ────────────────────────────────────────────────────────────────────

export interface VenueCard {
  id: ID;
  name: string;
  slug: string;
  city: string;
  state?: string;
  country: string;
  accentColor: HexColor;
  coverImage: string;
  capacity: number;
  genres: string[];
  verified: boolean;
  tagline: string;
}

export interface SoundSystem {
  mainSystem: string;
  mixers: string[];
  cdPlayers?: string[];
  monitors?: string;
}

export interface LightingSystem {
  controller: string;
  fixtures: string[];
  additionalEffects?: string[];
}

export interface Room {
  name: string;
  capacity: number;
  dimensions?: string;
  features?: string[];
}

export interface VenueSpecs {
  capacity: number;
  sound: SoundSystem;
  lighting: LightingSystem;
  rooms: Room[];
  productionAmenities: string[];
}

export interface BookingPreferences {
  formats: string[];
  minFee: string;
  preferredGenres: string[];
  notes?: string;
}

export interface VenueStats {
  rating: string;
  reviewCount: number;
  eventsPerMonth: number;
  yearsActive: number;
  capacity: number;
  followersCount: number;
  monthlyImpressions: string;
}

export interface VenueAnalyticsData {
  avgOccupancy: string;
  avgTicketPrice: string;
  repeatVisitors: string;
  topDemographic: string;
  peakNights: string;
  monthlyImpressions: string;
}

export interface VenueContact {
  bookingEmail?: string;
  phone?: string;
  website?: string;
  instagram?: string;
}

export interface OpenSlot {
  id: ID;
  date: string;
  type: string;
  available: string[];
}

// ─── Event ────────────────────────────────────────────────────────────────────

export interface LineupSlot {
  id: ID;
  artist: Artist;
  role: LineupRole;
  startTime: string;   // "23:00"
  duration: number;    // minutes
  fee: string;         // negotiated slot fee (may differ from artist base fee)
  status: BookingStatus;
  note?: string;
}

export interface Collaborator {
  id: ID;
  name: string;
  role: string;
  image: string;
  viewing: boolean;
  approved: boolean;
}

export interface EventBuild {
  id: ID;
  name: string;
  tagline: string;
  date: string;          // display date, e.g. "Sat Jun 21, 2025"
  venue: string;
  venueCity: string;
  venueCapacity: number;
  accentColor: HexColor;
  coverImage: string;
  lineup: LineupSlot[];
  collaborators: Collaborator[];
  status: EventStatus;
  genres: string[];
  doorsTime: string;
  endTime: string;
  ticketPrice: string;
  estimatedRevenue: string;
}

export interface Show {
  id: ID;
  name: string;
  venue: string;
  city: string;
  date: string;
  genre: string;
  ticketUrl?: string;
  status: 'confirmed' | 'announced' | 'sold-out';
}

export interface PastShow {
  id: ID;
  name: string;
  venue: string;
  city: string;
  date: string;
  attendance?: number;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface BookingProposal {
  id: ID;
  artistId: ID;
  venueId: ID;
  eventId?: ID;
  proposedDate: ISODate;
  format: string;
  artistName: string;
  artistRole: string;
  genre: string;
  soundcloudUrl?: string;
  proposedFee: string;
  message: string;
  techRider: boolean;
  status: BookingStatus;
  createdAt: ISODate;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaAsset {
  id: ID;
  url: string;
  caption?: string;
  credit?: string;
  featured?: boolean;
}

export interface VideoAsset {
  id: ID;
  title: string;
  thumbnail: string;
  url?: string;
  platform: 'YouTube' | 'Vimeo' | 'Instagram' | 'SoundCloud' | 'Mixcloud';
  duration: string;
  views: string;
  featured?: boolean;
}

export interface Release {
  id: ID;
  title: string;
  artist: string;
  artistImage: string;
  type: ReleaseType;
  genre: string;
  date: string;
  image: string;
  accentColor: HexColor;
  duration?: string;
  label?: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: ID;
  reviewer: string;
  reviewerType: string;
  reviewerImage: string;
  rating: number;  // 1–5
  date: string;
  text: string;
  type: string;    // "Residency", "Headliner", "Event Photography", etc.
  verified: boolean;
  targetId?: ID;   // artist or venue being reviewed
}

// ─── Collaboration Badge ──────────────────────────────────────────────────────

export interface CollaborationBadge {
  id: ID;
  label: string;
  icon: string;
  color: HexColor;
  count: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface ArtistAnalytics {
  monthlyListeners: number;
  profileViews: string;
  bookingInquiries: number;
  avgRating: number;
  topCities: string[];
  audienceAge: string;
  peakDay: string;
  monthlyImpressions: string;
}

// ─── Scene / Community ────────────────────────────────────────────────────────

export interface SceneStats {
  artists: number;
  venues: number;
  eventsMonth: number;
  collectives: number;
}

export interface Scene {
  id: ID;
  name: string;
  slug: string;
  country: string;
  accentColor: HexColor;
  coverImage: string;
  tagline: string;
  description: string;
  stats: SceneStats;
  topGenres: string[];
  topVenues: string[];
  trending: string;
}

export interface CollectiveMember {
  name: string;
  role: string;
  image: string;
}

export interface Collective {
  id: ID;
  name: string;
  slug: string;
  city: string;
  genres: string[];
  accentColor: HexColor;
  image: string;
  coverImage: string;
  bio: string;
  memberCount: number;
  eventsHosted: number;
  founded: string;
  openSpots?: string;
  members: CollectiveMember[];
}

// ─── Social Feed ──────────────────────────────────────────────────────────────

export interface FeedPost {
  id: ID;
  type: FeedPostType;
  author: string;
  authorRole: string;
  authorImage: string;
  city: string;
  time: string;
  content: string;
  tags: string[];
  accentColor: HexColor;
  stat: string;
  statLabel: string;
  cta: string;
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

export interface BoardPost {
  id: ID;
  type: BoardPostType;
  author: string;
  authorRole: string;
  authorImage: string;
  city: string;
  time: string;
  title: string;
  body: string;
  tags: string[];
  accentColor: HexColor;
  responses: number;
  interested: number;
  compensation?: string;
  seeking?: string;
  deadline?: string;
  urgent?: boolean;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export interface Message {
  id: ID;
  from: string;
  fromImage: string;
  content: string;
  time: string;
  isMe: boolean;
}

export interface ConversationMember {
  name: string;
  image: string;
  online: boolean;
}

export interface Conversation {
  id: ID;
  type: ConversationType;
  name: string;
  image?: string;
  members?: ConversationMember[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  accentColor: HexColor;
  messages: Message[];
}

// ─── Discover ─────────────────────────────────────────────────────────────────

export interface DiscoverArtist {
  id: ID;
  name: string;
  city: string;
  role: string;
  image: string;
  accentColor: HexColor;
  genre: string;
  momentum: number; // % growth
  followers: number;
  recentDraw: number;
  tag: string;
}

// ─── Notable Booking (venue history) ─────────────────────────────────────────

export interface NotableBooking {
  name: string;
  origin: string;
  year: string;
}

// ─── Venue Resident ───────────────────────────────────────────────────────────

export interface VenueResident {
  name: string;
  slug: string;
  role: string;
  since: string;
  image: string;
}

// ─── Past Event (venue history item) ─────────────────────────────────────────

export interface PastEvent {
  month: string;
  events: Array<{
    name: string;
    headliner: string;
    attendance: number;
    capacity: number;
    revenue: string;
  }>;
}

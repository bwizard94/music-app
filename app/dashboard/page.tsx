'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Zap, TrendingUp, Eye, Users, CalendarDays, Star,
  MapPin, ArrowRight, Music2, Headphones, ChevronRight,
  Flame, Clock, MessageSquare, Sparkles, Plus, Check,
  X, Send, Building2, BookOpen, BarChart3, UserCheck,
  Mic2, AlertCircle, ExternalLink, Radio, Bell,
} from 'lucide-react';

// ─── Static Data ───────────────────────────────────────────────────────────────

const QUICK_STATS = [
  { label: 'Profile Views',       value: '1,240', change: '+18% this week', icon: Eye,          color: '#a855f7' },
  { label: 'Connections',         value: '87',    change: '+5 this week',   icon: Users,        color: '#06b6d4' },
  { label: 'Open Opportunities',  value: '23',    change: '12 match you',   icon: Flame,        color: '#f43f5e' },
  { label: 'Upcoming Shows',      value: '4',     change: 'Next: May 23',   icon: CalendarDays, color: '#f59e0b' },
];

const STATIC_QUICK_ACTIONS = [
  { label: 'Create Show Proposal', icon: Zap,        href: '/show-builder',  color: '#a855f7' },
  { label: 'Find Collaborators',   icon: Users,       href: '/discover',      color: '#06b6d4' },
  { label: 'Browse Venues',        icon: Building2,   href: '/discover',      color: '#f43f5e' },
  { label: 'Post Opportunity',     icon: Mic2,        href: '/board',         color: '#f59e0b' },
];

const BOOKING_REQUESTS = [
  {
    id: 'br1',
    from: 'The Blind Pig',
    fromImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80',
    type: 'DJ Booking',
    date: 'Fri, May 30',
    pay: '$200–$350',
    genre: 'Techno / Industrial',
    message: 'Love your latest set. We have a 90-min opening slot for you on our monthly techno night.',
    received: '2h ago',
    urgent: true,
    color: '#a855f7',
  },
  {
    id: 'br2',
    from: 'Smart Bar',
    fromImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=80&q=80',
    type: 'Residency Offer',
    date: 'Every Thursday',
    pay: '$400/night',
    genre: 'House / Techno',
    message: 'Interested in a monthly Thursday residency starting June. 4-hour slot, full production.',
    received: '1d ago',
    urgent: false,
    color: '#06b6d4',
  },
  {
    id: 'br3',
    from: 'Midwest Bass Fest',
    fromImage: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=80&q=80',
    type: 'Festival Slot',
    date: 'Jul 12–14',
    pay: '$800 + travel',
    genre: 'All Electronic',
    message: 'We would love to have you on the NORTH stage this July. Full tech rider covered.',
    received: '2d ago',
    urgent: false,
    color: '#f59e0b',
  },
];

const COLLAB_INVITES = [
  {
    id: 'ci1',
    from: 'LUX',
    fromImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80',
    role: 'DJ / Dark Techno',
    project: 'NEURAL DRIFT',
    projectType: 'Show Build',
    message: 'Added you as a collaborator on the NEURAL DRIFT event at The Blind Pig. Review the lineup.',
    received: '30m ago',
    color: '#c026d3',
  },
  {
    id: 'ci2',
    from: 'SIGNAL BLOC',
    fromImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80',
    role: 'Collective',
    project: 'Summer Compilation Vol.3',
    projectType: 'Music Release',
    message: 'We are putting together a dark electro compilation and want to include your track "VOID 001".',
    received: '4h ago',
    color: '#a855f7',
  },
];

const MESSAGES_PREVIEW = [
  {
    id: 'mp1',
    from: 'LUNA CROSS',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
    preview: 'Hey! Are you still available for the June 14 date at Subterranean?',
    time: '42m ago',
    unread: 2,
    online: true,
    color: '#06b6d4',
  },
  {
    id: 'mp2',
    from: 'Neural Drift Crew',
    image: null,
    preview: 'Marcus Bell: Lineup is locked. Advancing confirmed venues tomorrow.',
    time: '1h ago',
    unread: 4,
    online: false,
    color: '#c026d3',
    isGroup: true,
  },
  {
    id: 'mp3',
    from: 'Dev Shin (Sound Eng.)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    preview: 'Got the updated tech rider. Everything looks good on our end.',
    time: '3h ago',
    unread: 0,
    online: true,
    color: '#10b981',
  },
];

const RECOMMENDED = [
  {
    id: 'rec1',
    name: 'KIRA SÓLARIS',
    type: 'artist',
    role: 'DJ / Ambient Techno',
    city: 'Berlin',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    reason: 'Genre match · Ambient Techno',
    color: '#10b981',
    stat: '28.6k followers',
    href: '/profile/kira-solaris',
  },
  {
    id: 'rec2',
    name: 'Subterranean',
    type: 'venue',
    role: 'Venue · Chicago, IL',
    city: 'Chicago',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80',
    reason: 'Booked artists like you · 300 cap',
    color: '#f43f5e',
    stat: '300 cap',
    href: '/venue/blind-pig',
  },
  {
    id: 'rec3',
    name: 'VOID CIRCUIT',
    type: 'collective',
    role: 'Collective · Detroit',
    city: 'Detroit',
    image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=200&q=80',
    reason: 'Industrial / Noise · 12 members',
    color: '#f59e0b',
    stat: '12 members',
    href: '/scene/detroit',
  },
];

const UPCOMING_SHOWS = [
  { title: 'Subterranean Sessions Vol. 12', venue: 'The Blind Pig · Chicago', date: 'May', day: '23', time: '10 PM', role: 'Performing',       color: '#a855f7' },
  { title: 'Dark Frequencies',              venue: 'Smart Bar · Chicago',     date: 'May', day: '31', time: '11 PM', role: 'Performing',       color: '#06b6d4' },
  { title: 'Midwest Bass Fest',             venue: 'Lakefront · Milwaukee',   date: 'Jul', day: '12', time: 'TBD',   role: 'Pending Confirm',  color: '#f59e0b' },
];

const ACTIVITY = [
  { icon: Eye,          text: 'The Blind Pig viewed your profile',           time: '10m', color: '#a855f7' },
  { icon: MessageSquare,text: 'New message from LUNA CROSS',                 time: '42m', color: '#06b6d4' },
  { icon: Star,         text: '5-star review from Soundbar',                 time: '2h',  color: '#f59e0b' },
  { icon: Users,        text: 'RAVI STORM connected with you',               time: '5h',  color: '#f43f5e' },
  { icon: CalendarDays, text: 'Booking confirmed: Dark Frequencies, May 31', time: '1d',  color: '#10b981' },
  { icon: Radio,        text: 'Your track "VOID 001" was reposted × 14',     time: '2d',  color: '#ec4899' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

// ─── Mock fallback data ────────────────────────────────────────────────────────
const CURRENT_USER = {
  displayName: 'NOVA VEGA',
  avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&q=80',
  city: 'Chicago, IL',
  role: 'DJ / Producer',
};

export default function DashboardPage() {
  const { toast } = useToast();
  const { profile, profileSlug, loading } = useAuth();
  const [bookingStates, setBookingStates] = useState<Record<string, 'pending' | 'accepted' | 'declined'>>({
    br1: 'pending', br2: 'pending', br3: 'pending',
  });
  const [collabStates, setCollabStates] = useState<Record<string, 'pending' | 'accepted' | 'declined'>>({
    ci1: 'pending', ci2: 'pending',
  });

  const myProfileHref = profileSlug ? `/profile/${profileSlug}` : '/profile/settings';

  const quickActions = [
    ...STATIC_QUICK_ACTIONS,
    { label: 'Update Profile', icon: UserCheck, href: myProfileHref, color: '#10b981' },
    { label: 'View Analytics', icon: BarChart3,  href: myProfileHref, color: '#ec4899' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-screen-2xl mx-auto">

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/[0.06]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0c0c1a] to-[#060608]" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 100% at 100% 50%, rgba(168,85,247,0.12), transparent)',
        }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 px-6 py-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/30">
              <img
                src={profile?.avatar_url ?? CURRENT_USER.avatar}
                alt={profile?.display_name ?? CURRENT_USER.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0c0c1a]" />
          </div>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-xs font-medium mb-0.5 uppercase tracking-widest">Welcome back</p>
            <h1 className="text-white font-black text-2xl tracking-tight leading-none mb-1.5">
              {profile?.display_name ?? CURRENT_USER.displayName}
            </h1>
            <p className="text-slate-400 text-sm">
              <span className="text-amber-400 font-semibold">3 booking requests</span> waiting ·{' '}
              <span className="text-cyan-400 font-semibold">7 unread messages</span> ·{' '}
              <span className="text-rose-400 font-semibold">23 opportunities</span> match your profile
            </p>
          </div>

          {/* Inline mini-stats */}
          <div className="hidden xl:flex items-center gap-6 flex-shrink-0">
            {[
              { label: 'Shows', value: '4', color: '#f59e0b' },
              { label: 'Followers', value: '12.4k', color: '#a855f7' },
              { label: 'Avg Rating', value: '4.8★', color: '#10b981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className="text-lg font-black leading-none" style={{ color }}>{value}</div>
                <div className="text-slate-600 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={myProfileHref}
            className="relative flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl overflow-hidden group flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
            <span className="relative">View Profile</span>
            <ExternalLink className="relative w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {QUICK_STATS.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-colors card-hover card-interactive">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-green-400 mt-1" />
            </div>
            <div className="text-white font-black text-2xl tracking-tight mb-0.5">{value}</div>
            <div className="text-slate-500 text-xs mb-1">{label}</div>
            <div className="text-xs font-semibold" style={{ color: `${color}cc` }}>{change}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <div className="glass rounded-2xl border border-white/[0.06] px-5 py-4 mb-6">
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          {quickActions.map(({ label, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 text-center"
              style={{ background: `${color}06` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-slate-400 text-xs font-semibold leading-tight group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left Column (2/3) ──────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Booking Requests */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h2 className="text-white font-bold text-sm">Pending Booking Requests</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  {Object.values(bookingStates).filter((s) => s === 'pending').length} pending
                </span>
              </div>
              <Link href="/board" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                All requests <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {BOOKING_REQUESTS.map((req) => {
                const state = bookingStates[req.id];
                return (
                  <div key={req.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-4">
                      <img src={req.fromImage} alt={req.from}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-bold text-sm">{req.from}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${req.color}18`, color: req.color, border: `1px solid ${req.color}30` }}>
                            {req.type}
                          </span>
                          {req.urgent && (
                            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />Urgent
                            </span>
                          )}
                          <span className="text-slate-700 text-[10px] ml-auto flex-shrink-0">{req.received}</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">{req.message}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{req.date}</span>
                          <span className="font-semibold" style={{ color: req.color }}>{req.pay}</span>
                          <span className="text-slate-600">{req.genre}</span>
                        </div>

                        {state === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setBookingStates((p) => ({ ...p, [req.id]: 'accepted' }));
                                toast({ type: 'success', title: 'Booking accepted', message: `You accepted the booking request from ${req.from}` });
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors btn-press"
                            >
                              <Check className="w-3 h-3" />Accept
                            </button>
                            <button
                              onClick={() => {
                                setBookingStates((p) => ({ ...p, [req.id]: 'declined' }));
                                toast({ type: 'info', title: 'Booking declined', message: `You declined the request from ${req.from}` });
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:bg-white/[0.08] transition-colors btn-press"
                            >
                              <X className="w-3 h-3" />Decline
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08] transition-colors ml-auto btn-press">
                              <MessageSquare className="w-3 h-3" />Message
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                              state === 'accepted'
                                ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                                : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'
                            }`}>
                              {state === 'accepted' ? <><Check className="w-3 h-3" />Accepted</> : <><X className="w-3 h-3" />Declined</>}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collaboration Invites */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h2 className="text-white font-bold text-sm">Collaboration Invites</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                  {Object.values(collabStates).filter((s) => s === 'pending').length} new
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {COLLAB_INVITES.map((inv) => {
                const state = collabStates[inv.id];
                return (
                  <div key={inv.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img src={inv.fromImage} alt={inv.from}
                          className="w-10 h-10 rounded-xl object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-bold text-sm">{inv.from}</span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-slate-500 text-xs">{inv.role}</span>
                          <span className="text-slate-700 text-[10px] ml-auto">{inv.received}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${inv.color}18`, color: inv.color, border: `1px solid ${inv.color}30` }}>
                            {inv.projectType}
                          </span>
                          <span className="text-white font-semibold text-xs">{inv.project}</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-3">{inv.message}</p>

                        {state === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCollabStates((p) => ({ ...p, [inv.id]: 'accepted' }));
                                toast({ type: 'success', title: 'Joined project', message: `You joined ${inv.project} by ${inv.from}` });
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors btn-press"
                              style={{ backgroundColor: `${inv.color}18`, color: inv.color, border: `1px solid ${inv.color}30` }}
                            >
                              <Check className="w-3 h-3" />Join Project
                            </button>
                            <button
                              onClick={() => {
                                setCollabStates((p) => ({ ...p, [inv.id]: 'declined' }));
                                toast({ type: 'info', title: 'Invite declined', message: `You declined ${inv.from}'s collaboration invite` });
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:bg-white/[0.08] transition-colors btn-press"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
                            state === 'accepted'
                              ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                              : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'
                          }`}>
                            {state === 'accepted' ? <><Check className="w-3 h-3" />Joined</> : 'Declined'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Shows */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-bold text-sm">Upcoming Shows</h2>
              </div>
              <Link href="/show-builder" className="flex items-center gap-1.5 text-xs font-bold relative overflow-hidden group px-3 py-1.5 rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80 group-hover:from-pink-600/80 group-hover:to-purple-600/80 transition-all duration-500 rounded-lg" />
                <Plus className="relative w-3 h-3 text-white" />
                <span className="relative text-white">Add Show</span>
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {UPCOMING_SHOWS.map((show, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.025] transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: `${show.color}15`, border: `1px solid ${show.color}20` }}>
                    <div className="text-[9px] font-bold uppercase leading-none" style={{ color: show.color }}>{show.date}</div>
                    <div className="text-white font-black text-lg leading-none mt-0.5">{show.day}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{show.title}</div>
                    <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{show.venue} · {show.time}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: show.role === 'Pending Confirm' ? 'rgba(245,158,11,0.1)' : `${show.color}12`,
                      color: show.role === 'Pending Confirm' ? '#f59e0b' : show.color,
                    }}>
                    {show.role}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Messages Preview */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h2 className="text-white font-bold text-sm">Messages</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">7 unread</span>
              </div>
              <Link href="/messages" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                Open inbox <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {MESSAGES_PREVIEW.map((msg) => (
                <Link key={msg.id} href="/messages"
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.025] transition-colors group">
                  <div className="relative flex-shrink-0">
                    {msg.isGroup ? (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${msg.color}20`, border: `1px solid ${msg.color}30` }}>
                        <Users className="w-5 h-5" style={{ color: msg.color }} />
                      </div>
                    ) : (
                      <>
                        <img src={msg.image!} alt={msg.from}
                          className="w-10 h-10 rounded-xl object-cover" />
                        {msg.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060608]" />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white font-semibold text-sm truncate">{msg.from}</span>
                      <span className="text-slate-700 text-[10px] flex-shrink-0">{msg.time}</span>
                    </div>
                    <span className="text-slate-500 text-xs truncate block">{msg.preview}</span>
                  </div>
                  {msg.unread > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: msg.color }}>
                      {msg.unread}
                    </div>
                  )}
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.04]">
              <Link href="/messages"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-slate-500 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200">
                <Send className="w-3.5 h-3.5" />Open Full Inbox
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right Column (1/3) ─────────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-6">

          {/* Profile Completion */}
          <div className="glass rounded-2xl border border-amber-500/15 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-bold text-sm">Profile Completion</h2>
              <span className="text-amber-400 font-black text-sm ml-auto">60%</span>
            </div>
            <div className="px-5 py-4">
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                <div className="h-full w-[60%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Add a bio', done: true },
                  { label: 'Upload cover photo', done: true },
                  { label: 'Add SoundCloud link', done: true },
                  { label: 'Upload press photo', done: false },
                  { label: 'Add tech rider', done: false },
                  { label: 'Connect Spotify', done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/[0.04] border border-white/[0.08]'
                    }`}>
                      {done
                        ? <Check className="w-3 h-3 text-green-400" />
                        : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      }
                    </div>
                    <span className={`text-xs ${done ? 'text-slate-600 line-through' : 'text-slate-400'}`}>{label}</span>
                  </div>
                ))}
              </div>
              <Link href={myProfileHref}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-amber-400 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/05 transition-all duration-200">
                Complete Profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Chicago Scene Pulse */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <h2 className="text-white font-bold text-sm">Chicago Scene</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[10px] font-semibold">Live</span>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Events',    value: '34', color: '#a855f7' },
                  { label: 'Open Calls', value: '12', color: '#f43f5e' },
                  { label: 'New Artists', value: '8',  color: '#06b6d4' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center p-3 rounded-xl"
                    style={{ backgroundColor: `${color}10`, border: `1px solid ${color}18` }}>
                    <div className="text-white font-black text-xl leading-none">{value}</div>
                    <div className="text-slate-600 text-[10px] mt-1 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 mb-4">
                {[
                  { label: 'Industrial / Techno', pct: 78, color: '#a855f7' },
                  { label: 'Dark House',           pct: 54, color: '#06b6d4' },
                  { label: 'Experimental',         pct: 31, color: '#f43f5e' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/scene/chicago"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs text-slate-500 hover:text-white border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200">
                Explore Chicago Scene <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recommended Artists / Venues */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-rose-400" />
                <h2 className="text-white font-bold text-sm">Recommended</h2>
              </div>
              <Link href="/discover" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                More <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {RECOMMENDED.map((rec) => (
                <Link key={rec.id} href={rec.href}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.025] transition-colors group">
                  <div className="relative flex-shrink-0">
                    <img src={rec.image} alt={rec.name}
                      className="w-10 h-10 rounded-xl object-cover" />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: `inset 0 0 0 1.5px ${rec.color}` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-xs truncate">{rec.name}</div>
                    <div className="text-slate-600 text-[10px]">{rec.role}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: `${rec.color}cc` }}>{rec.reason}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-slate-500 text-[10px]">{rec.stat}</div>
                    <button className="text-[10px] font-bold px-2 py-1 rounded-lg mt-1 transition-colors"
                      style={{ backgroundColor: `${rec.color}15`, color: rec.color, border: `1px solid ${rec.color}25` }}>
                      + Follow
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <Bell className="w-4 h-4 text-purple-400" />
              <h2 className="text-white font-bold text-sm">Recent Activity</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {ACTIVITY.map(({ icon: Icon, text, time, color }, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}18`, border: `1px solid ${color}25` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="flex-1 text-slate-400 text-xs leading-relaxed">{text}</span>
                  <span className="text-slate-700 text-[10px] flex-shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

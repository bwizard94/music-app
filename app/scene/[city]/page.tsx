'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, LayoutDashboard, Users, CalendarDays, MapPin, TrendingUp,
  Zap, MessageSquare, Plus, Check, ExternalLink, Clock, Radio,
} from 'lucide-react';
import { SCENES, FEED_POSTS, COLLECTIVES, type FeedPost } from '@/components/scene/sceneData';

const FEED_TYPE_CONFIG = {
  'open-slot':          { label: 'Open Slot',        color: '#c026d3', bg: '#c026d320' },
  'musician-wanted':    { label: 'Musician Wanted',   color: '#f59e0b', bg: '#f59e0b20' },
  'event':              { label: 'Event',             color: '#10b981', bg: '#10b98120' },
  'discussion':         { label: 'Discussion',        color: '#06b6d4', bg: '#06b6d420' },
  'release':            { label: 'New Release',       color: '#a855f7', bg: '#a855f720' },
  'collab-request':     { label: 'Collab Request',    color: '#f43f5e', bg: '#f43f5e20' },
  'collective-forming': { label: 'Collective Forming',color: '#f59e0b', bg: '#f59e0b20' },
  'workshop':           { label: 'Workshop',          color: '#ec4899', bg: '#ec4899820' },
  'venue-call':         { label: 'Venue Call',        color: '#10b981', bg: '#10b98120' },
};

const TABS = ['Feed', 'Events', 'Artists', 'Collectives', 'Board'] as const;
type TabId = typeof TABS[number];

const FILTER_TYPES = ['All', 'Open Slots', 'Musician Wanted', 'Events', 'Collectives', 'Releases', 'Discussions'] as const;

export default function SceneCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const scene = SCENES.find((s) => s.slug === city) ?? SCENES[0];
  const color = scene.accentColor;

  const [activeTab, setActiveTab] = useState<TabId>('Feed');
  const [joined, setJoined] = useState(false);
  const [feedFilter, setFeedFilter] = useState('All');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const cityPosts = FEED_POSTS.filter((p) => p.city === city || (city === 'chicago' && p.city === 'chicago'));
  const allPosts = city === 'chicago' ? FEED_POSTS.filter(p => p.city === 'chicago') : FEED_POSTS;

  const filteredPosts = allPosts.filter((p) => {
    if (feedFilter === 'All') return true;
    if (feedFilter === 'Open Slots') return p.type === 'open-slot';
    if (feedFilter === 'Musician Wanted') return p.type === 'musician-wanted';
    if (feedFilter === 'Events') return p.type === 'event';
    if (feedFilter === 'Collectives') return p.type === 'collective-forming';
    if (feedFilter === 'Releases') return p.type === 'release';
    if (feedFilter === 'Discussions') return p.type === 'discussion';
    return true;
  });

  const sceneCollectives = COLLECTIVES.filter((c) => c.city === scene.name);

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-2">
        <Link href="/" className="font-black text-base tracking-tight gradient-text-purple hidden sm:block">STAGEFRONT</Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors hidden sm:block">
          <LayoutDashboard className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/scene" className="text-slate-500 hover:text-white text-sm transition-colors">Scene Hubs</Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold">{scene.name}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setJoined(!joined)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all"
            style={joined
              ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color }
              : { borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }
            }
          >
            {joined ? <><Check className="w-3 h-3" />Joined</> : <><Plus className="w-3 h-3" />Join Scene</>}
          </button>
        </div>
      </nav>

      {/* Scene hero banner */}
      <div className="relative h-56 sm:h-72 mt-14 overflow-hidden">
        <img src={scene.coverImage} alt={scene.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/60 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{scene.country} · Underground Scene</span>
          </div>
          <h1 className="text-white font-black text-4xl sm:text-5xl mb-1">{scene.name}</h1>
          <p className="text-slate-400 text-sm italic">&ldquo;{scene.tagline}&rdquo;</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="glass border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { icon: Users, val: scene.stats.artists.toLocaleString(), label: 'Artists' },
            { icon: MapPin, val: scene.stats.venues.toString(), label: 'Venues' },
            { icon: CalendarDays, val: `${scene.stats.eventsMonth}/mo`, label: 'Events' },
            { icon: Zap, val: scene.stats.collectives.toString(), label: 'Collectives' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm">
              <Icon className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-bold">{val}</span>
              <span className="text-slate-500">{label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span className="hidden sm:block">{scene.trending}</span>
          </div>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-14 z-40 glass border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors"
                style={{ color: active ? color : '#64748b' }}
              >
                {tab}
                {active && <span className="absolute bottom-0 inset-x-5 h-0.5 rounded-full" style={{ backgroundColor: color }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content column */}
          <div className="lg:col-span-2 space-y-4">

            {/* FEED TAB */}
            {activeTab === 'Feed' && (
              <>
                {/* Filter chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {FILTER_TYPES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFeedFilter(f)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={feedFilter === f
                        ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color }
                        : { color: '#475569', borderColor: 'rgba(255,255,255,0.07)' }
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {filteredPosts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    expanded={expandedPost === post.id}
                    onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    sceneColor={color}
                  />
                ))}
              </>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'Events' && (
              <div className="space-y-3">
                {[
                  { name: 'NEURAL DRIFT', date: 'Jun 21', venue: 'The Blind Pig', genre: 'Industrial / Dark Techno', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', going: 89, tickets: true, sold: 67 },
                  { name: 'SIGNAL COLLAPSE', date: 'Jul 12', venue: 'Smart Bar', genre: 'Ambient Techno / Minimal', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80', going: 54, tickets: true, sold: 42 },
                  { name: 'DARK MATTER vol.4', date: 'Aug 3', venue: "Schuba's Tavern", genre: 'Industrial / EBM', image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=600&q=80', going: 112, tickets: true, sold: 88 },
                  { name: 'VOID CIRCUIT II', date: 'Aug 17', venue: 'Empty Bottle', genre: 'Dark Electro / Noise', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', going: 31, tickets: false, sold: 0 },
                ].map((event) => (
                  <div key={event.name} className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all group">
                    <div className="flex">
                      <div className="relative w-32 sm:w-44 flex-shrink-0">
                        <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060608]/40" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-white font-black text-lg leading-tight">{event.name}</h3>
                            <div className="text-slate-500 text-xs mt-0.5">{event.genre}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-white font-bold text-base" style={{ color }}>{event.date}</div>
                            <div className="text-slate-600 text-xs">2025</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                          <MapPin className="w-3 h-3" />{event.venue}
                        </div>
                        {event.sold > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                              <span>{event.sold}% sold</span>
                              <span>{event.going} going</span>
                            </div>
                            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${event.sold}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {event.tickets && (
                            <button className="text-xs font-bold px-3 py-1.5 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }} />
                              <span className="relative" style={{ color }}>Get Tickets</span>
                            </button>
                          )}
                          <button className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white transition-colors">
                            {event.going} going →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ARTISTS TAB */}
            {activeTab === 'Artists' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'NOVA VEGA', role: 'DJ / Dark Electro', draws: 280, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', color: '#f43f5e', verified: true, tag: 'Rising' },
                    { name: 'LUX', role: 'DJ / Dark Techno', draws: 220, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80', color: '#c026d3', verified: true, tag: 'Resident' },
                    { name: 'STATIC FORMA', role: 'DJ / Noise', draws: 140, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80', color: '#a855f7', verified: false, tag: 'Local' },
                    { name: 'MOANA SHIFT', role: 'Producer / DJ', draws: 180, image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80', color: '#06b6d4', verified: true, tag: 'Established' },
                    { name: 'PULSE COLLECTIVE', role: 'Live Act', draws: 200, image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&q=80', color: '#ec4899', verified: true, tag: 'Collective' },
                    { name: 'HALF LIFE', role: 'DJ / Industrial', draws: 125, image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&q=80', color: '#f59e0b', verified: false, tag: 'Emerging' },
                  ].map((artist) => (
                    <Link key={artist.name} href={`/profile/${artist.name.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center gap-3 glass rounded-xl p-3 border border-white/[0.07] hover:border-white/[0.14] transition-all group">
                      <div className="relative flex-shrink-0">
                        <img src={artist.image} alt={artist.name} className="w-11 h-11 rounded-xl object-cover" />
                        {artist.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-[#060608]"
                            style={{ backgroundColor: artist.color }}>
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{artist.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: `${artist.color}15`, color: artist.color }}>
                            {artist.tag}
                          </span>
                        </div>
                        <div className="text-slate-500 text-xs">{artist.role}</div>
                        <div className="text-slate-600 text-[10px] mt-0.5">~{artist.draws} draw</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* COLLECTIVES TAB */}
            {activeTab === 'Collectives' && (
              <div className="space-y-4">
                {sceneCollectives.length === 0 ? (
                  <p className="text-slate-600 text-sm text-center py-12">No collectives in this scene yet.</p>
                ) : (
                  sceneCollectives.map((col) => (
                    <div key={col.id} className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all">
                      <div className="relative h-28 overflow-hidden">
                        <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <h3 className="text-white font-black text-xl">{col.name}</h3>
                            <div className="text-slate-400 text-xs">{col.city} · {col.genres.join(', ')}</div>
                          </div>
                          {col.openSpots && (
                            <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `${col.accentColor}20`, color: col.accentColor, border: `1px solid ${col.accentColor}30` }}>
                              {col.openSpots}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{col.bio}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {col.members.map((m) => (
                              <img key={m.name} src={m.image} alt={m.name}
                                className="w-7 h-7 rounded-lg object-cover border-2 border-[#060608]" />
                            ))}
                          </div>
                          <span className="text-slate-600 text-xs">{col.memberCount} members · {col.eventsHosted} events</span>
                          <button className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                            style={{ borderColor: `${col.accentColor}40`, color: col.accentColor, backgroundColor: `${col.accentColor}10` }}>
                            View Collective
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BOARD TAB */}
            {activeTab === 'Board' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Local postings for {scene.name}</span>
                  <Link href="/board" className="text-xs font-semibold" style={{ color }}>
                    Full board →
                  </Link>
                </div>
                {FEED_POSTS.filter(p => p.city === city && (p.type === 'open-slot' || p.type === 'musician-wanted' || p.type === 'collab-request' || p.type === 'collective-forming' || p.type === 'venue-call')).map((post) => (
                  <FeedPostCard key={post.id} post={post} expanded={false} onToggle={() => {}} sceneColor={color} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scene description */}
            <div className="glass rounded-2xl p-5 border border-white/[0.07]">
              <h3 className="text-white font-bold text-sm mb-2">{scene.name} Scene</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{scene.description}</p>
              <div className="space-y-1.5">
                {scene.topGenres.map((g) => (
                  <div key={g} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-500 text-xs">{g}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold text-sm">Scene Pulse</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{scene.trending}</p>
            </div>

            {/* Top venues */}
            <div className="glass rounded-2xl p-4 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4" style={{ color }} />
                <span className="text-white font-bold text-sm">Key Venues</span>
              </div>
              <div className="space-y-2">
                {scene.topVenues.map((v) => (
                  <div key={v} className="flex items-center gap-2 py-1 border-b border-white/[0.04] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-400 text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Post to scene CTA */}
            <div className="rounded-2xl p-5 border relative overflow-hidden"
              style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ backgroundColor: color }} />
              <div className="relative">
                <h3 className="text-white font-bold text-sm mb-1.5">Post to the Scene</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Share opportunities, events, releases, or discussions with the {scene.name} underground.
                </p>
                <Link href="/board" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white relative overflow-hidden">
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
                  <Plus className="w-3.5 h-3.5 relative" />
                  <span className="relative">Create Post</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feed Post Card ───────────────────────────────────────────────────────────

function FeedPostCard({ post, expanded, onToggle, sceneColor }: {
  post: FeedPost; expanded: boolean; onToggle: () => void; sceneColor: string;
}) {
  const typeCfg = FEED_TYPE_CONFIG[post.type];
  const [interested, setInterested] = useState(false);

  return (
    <div className="glass rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all">
      {/* Cover image for events/releases */}
      {post.coverImage && (
        <div className="relative h-36 overflow-hidden rounded-t-2xl">
          <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/80 to-transparent" />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <img src={post.authorImage} alt={post.author} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-sm">{post.author}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
              >
                {typeCfg.label}
              </span>
            </div>
            <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-2">
              <span>{post.authorRole}</span>
              <span>·</span>
              <Clock className="w-2.5 h-2.5" />
              <span>{post.time}</span>
            </div>
          </div>
        </div>

        {/* Rich context for open slots */}
        {post.type === 'open-slot' && post.venue && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl mb-3 text-xs"
            style={{ backgroundColor: `${typeCfg.color}10`, border: `1px solid ${typeCfg.color}20` }}>
            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: typeCfg.color }} />
            <span className="text-white font-semibold">{post.venue}</span>
            <span className="text-slate-500">{post.slotDate} · {post.slotType}</span>
          </div>
        )}

        {/* Event details */}
        {post.type === 'event' && post.eventName && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl mb-3 text-xs"
            style={{ backgroundColor: '#10b98110', border: '1px solid #10b98120' }}>
            <CalendarDays className="w-3 h-3 flex-shrink-0 text-emerald-400" />
            <span className="text-white font-semibold">{post.eventName}</span>
            <span className="text-slate-500">{post.eventDate} · {post.eventVenue}</span>
          </div>
        )}

        {/* Content */}
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          {expanded || post.content.length < 160 ? post.content : `${post.content.slice(0, 160)}…`}
          {post.content.length >= 160 && (
            <button onClick={onToggle} className="text-slate-500 hover:text-slate-300 ml-1 text-xs transition-colors">
              {expanded ? 'less' : 'more'}
            </button>
          )}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.05]">{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInterested(!interested)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={interested
              ? { backgroundColor: `${sceneColor}20`, borderColor: `${sceneColor}40`, color: sceneColor }
              : { borderColor: 'rgba(255,255,255,0.08)', color: '#64748b' }
            }
          >
            {interested ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {post.cta}
          </button>
          <div className="flex items-center gap-1 text-slate-600 text-xs">
            <MessageSquare className="w-3 h-3" />
            <span>{post.stat} {post.statLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

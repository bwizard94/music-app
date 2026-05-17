'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, LayoutDashboard, Plus, MapPin, Clock, MessageSquare,
  CheckCircle2, AlertCircle, Users, Music2, Wrench, Building2, Zap, Search, SlidersHorizontal,
} from 'lucide-react';
import { BOARD_POSTS, type BoardPost } from '@/components/scene/sceneData';
import { useToast } from '@/components/ui/Toast';

const TYPE_CONFIG = {
  'open-slot':           { label: 'Open Slot',          color: '#c026d3', icon: Building2 },
  'musician-wanted':     { label: 'Musician Wanted',     color: '#f59e0b', icon: Music2 },
  'collab-request':      { label: 'Collab Request',      color: '#f43f5e', icon: Users },
  'collective-forming':  { label: 'Collective Forming',  color: '#a855f7', icon: Zap },
  'gear-share':          { label: 'Gear Share',          color: '#14b8a6', icon: Wrench },
  'venue-call':          { label: 'Venue Call',          color: '#10b981', icon: Building2 },
};

const FILTER_TYPES = ['All', 'Open Slots', 'Musician Wanted', 'Collab Requests', 'Collective Forming', 'Gear Share', 'Venue Calls'] as const;
const FILTER_CITIES = ['All Cities', 'Chicago, IL', 'Detroit, MI', 'New York, NY', 'Berlin, DE', 'London, UK'];

export default function BoardPage() {
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<typeof FILTER_TYPES[number]>('All');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [responded, setResponded] = useState<Set<string>>(new Set());
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState<BoardPost[]>(BOARD_POSTS);

  // Post form state
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postType, setPostType] = useState<BoardPost['type']>('open-slot');
  const [submitting, setSubmitting] = useState(false);

  function handlePost() {
    if (!postTitle.trim() || !postBody.trim()) return;
    setSubmitting(true);
    const newPost: BoardPost = {
      id: `post-${Date.now()}`,
      type: postType,
      title: postTitle.trim(),
      body: postBody.trim(),
      author: 'You',
      authorRole: 'Artist',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      city: 'Chicago, IL',
      time: 'Just now',
      tags: postTags.split(',').map((t) => t.trim()).filter(Boolean),
      accentColor: '#a855f7',
      responses: 0,
      interested: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostTitle('');
    setPostBody('');
    setPostTags('');
    setShowPostForm(false);
    setSubmitting(false);
    toast({ type: 'success', title: 'Posted!', message: 'Your post is now live on the board.' });
  }

  const filtered = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.body.toLowerCase().includes(q) && !p.tags.join(' ').toLowerCase().includes(q)) return false;
    if (cityFilter !== 'All Cities' && p.city !== cityFilter) return false;
    if (typeFilter === 'Open Slots' && p.type !== 'open-slot') return false;
    if (typeFilter === 'Musician Wanted' && p.type !== 'musician-wanted') return false;
    if (typeFilter === 'Collab Requests' && p.type !== 'collab-request') return false;
    if (typeFilter === 'Collective Forming' && p.type !== 'collective-forming') return false;
    if (typeFilter === 'Gear Share' && p.type !== 'gear-share') return false;
    if (typeFilter === 'Venue Calls' && p.type !== 'venue-call') return false;
    return true;
  });

  const urgent = filtered.filter((p) => p.urgent);
  const regular = filtered.filter((p) => !p.urgent);

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-2">
        <Link href="/" className="font-black text-base tracking-tight gradient-text-purple hidden sm:block">STAGEFRONT</Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors hidden sm:flex items-center gap-1">
          <LayoutDashboard className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold">Collaboration Board</span>
        <div className="ml-auto">
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="flex items-center gap-1.5 text-sm font-bold text-white px-3 py-1.5 rounded-xl relative overflow-hidden"
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #a855f7, #a855f788)' }} />
            <Plus className="w-3.5 h-3.5 relative" />
            <span className="relative">Post</span>
          </button>
        </div>
      </nav>

      <div className="pt-14 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f720, #a855f710)', border: '1px solid #a855f730' }}>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl">Collaboration Board</h1>
              <p className="text-slate-500 text-sm">Open slots · musician wanted · collab requests · gear share</p>
            </div>
          </div>
        </div>

        {/* Post form (collapsed by default) */}
        {showPostForm && (
          <div className="glass rounded-2xl p-5 border border-white/[0.07] mb-6">
            <h3 className="text-white font-bold text-sm mb-4">Create a Post</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                  <button
                    key={type}
                    onClick={() => setPostType(type as BoardPost['type'])}
                    className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold hover:border-white/[0.14] transition-all text-left"
                    style={{
                      color: cfg.color,
                      borderColor: postType === type ? cfg.color : 'rgba(255,255,255,0.07)',
                      backgroundColor: postType === type ? `${cfg.color}15` : 'transparent',
                    }}
                  >
                    <cfg.icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </button>
                ))}
              </div>
              <input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Post title…"
                className="w-full glass rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06]"
              />
              <textarea
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder="Describe what you need, offer, or want to discuss…"
                rows={3}
                className="w-full glass rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06] resize-none"
              />
              <div className="flex gap-2">
                <input
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="Tags (genre, city, type…)"
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06]"
                />
                <button
                  onClick={handlePost}
                  disabled={!postTitle.trim() || !postBody.trim() || submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white relative overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #a855f7, #a855f788)' }} />
                  <span className="relative">{submitting ? 'Posting…' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="glass rounded-2xl p-4 border border-white/[0.07] mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities…"
                className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs"
              style={showFilters
                ? { backgroundColor: '#a855f720', borderColor: '#a855f740', color: '#a855f7' }
                : { borderColor: 'rgba(255,255,255,0.08)', color: '#64748b' }
              }
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />Filters
            </button>
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FILTER_TYPES.map((f) => {
              const isActive = typeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all"
                  style={isActive
                    ? { backgroundColor: '#a855f720', borderColor: '#a855f740', color: '#a855f7' }
                    : { color: '#475569', borderColor: 'rgba(255,255,255,0.07)' }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-slate-300 text-xs outline-none bg-white/[0.03] border border-white/[0.06]"
              >
                {FILTER_CITIES.map((c) => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const count = posts.filter((p) => p.type === type).length;
            return (
              <div key={type} className="glass rounded-xl p-3 text-center border border-white/[0.06]">
                <cfg.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: cfg.color }} />
                <div className="text-white font-bold text-sm">{count}</div>
                <div className="text-slate-600 text-[10px] leading-tight mt-0.5">{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {/* Urgent posts */}
        {urgent.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-rose-400 font-bold text-sm">Urgent / Deadline Soon</span>
            </div>
            <div className="space-y-3">
              {urgent.map((post) => (
                <BoardPostCard key={post.id} post={post} responded={responded.has(post.id)} onRespond={() => setResponded(prev => { const n = new Set(prev); n.add(post.id); return n; })} />
              ))}
            </div>
          </div>
        )}

        {/* Main posts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-semibold">{filtered.length} posts</span>
            <span className="text-slate-600 text-xs">Most recent</span>
          </div>
          <div className="space-y-3">
            {regular.map((post) => (
              <BoardPostCard key={post.id} post={post} responded={responded.has(post.id)} onRespond={() => setResponded(prev => { const n = new Set(prev); n.add(post.id); return n; })} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-600">
                <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>No posts match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Board Post Card ──────────────────────────────────────────────────────────

function BoardPostCard({ post, responded, onRespond }: {
  post: BoardPost; responded: boolean; onRespond: () => void;
}) {
  const cfg = TYPE_CONFIG[post.type];
  const Icon = cfg.icon;

  return (
    <div className={`glass rounded-2xl p-5 border transition-all hover:border-white/[0.14] ${post.urgent ? 'border-rose-400/20' : 'border-white/[0.07]'}`}>
      <div className="flex items-start gap-4">
        {/* Author */}
        <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                >
                  <Icon className="w-2.5 h-2.5" />{cfg.label}
                </span>
                {post.urgent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-400/15 text-rose-400 border border-rose-400/25 flex-shrink-0">
                    Urgent
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-base">{post.title}</h3>
            </div>
            <div className="text-right flex-shrink-0 text-xs text-slate-600">
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.time}</div>
            </div>
          </div>

          {/* Author */}
          <div className="text-slate-500 text-xs mb-2">{post.author} · {post.authorRole}</div>

          {/* Body */}
          <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.body}</p>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{post.city}</span>
            {post.compensation && (
              <span className="flex items-center gap-1 font-semibold" style={{ color: cfg.color }}>
                {post.compensation}
              </span>
            )}
            {post.deadline && (
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3 h-3" />Deadline: {post.deadline}
              </span>
            )}
            {post.seeking && (
              <span className="flex items-center gap-1">
                <Music2 className="w-3 h-3" />Seeking: {post.seeking}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.05]">{t}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRespond}
              disabled={responded}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={responded
                ? { backgroundColor: '#10b98120', border: '1px solid #10b98140', color: '#10b981' }
                : { backgroundColor: `${cfg.color}18`, border: `1px solid ${cfg.color}40`, color: cfg.color }
              }
            >
              {responded ? <><CheckCircle2 className="w-3 h-3" />Responded</> : <>I&apos;m Interested</>}
            </button>
            <div className="flex items-center gap-1 text-slate-600 text-xs">
              <MessageSquare className="w-3 h-3" />
              <span>{post.responses} {post.responses === 1 ? 'response' : 'responses'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

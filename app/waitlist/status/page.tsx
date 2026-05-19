'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Copy, Check, Share2, Users, TrendingUp,
  ArrowRight, ChevronRight, Clock, MapPin,
} from 'lucide-react';
import SceneBackground from '@/components/ui/SceneBackground';
import {
  readWaitlistEntry, effectivePosition, SPOTS_PER_REFERRAL,
  CITY_OPTIONS, ROLE_OPTIONS, RECENT_ACTIVITY,
  type WaitlistEntry,
} from '@/lib/data/waitlist';

function StatBlock({ value, label, color = '#a855f7' }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="text-center px-4 py-3">
      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
      <div className="text-slate-600 text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}

function CopyableField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all group"
      style={copied
        ? { borderColor: '#10b98140', backgroundColor: '#10b98108' }
        : { borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }
      }
    >
      <div className="text-left min-w-0">
        <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-white text-xs font-mono truncate">{value}</div>
      </div>
      <div className="flex-shrink-0 ml-3 transition-colors" style={{ color: copied ? '#10b981' : '#475569' }}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </div>
    </button>
  );
}

export default function WaitlistStatusPage() {
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntry(readWaitlistEntry());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  // Cycle through activity feed items
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(i => i + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) return null;

  if (!entry) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        <SceneBackground accentColor="#a855f7" intensity="low" />
        <div className="relative z-10 text-center">
          <h1 className="text-white font-black text-2xl mb-3">You&apos;re not on the list.</h1>
          <p className="text-slate-500 text-sm mb-6">Join the waitlist to get your spot and referral link.</p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            Join the waitlist
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const pos = effectivePosition(entry);
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${entry.referralCode}`
    : `stagefront.app/invite/${entry.referralCode}`;
  const cityData = CITY_OPTIONS.find(c => c.label === entry.city);
  const roleData = ROLE_OPTIONS.find(r => r.id === entry.role);
  const totalInCity = cityData?.queue ?? 0;
  const pctAhead = totalInCity > 0 ? Math.round((1 - (pos / totalInCity)) * 100) : 0;
  const spotsToFront = Math.max(0, pos - 1 - entry.referralCount * SPOTS_PER_REFERRAL);

  // Activity feed
  const cityKey = Object.keys(RECENT_ACTIVITY).find(k => entry.city.toLowerCase().includes(k)) ?? 'default';
  const feed = RECENT_ACTIVITY[cityKey] ?? RECENT_ACTIVITY.default;
  const currentFeedItem = feed[activityIndex % feed.length];

  const shareOnX = () => {
    const text = `Just locked in my spot on Stagefront — the professional network for the music scene.\n\nUse my link to skip ahead: ${referralUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen relative bg-[#060608]">
      <SceneBackground accentColor="#a855f7" intensity="low" />

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">STAGEFRONT</span>
        </Link>
        <Link href="/login" className="text-slate-400 hover:text-white text-xs transition-colors mr-4">
          Sign in
        </Link>
        <Link
          href="/waitlist"
          className="text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: '#a855f720', color: '#a855f7', border: '1px solid #a855f730' }}
        >
          Waitlist
        </Link>
      </nav>

      <main className="pt-14 pb-16 px-4 max-w-2xl mx-auto relative z-10">

        {/* Hero: position */}
        <div className="py-12 text-center">
          {/* Live activity ticker */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-[11px] font-medium glass border border-white/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-slate-300 transition-all">{currentFeedItem}</span>
          </div>

          <div className="text-8xl font-black text-white leading-none mb-2">#{pos}</div>
          <div className="text-slate-400 text-base mb-1">
            in the <span className="text-white font-bold">{entry.city}</span> queue
          </div>
          {pctAhead > 0 && (
            <div className="text-slate-600 text-sm">
              Ahead of {pctAhead}% of the people who signed up after you
            </div>
          )}

          {/* Queue bar */}
          {totalInCity > 0 && (
            <div className="mt-6 max-w-xs mx-auto">
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(3, 100 - (pos / totalInCity) * 100)}%`,
                    background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-700 mt-1">
                <span>Front</span>
                <span>{totalInCity.toLocaleString()} in {entry.city}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="glass rounded-2xl border border-white/[0.07] mb-5">
          <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
            <StatBlock value={pos} label="Position" color="#a855f7" />
            <StatBlock value={entry.referralCount} label="Referred" color="#06b6d4" />
            <StatBlock value={entry.referralCount * SPOTS_PER_REFERRAL} label="Spots moved" color="#10b981" />
          </div>
        </div>

        {/* Identity card */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5 mb-5">
          <h3 className="text-white font-bold text-sm mb-3">Your profile</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Role
              </span>
              <span className="text-white font-medium">
                {roleData?.emoji} {roleData?.label ?? entry.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> City
              </span>
              <span className="text-white font-medium flex items-center gap-2">
                {entry.city}
                {cityData?.active && (
                  <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Launching soon</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Joined
              </span>
              <span className="text-white font-medium">
                {new Date(entry.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            {entry.referredBy && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" /> Joined with invite
                </span>
                <span className="text-emerald-400 font-mono text-xs">{entry.referredBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Invite your scene */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-bold text-sm">Invite your scene.</h3>
          </div>
          <p className="text-slate-500 text-xs mb-5 leading-relaxed">
            Every person you bring in bumps you up <strong className="text-white">{SPOTS_PER_REFERRAL} spots</strong>. They join ahead of the line. You move up. Everyone wins.
          </p>

          {/* Progress toward front */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Referred {entry.referralCount} of 3 needed to reach the front</span>
              <span className="text-purple-400 font-semibold">{entry.referralCount}/3</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (entry.referralCount / 3) * 100)}%`,
                  background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                }}
              />
            </div>
            {spotsToFront > 0 && (
              <p className="text-slate-700 text-[10px] mt-1">
                {Math.ceil(spotsToFront / SPOTS_PER_REFERRAL)} more referral{Math.ceil(spotsToFront / SPOTS_PER_REFERRAL) !== 1 ? 's' : ''} to reach the front
              </p>
            )}
          </div>

          {/* Share links */}
          <div className="space-y-2 mb-4">
            <CopyableField value={referralUrl} label="Your invite link" />
            <CopyableField value={entry.referralCode} label="Your invite code" />
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <button
              onClick={copyShareLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border"
              style={shareCopied
                ? { backgroundColor: '#10b98112', borderColor: '#10b98140', color: '#10b981' }
                : { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }
              }
            >
              {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {shareCopied ? 'Copied' : 'Copy link'}
            </button>
            <button
              onClick={shareOnX}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border border-white/[0.1] text-slate-300 hover:text-white hover:border-white/25 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on X
            </button>
          </div>
        </div>

        {/* Pre-launch teaser: what's inside */}
        <div className="glass rounded-2xl border border-white/[0.07] p-5 mb-5">
          <h3 className="text-white font-bold text-sm mb-4">While you wait — a preview.</h3>
          <div className="space-y-3">
            {[
              { icon: '🎛', title: 'Show Builder', desc: 'Build events with smart lineup intelligence. Drag-and-drop. Proposal generator.', color: '#a855f7' },
              { icon: '📋', title: 'Proposal System', desc: 'Pitch venues with a full show concept. They respond. You build.', color: '#06b6d4' },
              { icon: '🗺', title: 'Scene Hubs', desc: 'Every city gets its own feed, roster, and event map.', color: '#10b981' },
              { icon: '🤝', title: 'Creative Board', desc: 'Find your next collab. Open slots. Collective forming. Gear share.', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-xl flex-shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-xs">{item.title}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: item.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Already have a code? */}
        <div className="rounded-2xl border border-white/[0.07] p-5 text-center" style={{ background: '#a855f708' }}>
          <Lock className="w-5 h-5 text-purple-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-3">
            Got a direct invite code? You can skip the line entirely.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
          >
            Sign up with your invite code
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

// Lock icon inline since we need it
function Lock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Check, Lock, MapPin, Users } from 'lucide-react';
import SceneBackground from '@/components/ui/SceneBackground';
import {
  ROLE_OPTIONS, CITY_OPTIONS,
  generateReferralCode, generatePosition,
  writeWaitlistEntry,
} from '@/lib/data/waitlist';

interface Props {
  code: string;
}

// Role emoji lookup for the visual grid
const ROLE_GRID = ROLE_OPTIONS.slice(0, 6); // show 6 most common roles

export default function InviteLanding({ code }: Props) {
  const [step, setStep] = useState<'intro' | 'form' | 'done'>('intro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCity = CITY_OPTIONS.find(c => c.id === city);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const position = generatePosition(email, true); // invited = true → front of queue
    const referralCode = generateReferralCode(email);
    const cityLabel = CITY_OPTIONS.find(c => c.id === city)?.label ?? city;

    writeWaitlistEntry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      city: cityLabel,
      position,
      referralCode,
      referredBy: code,
      joinedAt: new Date().toISOString(),
      referralCount: 0,
    });

    setLoading(false);
    setStep('done');
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === 'done') {
    const position = generatePosition(email, true);
    const cityLabel = CITY_OPTIONS.find(c => c.id === city)?.label ?? city;
    const referralCode = generateReferralCode(email);
    const referralUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/invite/${referralCode}`
      : '';

    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        <SceneBackground accentColor="#a855f7" intensity="medium" />
        <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
        </Link>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="glass rounded-2xl border border-white/[0.08] p-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: '#a855f718', border: '1px solid #a855f740' }}>
              <Check className="w-7 h-7 text-purple-400" />
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-5"
              style={{ background: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}
            >
              Invite accepted
            </div>

            <h2 className="text-white font-black text-2xl tracking-tight mb-1">
              You&apos;re in, {name.split(' ')[0]}.
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Priority spot secured in <strong className="text-white">{cityLabel}</strong>.
            </p>

            <div className="glass rounded-xl border border-white/[0.08] p-4 mb-6 text-center">
              <div className="text-4xl font-black text-white mb-1">#{position}</div>
              <div className="text-slate-500 text-xs">in the {cityLabel} queue</div>
              <div className="text-emerald-400 text-[10px] mt-1 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> Priority position from invite code
              </div>
            </div>

            <p className="text-slate-500 text-xs mb-5">
              Now pass it on. Your referral link moves you up and lets your people in ahead of the line.
            </p>

            <div className="space-y-3">
              <Link
                href="/waitlist/status"
                className="block w-full py-3 rounded-xl text-sm font-bold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                View my status & referral link
              </Link>
              <Link
                href="/signup"
                className="block w-full py-3 rounded-xl text-sm font-semibold text-slate-300 text-center border border-white/[0.08] hover:border-white/20 hover:text-white transition-all"
              >
                Sign up now with invite code
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        <SceneBackground accentColor="#a855f7" intensity="medium" />

        <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
        </Link>

        <div className="relative z-10 w-full max-w-md">
          {/* Hero glow */}
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-3xl scale-110 pointer-events-none" />

          <div className="relative glass rounded-2xl border border-white/[0.08] overflow-hidden">
            {/* Top image band */}
            <div className="relative h-36 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
                alt="Show"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d16]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/20 to-transparent" />
            </div>

            <div className="px-8 pt-2 pb-8">
              {/* Invite badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#a855f720', border: '1px solid #a855f740' }}>
                  <Lock className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">Invite code</div>
                  <div className="text-white font-mono font-bold text-sm tracking-widest">{code}</div>
                </div>
              </div>

              <h1 className="text-white font-black text-2xl tracking-tight mb-2 leading-tight">
                Someone from the scene<br />
                <span className="gradient-text-purple">saved you a spot.</span>
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Stagefront is invite-only right now. You&apos;ve been handed a key. This code lets you skip the waitlist and join ahead of everyone who doesn&apos;t know the right people yet.
              </p>

              {/* What you get */}
              <div className="space-y-2.5 mb-8">
                {[
                  { icon: '🎛', text: 'Full access to Show Builder — build events, pitch venues, assemble lineups' },
                  { icon: '🗺', text: 'Your city\'s scene hub — artists, venues, and events all in one place' },
                  { icon: '📋', text: 'Proposal system — pitch your show directly to venue bookers' },
                  { icon: '🤝', text: 'Creative board — find collabs, open slots, and your next gig' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-slate-400 text-xs leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-[#060608]" />
                  ))}
                </div>
                <p className="text-slate-500 text-xs">
                  <strong className="text-slate-300">8,400+</strong> in the queue. You&apos;re skipping them.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
                  <span className="relative">Accept your invite</span>
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <p className="text-center text-slate-700 text-xs mt-4">
                Already on Stagefront?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <SceneBackground accentColor="#a855f7" intensity="medium" />

      <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => setStep('intro')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-6 transition-colors"
        >
          ← Back
        </button>

        <div className="glass rounded-2xl border border-white/[0.08] p-8">
          {/* Code confirmation */}
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
            <Lock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">
              Invite code <strong className="text-white font-mono">{code}</strong> · Priority spot reserved
            </span>
          </div>

          <h2 className="text-white font-black text-xl tracking-tight mb-1">You&apos;re almost in.</h2>
          <p className="text-slate-500 text-sm mb-6">Tell us a bit about yourself so we can connect you with the right scene.</p>

          <form onSubmit={handleAccept} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name or artist name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="NOVA VEGA or Jane Smith"
                required
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">What do you do?</label>
              <div className="grid grid-cols-3 gap-1.5">
                {ROLE_OPTIONS.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className="p-2.5 rounded-xl border text-left transition-all"
                    style={role === r.id
                      ? { borderColor: '#a855f760', backgroundColor: '#a855f715' }
                      : { borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }
                    }
                  >
                    <div className="text-base mb-0.5">{r.emoji}</div>
                    <div className="text-white text-[10px] font-semibold leading-tight">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                <MapPin className="w-3 h-3 inline mr-1" />
                Where are you based?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {CITY_OPTIONS.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCity(c.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all"
                    style={city === c.id
                      ? { borderColor: '#a855f760', backgroundColor: '#a855f715' }
                      : { borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }
                    }
                  >
                    <span className="text-white text-xs font-medium">{c.label}</span>
                    {c.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !role || !city}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white relative overflow-hidden group disabled:opacity-40 transition-opacity"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
              {loading ? (
                <span className="relative flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing your spot…
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  Accept invite
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

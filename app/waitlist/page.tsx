'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowRight, Check, Copy, Share2,
  ChevronLeft, MapPin, Users, TrendingUp, Lock,
} from 'lucide-react';
import SceneBackground from '@/components/ui/SceneBackground';
import {
  ROLE_OPTIONS, CITY_OPTIONS,
  generateReferralCode, generatePosition,
  writeWaitlistEntry, readWaitlistEntry,
  effectivePosition, SPOTS_PER_REFERRAL,
  type WaitlistEntry,
} from '@/lib/data/waitlist';

type Step = 'role' | 'city' | 'details' | 'done';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-semibold"
      style={copied
        ? { borderColor: '#10b98140', color: '#10b981', backgroundColor: '#10b98112' }
        : { borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.04)' }
      }
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : (label ?? 'Copy')}
    </button>
  );
}

function ProgressDots({ step }: { step: Step }) {
  const steps: Step[] = ['role', 'city', 'details'];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= idx ? '#a855f7' : 'rgba(255,255,255,0.15)' }}
          />
          {i < steps.length - 1 && (
            <div className="w-8 h-px" style={{ backgroundColor: i < idx ? '#a855f7' : 'rgba(255,255,255,0.1)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function WaitlistPage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [inviteCodeError, setInviteCodeError] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Pre-fill invite code from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') ?? params.get('invite') ?? '';
    if (code) setInviteCode(code.toUpperCase());

    const email = params.get('email') ?? '';
    if (email) setEmail(email);

    // If already on waitlist, jump to done
    const existing = readWaitlistEntry();
    if (existing) {
      setEntry(existing);
      setStep('done');
    }
  }, []);

  const selectedCity = CITY_OPTIONS.find(c => c.id === city);
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${entry?.referralCode ?? ''}`
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInviteCodeError('');

    // Simulate a small network delay for realism
    await new Promise(r => setTimeout(r, 900));

    const hasInvite = inviteCode.trim().length === 8;
    const position = generatePosition(email, hasInvite);
    const referralCode = generateReferralCode(email);
    const cityLabel = CITY_OPTIONS.find(c => c.id === city)?.label ?? city;

    const newEntry: WaitlistEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      city: cityLabel,
      position,
      referralCode,
      referredBy: hasInvite ? inviteCode.trim().toUpperCase() : undefined,
      joinedAt: new Date().toISOString(),
      referralCount: 0,
    };

    writeWaitlistEntry(newEntry);
    setEntry(newEntry);
    setLoading(false);
    setStep('done');
  };

  const shareOnX = () => {
    const text = `Just locked in my spot on Stagefront — the professional network for music culture.\n\nUse my invite link to join: ${referralUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  // ── Step: Done ─────────────────────────────────────────────────────────────
  if (step === 'done' && entry) {
    const pos = effectivePosition(entry);
    const cityData = CITY_OPTIONS.find(c => c.label === entry.city);

    return (
      <div className="min-h-screen relative flex flex-col items-center justify-start px-4 py-12 pt-24">
        <SceneBackground accentColor="#a855f7" intensity="medium" />

        <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
        </Link>

        <div className="relative z-10 w-full max-w-lg">
          {/* Position badge */}
          <div className="glass rounded-2xl border border-white/[0.08] p-8 mb-5 text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: '#a855f715', color: '#a855f7', border: '1px solid #a855f730' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              You&apos;re in
            </div>

            <div className="text-6xl font-black text-white mb-1">#{pos}</div>
            <div className="text-slate-400 text-sm mb-1">
              in the <span className="text-white font-semibold">{entry.city}</span> queue
            </div>
            {cityData && cityData.queue > 0 && (
              <div className="text-slate-600 text-xs">
                {cityData.queue.toLocaleString()} people ahead of you citywide
              </div>
            )}

            {entry.referredBy && (
              <div className="mt-4 text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Invite code applied — priority position
              </div>
            )}
          </div>

          {/* Referral section */}
          <div className="glass rounded-2xl border border-white/[0.08] p-6 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span className="text-white font-bold text-sm">Put your people on.</span>
            </div>
            <p className="text-slate-500 text-xs mb-5 leading-relaxed">
              Every person you bring in bumps you up <strong className="text-white">{SPOTS_PER_REFERRAL} spots</strong>. Share your link. They&apos;ll owe you one.
            </p>

            {/* Referral link box */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 mb-3">
              <div className="text-slate-600 text-[10px] uppercase tracking-widest mb-1">Your invite link</div>
              <div className="text-white text-xs font-mono break-all">{referralUrl}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyShareLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border"
                style={shareCopied
                  ? { backgroundColor: '#10b98115', borderColor: '#10b98140', color: '#10b981' }
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

            {/* Referral code display */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.06] px-3 py-2.5">
              <div>
                <div className="text-slate-600 text-[10px] uppercase tracking-widest">Your invite code</div>
                <div className="text-white font-mono font-bold text-sm tracking-widest mt-0.5">{entry.referralCode}</div>
              </div>
              <CopyButton text={entry.referralCode} label="Copy code" />
            </div>
          </div>

          {/* Progress toward skip */}
          <div className="glass rounded-2xl border border-white/[0.08] p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-semibold">Skip the line</span>
              <span className="text-slate-500 text-xs">{entry.referralCount} / 3 referred</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (entry.referralCount / 3) * 100)}%`, background: 'linear-gradient(90deg, #a855f7, #06b6d4)' }}
              />
            </div>
            <p className="text-slate-600 text-xs">
              Refer 3 people → move to the front of your city&apos;s queue
            </p>
          </div>

          <Link
            href="/waitlist/status"
            className="block text-center text-slate-500 text-xs hover:text-slate-300 transition-colors"
          >
            View your full status page →
          </Link>
        </div>
      </div>
    );
  }

  // ── Steps 1–3 wrapper ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12">
      <SceneBackground accentColor="#a855f7" intensity="medium" />

      <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
      </Link>

      <div className="relative z-10 w-full max-w-lg">
        {step !== 'role' && step !== 'done' && (
          <button
            onClick={() => setStep(step === 'details' ? 'city' : 'role')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {step !== 'done' && <ProgressDots step={step} />}

        {/* ── Step 1: Role ──────────────────────────────────────────────────── */}
        {step === 'role' && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest"
                style={{ background: '#a855f715', color: '#a855f7', border: '1px solid #a855f730' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Limited early access
              </div>
              <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-3">
                Your scene has<br />
                <span className="gradient-text-purple">a waitlist.</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stagefront is opening city by city. Tell us who you are and where you make it happen — we&apos;ll let you know when your scene goes live.
              </p>
            </div>

            <div className="mb-2">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">What do you do?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setStep('city'); }}
                    className="group text-left p-3.5 rounded-xl border transition-all duration-200"
                    style={role === r.id
                      ? { borderColor: '#a855f760', backgroundColor: '#a855f715' }
                      : { borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }
                    }
                  >
                    <div className="text-2xl mb-2">{r.emoji}</div>
                    <div className="text-white font-bold text-xs mb-0.5">{r.label}</div>
                    <div className="text-slate-600 text-[10px] leading-tight">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
                  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60&q=80',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-[#060608]" />
                ))}
              </div>
              <p className="text-slate-500 text-xs">
                <strong className="text-slate-300">8,400+</strong> artists, DJs, and venues already in queue
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: City ──────────────────────────────────────────────────── */}
        {step === 'city' && (
          <div>
            <div className="mb-8">
              <h2 className="text-white font-black text-3xl tracking-tight mb-2">
                Where do you<br />
                <span className="gradient-text-purple">make it happen?</span>
              </h2>
              <p className="text-slate-500 text-sm">We&apos;re opening city by city. Active scenes launch first.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {CITY_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCity(c.id); setStep('details'); }}
                  className="group relative text-left p-3.5 rounded-xl border transition-all duration-200"
                  style={city === c.id
                    ? { borderColor: '#a855f760', backgroundColor: '#a855f715' }
                    : { borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)' }
                  }
                >
                  {c.active && (
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 mb-1">
                    <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-xs">{c.label}</span>
                  </div>
                  {c.queue > 0 ? (
                    <div className="text-slate-600 text-[10px]">{c.queue.toLocaleString()} in queue</div>
                  ) : (
                    <div className="text-slate-700 text-[10px]">Forming</div>
                  )}
                  {c.active && (
                    <div className="mt-1 text-emerald-500 text-[10px] font-semibold">{c.trend}</div>
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Launching soon
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Building queue
              </span>
            </div>
          </div>
        )}

        {/* ── Step 3: Details ───────────────────────────────────────────────── */}
        {step === 'details' && (
          <div>
            <div className="mb-8">
              <h2 className="text-white font-black text-3xl tracking-tight mb-2">
                Last step.
              </h2>
              <p className="text-slate-500 text-sm">
                Drop your details. We&apos;ll reach out when <strong className="text-white">{selectedCity?.label ?? 'your city'}</strong> goes live.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Your name or artist name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="NOVA VEGA or Jane Smith"
                  required
                  className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 transition-colors"
                />
              </div>

              {/* Invite code — optional */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Invite code
                  <span className="text-slate-600 font-normal">(optional — skips the line)</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={e => { setInviteCode(e.target.value.toUpperCase()); setInviteCodeError(''); }}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 transition-colors font-mono tracking-widest"
                />
                {inviteCodeError && (
                  <p className="text-rose-400 text-xs mt-1">{inviteCodeError}</p>
                )}
                {inviteCode.length === 8 && !inviteCodeError && (
                  <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Invite code applied — priority spot
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 flex items-center gap-3">
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3 h-3" />
                    <span>{ROLE_OPTIONS.find(r => r.id === role)?.label ?? role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedCity?.label}</span>
                    {selectedCity?.active && <span className="text-emerald-500 text-[10px] font-semibold">Launching soon</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('city')}
                  className="text-slate-600 text-[10px] hover:text-slate-400 transition-colors"
                >
                  Change
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !name || !email}
                className="w-full relative flex items-center justify-center gap-2 font-bold text-white py-4 rounded-xl overflow-hidden group disabled:opacity-50 transition-opacity"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
                {loading ? (
                  <span className="relative flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Securing your spot…
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    Join the waitlist
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <p className="text-slate-700 text-xs text-center mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

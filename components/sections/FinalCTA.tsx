'use client';

import { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { CITY_OPTIONS } from '@/lib/data/waitlist';
import Link from 'next/link';

export default function FinalCTA() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Pass email into the waitlist flow
    window.location.href = `/waitlist?email=${encodeURIComponent(email)}`;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-[#060608]" />
        <div className="orb w-[800px] h-[800px] bg-purple-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="orb w-[400px] h-[400px] bg-pink-600/10 top-1/2 left-1/4 -translate-y-1/2 z-0" />
        <div className="orb w-[400px] h-[400px] bg-cyan-600/10 top-1/2 right-1/4 -translate-y-1/2 z-0" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168,85,247,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
          <Lock className="w-3 h-3 text-purple-400" />
          <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">
            Invite-Only · Launching by City
          </span>
        </div>

        <h2 className="display-lg text-white mb-6">
          The Scene Is Being
          <br />
          <span className="gradient-text-purple">Built Right Now.</span>
          <br />
          Are You In?
        </h2>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Stagefront is opening city by city — invite only. Join the waitlist, get your referral link,
          and bring your scene with you.
        </p>

        {/* City queue live counts */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          {CITY_OPTIONS.filter(c => c.active).map(c => (
            <div
              key={c.id}
              className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/[0.06]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-xs font-medium">{c.label}</span>
              <span className="text-slate-600 text-[10px]">{c.queue.toLocaleString()} waiting</span>
            </div>
          ))}
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/[0.06]">
            <span className="text-slate-600 text-xs">+ 18 more cities</span>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/waitlist"
            className="group relative flex items-center gap-3 font-bold text-white px-10 py-5 rounded-xl overflow-hidden text-base w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
            <span className="relative">Join the Waitlist</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/invite/STAGEFRONT"
            className="group relative flex items-center gap-3 font-bold text-white px-10 py-5 rounded-xl overflow-hidden text-base w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-amber-600 group-hover:from-amber-600 group-hover:to-rose-600 transition-all duration-500" />
            <span className="relative">Have an Invite Code?</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Email capture → drops into waitlist flow */}
        <div className="max-w-md mx-auto">
          <p className="text-slate-500 text-sm mb-4">Drop your email and we&apos;ll notify you when your city launches</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full glass rounded-xl py-3.5 px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="relative font-semibold text-white px-6 py-3.5 rounded-xl overflow-hidden flex-shrink-0 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
              <span className="relative text-sm">Join</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

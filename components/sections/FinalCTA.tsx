'use client';

import { ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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
          <span className="w-2 h-2 rounded-full bg-purple-400 pulse-glow" />
          <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">
            Early Access Now Open
          </span>
        </div>

        <h2 className="display-lg text-white mb-6">
          The Scene Is Being
          <br />
          <span className="gradient-text-purple">Built Right Now.</span>
          <br />
          Are You In?
        </h2>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Join thousands of artists, venues, and creatives who are already using Stagefront
          to build their careers and connect with the scenes that matter.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#"
            className="group relative flex items-center gap-3 font-bold text-white px-10 py-5 rounded-xl overflow-hidden text-base w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 group-hover:translate-x-full transition-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <span className="relative">Join as an Artist</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#"
            className="group relative flex items-center gap-3 font-bold text-white px-10 py-5 rounded-xl overflow-hidden text-base w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-amber-600 group-hover:from-amber-600 group-hover:to-rose-600 transition-all duration-500" />
            <span className="relative">Join as a Venue</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Email waitlist */}
        <div className="max-w-md mx-auto">
          <p className="text-slate-500 text-sm mb-4">Or get notified when we launch in your city</p>
          {submitted ? (
            <div className="glass rounded-xl p-4 text-center">
              <span className="text-green-400 font-semibold">You&apos;re on the list. We&apos;ll be in touch. 🎵</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full glass rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="relative font-semibold text-white px-6 py-3.5 rounded-xl overflow-hidden flex-shrink-0 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
                <span className="relative text-sm">Notify Me</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

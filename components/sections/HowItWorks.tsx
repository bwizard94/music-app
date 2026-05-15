'use client';

import { UserPlus, Search, Handshake, Zap } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Build Your Profile',
    description:
      'Create a rich professional profile. Showcase your sound, your reel, your availability, and your collaboration history.',
    color: '#a855f7',
  },
  {
    step: '02',
    icon: Search,
    title: 'Discover the Scene',
    description:
      'Search by city, genre, role, or skill. Find the right artists for your lineup, the right venue for your sound, or the right gig for your calendar.',
    color: '#06b6d4',
  },
  {
    step: '03',
    icon: Handshake,
    title: 'Collaborate & Book',
    description:
      'Send booking requests, negotiate terms, coordinate logistics — all within the platform. No more back-and-forth DMs.',
    color: '#f43f5e',
  },
  {
    step: '04',
    icon: Zap,
    title: 'Build Your Reputation',
    description:
      'Every show, every collab, every verified booking adds to your professional record. Your reputation grows with every performance.',
    color: '#f59e0b',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="scene-divider mb-24" />
      <div className="orb w-[600px] h-[600px] bg-indigo-600/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-indigo-400 text-xs font-semibold tracking-widest uppercase">
              How It Works
            </span>
            <div className="w-6 h-px bg-indigo-500" />
          </div>
          <h2 className="display-md text-white mb-4">
            From Profile to Performance
            <br />
            <span className="gradient-text-cyan">in Four Steps</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Stagefront strips away the noise. No algorithms burying you. No cold outreach into the void.
            Just a direct professional network built for how music actually works.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="group relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px z-10"
                    style={{
                      background: `linear-gradient(90deg, ${step.color}40, ${steps[i + 1].color}40)`,
                    }}
                  />
                )}

                <div className="glass rounded-2xl p-6 h-full hover:border-white/15 transition-all duration-300 card-hover">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <span
                      className="text-4xl font-black tabular-nums"
                      style={{ color: `${step.color}20` }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="scene-divider mt-24" />
    </section>
  );
}

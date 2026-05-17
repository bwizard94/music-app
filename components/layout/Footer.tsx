'use client';

import { Zap, Music2, Globe, Radio, Rss } from 'lucide-react';

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: 'Discover Artists', href: '/discover' },
    { label: 'Find Venues',      href: '/discover' },
    { label: 'Browse Events',    href: '/discover' },
    { label: 'Local Scenes',     href: '/scene' },
    { label: 'Collaboration Hub', href: '/board' },
  ],
  'For Artists': [
    { label: 'Create Profile',    href: '/signup' },
    { label: 'Set Availability',  href: '/signup' },
    { label: 'Accept Bookings',   href: '/signup' },
    { label: 'Artist Resources',  href: '#' },
    { label: 'Artist Blog',       href: '#' },
  ],
  'For Venues': [
    { label: 'List Your Venue',      href: '/signup' },
    { label: 'Find Talent',          href: '/discover' },
    { label: 'Booking Management',   href: '/signup' },
    { label: 'Venue Analytics',      href: '#' },
    { label: 'Success Stories',      href: '#' },
  ],
  Company: [
    { label: 'About Stagefront', href: '#' },
    { label: 'Careers',          href: '#' },
    { label: 'Press Kit',        href: '#' },
    { label: 'Contact',          href: '#' },
    { label: 'Privacy Policy',   href: '#' },
  ],
};

const socialLinks = [
  { icon: Globe,  href: '#', label: 'Instagram' },
  { icon: Radio,  href: '#', label: 'Twitter/X' },
  { icon: Rss,    href: '#', label: 'YouTube' },
  { icon: Music2, href: '#', label: 'SoundCloud' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">STAGEFRONT</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              The professional network for the live entertainment industry.
              Built by artists. Powered by community. Rooted in local culture.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* City tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Chicago', 'NYC', 'LA', 'Austin', 'Detroit', '+18 more'].map((city) => (
                <span
                  key={city}
                  className="text-xs text-slate-600 border border-white/[0.06] px-2 py-1 rounded-full"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2025 Stagefront Inc. All rights reserved. Built for the culture.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a href="/login" className="text-slate-600 hover:text-slate-400 transition-colors">Log In</a>
            <a href="/signup" className="text-slate-600 hover:text-slate-400 transition-colors">Sign Up</a>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-glow" />
              All systems operational · 24 scenes live
            </div>
          </div>
        </div>
      </div>

      {/* Neon bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </footer>
  );
}

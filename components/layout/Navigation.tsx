'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Discover', href: '#discover' },
  { label: 'Artists', href: '#artists' },
  { label: 'Venues', href: '#venues' },
  { label: 'Events', href: '#events' },
  { label: 'Scenes', href: '#scenes' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/[0.06] py-3'
            : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-purple-500 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              STAGEFRONT
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="relative text-sm font-semibold text-white px-5 py-2.5 rounded-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
              <span className="relative">Join the Scene</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
          >
            {link.label}
          </a>
        ))}
        <div className="flex flex-col items-center gap-4 mt-4">
          <a href="/login" className="text-slate-400 hover:text-white transition-colors">
            Sign In
          </a>
          <a
            href="/signup"
            className="relative font-semibold text-white px-8 py-3 rounded-lg overflow-hidden"
            onClick={() => setMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <span className="relative">Join the Scene</span>
          </a>
        </div>
      </div>
    </>
  );
}

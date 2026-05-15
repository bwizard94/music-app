'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ChevronRight } from 'lucide-react';
import { THE_BLIND_PIG } from '@/components/venue/venueData';
import VenueHero from '@/components/venue/VenueHero';
import VenueOverview from '@/components/venue/VenueOverview';
import VenueEvents from '@/components/venue/VenueEvents';
import VenueGallery from '@/components/venue/VenueGallery';
import VenueArtists from '@/components/venue/VenueArtists';
import VenueReviews from '@/components/venue/VenueReviews';
import VenueAnalytics from '@/components/venue/VenueAnalytics';
import BookingModal from '@/components/venue/BookingModal';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'events', label: 'Events' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'artists', label: 'Artists' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'analytics', label: 'Analytics' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function VenuePage() {
  const venue = THE_BLIND_PIG;
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [bookingOpen, setBookingOpen] = useState(false);
  const isOwner = false;
  const color = venue.accentColor;

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Top nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-3">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <span className="font-black text-lg tracking-tight gradient-text-purple">STAGEFRONT</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:block">Dashboard</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-400 text-sm truncate max-w-[160px]">{venue.name}</span>
      </nav>

      {/* Hero */}
      <div className="pt-14">
        <VenueHero venue={venue} onBook={() => setBookingOpen(true)} />
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-14 z-40 glass border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex-shrink-0 px-5 py-4 text-sm font-semibold transition-colors duration-200"
                  style={{ color: active ? color : '#64748b' }}
                >
                  {tab.label}
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-5 h-0.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <VenueOverview venue={venue} onBook={() => setBookingOpen(true)} />
        )}
        {activeTab === 'events' && (
          <VenueEvents venue={venue} onBook={() => setBookingOpen(true)} />
        )}
        {activeTab === 'gallery' && (
          <VenueGallery venue={venue} />
        )}
        {activeTab === 'artists' && (
          <VenueArtists venue={venue} />
        )}
        {activeTab === 'reviews' && (
          <VenueReviews venue={venue} />
        )}
        {activeTab === 'analytics' && (
          <VenueAnalytics venue={venue} isOwner={isOwner} />
        )}
      </main>

      {/* Booking modal */}
      {bookingOpen && (
        <BookingModal venue={venue} onClose={() => setBookingOpen(false)} />
      )}
    </div>
  );
}

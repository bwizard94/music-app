'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Zap, LayoutDashboard } from 'lucide-react';
import { NOVA_VEGA } from '@/components/profile/artistData';
import { ARTISTS } from '@/lib/data/artists';
import { useAuth } from '@/components/providers/AuthProvider';
import ProfileHero from '@/components/profile/ProfileHero';
import OverviewTab from '@/components/profile/OverviewTab';
import MusicPlayer from '@/components/profile/MusicPlayer';
import MediaGallery from '@/components/profile/MediaGallery';
import ShowsSection from '@/components/profile/ShowsSection';
import ReviewsSection from '@/components/profile/ReviewsSection';
import AnalyticsPreview from '@/components/profile/AnalyticsPreview';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'music', label: 'Music' },
  { id: 'media', label: 'Media' },
  { id: 'shows', label: 'Shows' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'analytics', label: 'Analytics' },
];

export default function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { profileSlug } = useAuth();
  const isOwner = profileSlug === slug;

  const [activeTab, setActiveTab] = useState('overview');

  // For beta: use NOVA_VEGA's rich data for any slug, but with the correct artist metadata
  const foundArtist = ARTISTS.find(a => a.slug === slug);
  const artist = slug === 'nova-vega'
    ? NOVA_VEGA
    : (foundArtist
        // NOVA_VEGA's stats/tracks/sets shape overrides the plain Artist type fields
        ? ({ ...NOVA_VEGA, name: foundArtist.name, slug: foundArtist.slug, role: foundArtist.role, genres: foundArtist.genres, city: foundArtist.city, country: foundArtist.country, bio: foundArtist.bio, accentColor: foundArtist.accentColor } as typeof NOVA_VEGA)
        : NOVA_VEGA);
  const color = artist.accentColor;

  return (
    <div className="min-h-screen bg-[#060608]">
      {/* Top nav bar */}
      <div className="sticky top-0 z-50 glass border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight hidden sm:block">STAGEFRONT</span>
          </Link>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Link
                href="/profile/settings"
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors glass rounded-lg px-3 py-1.5"
              >
                Edit Profile
              </Link>
            )}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile hero */}
      <ProfileHero
        artist={artist}
        isOwner={isOwner}
        onTabChange={setActiveTab}
      />

      {/* Tab navigation */}
      <div className="sticky top-14 z-40 bg-[#060608]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-0">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors"
                  style={{
                    color: active ? 'white' : '#475569',
                  }}
                >
                  {tab.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewTab artist={artist} />
        )}

        {activeTab === 'music' && (
          <div className="max-w-3xl">
            <MusicPlayer artist={artist} />
          </div>
        )}

        {activeTab === 'media' && (
          <MediaGallery artist={artist} />
        )}

        {activeTab === 'shows' && (
          <div className="max-w-3xl">
            <ShowsSection artist={artist} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-2xl">
            <ReviewsSection artist={artist} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-2xl">
            <AnalyticsPreview artist={artist} isOwner={isOwner} />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Users, Globe, ExternalLink, MapPin, CalendarDays } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import type { ArtistData } from './artistData';

interface Props {
  artist: ArtistData;
}

export default function OverviewTab({ artist }: Props) {
  const color = artist.accentColor;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left / main */}
      <div className="lg:col-span-2 space-y-5">
        {/* Bio */}
        <div className="glass rounded-2xl p-6 border border-white/[0.07]">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            About
          </h3>
          <div className="text-slate-400 text-sm leading-relaxed space-y-3">
            {artist.bio.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Music player */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            Music
          </h3>
          <MusicPlayer artist={artist} />
        </div>

        {/* Featured video */}
        {artist.videos[0] && (
          <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
              <h3 className="text-white font-bold text-sm">Featured Video</h3>
              {artist.videos[0].url && artist.videos[0].url !== '#' ? (
                <a
                  href={artist.videos[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {artist.videos[0].platform}
                </a>
              ) : null}
            </div>
            <div className="relative group cursor-pointer">
              <img
                src={artist.videos[0].thumbnail}
                alt={artist.videos[0].title}
                className="w-full h-56 md:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}88)`,
                    boxShadow: `0 0 40px ${color}50`,
                  }}
                >
                  <svg className="w-6 h-6 text-white fill-white ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-bold text-base">{artist.videos[0].title}</h4>
                <p className="text-slate-400 text-xs mt-1">
                  {artist.videos[0].views} views · {artist.videos[0].duration}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* Genre tags */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {artist.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${color}15`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Collaboration interests */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" style={{ color }} />
            Open to Collaborating
          </h4>
          <div className="space-y-2">
            {artist.collaborationInterests.map((interest) => (
              <div key={interest} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-400 text-sm">{interest}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next show preview */}
        {artist.upcomingShows[0] && (
          <div
            className="rounded-2xl p-5 border relative overflow-hidden"
            style={{
              backgroundColor: `${color}08`,
              borderColor: `${color}20`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
              style={{ backgroundColor: color, opacity: 0.1 }}
            />
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2 relative">
              <CalendarDays className="w-3.5 h-3.5" style={{ color }} />
              Next Show
            </h4>
            <p className="text-white font-bold text-base relative">{artist.upcomingShows[0].title}</p>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 relative">
              <MapPin className="w-3 h-3" />
              {artist.upcomingShows[0].venue} · {artist.upcomingShows[0].city}
            </div>
            <div className="text-slate-500 text-xs mt-0.5 relative">
              {artist.upcomingShows[0].date} · {artist.upcomingShows[0].time}
            </div>
            <a
              href={artist.upcomingShows[0].ticketUrl && artist.upcomingShows[0].ticketUrl !== '#' ? artist.upcomingShows[0].ticketUrl : '/signup'}
              target={artist.upcomingShows[0].ticketUrl && artist.upcomingShows[0].ticketUrl !== '#' ? '_blank' : undefined}
              rel={artist.upcomingShows[0].ticketUrl && artist.upcomingShows[0].ticketUrl !== '#' ? 'noopener noreferrer' : undefined}
              className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-lg relative"
              style={{ backgroundColor: `${color}20`, color }}
            >
              Get Tickets →
            </a>
          </div>
        )}

        {/* Social links */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" style={{ color }} />
            Links
          </h4>
          <div className="space-y-2">
            {Object.entries(artist.socialLinks).map(([platform, handle]) => {
              let href = '#';
              if (platform === 'instagram') {
                href = `https://instagram.com/${String(handle).replace(/^@/, '')}`;
              } else if (String(handle).startsWith('http')) {
                href = String(handle);
              } else {
                href = `https://${String(handle)}`;
              }
              return (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {platform[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold capitalize">{platform}</div>
                    <div className="text-slate-600 text-xs truncate max-w-32">{handle}</div>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
              </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

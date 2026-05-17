'use client';

import { MapPin, Clock, Users, Ticket, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import type { ArtistData } from './artistData';

interface Props {
  artist: ArtistData;
}

export default function ShowsSection({ artist }: Props) {
  const [showAllPast, setShowAllPast] = useState(false);
  const color = artist.accentColor;

  return (
    <div className="space-y-6">
      {/* Upcoming shows */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
          <CalendarDays className="w-4 h-4" style={{ color }} />
          <h3 className="text-white font-bold text-sm">Upcoming Shows</h3>
          <span
            className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {artist.upcomingShows.length} confirmed
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {artist.upcomingShows.map((show) => (
            <div
              key={show.id}
              className="flex flex-col sm:flex-row gap-4 p-5 hover:bg-white/[0.02] transition-colors"
            >
              {/* Date block */}
              <div
                className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center border sm:self-start"
                style={{
                  backgroundColor: `${color}10`,
                  borderColor: `${color}25`,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                  {show.date.split(' ')[0]}
                </span>
                <span className="text-white font-black text-2xl leading-none">
                  {show.date.split(' ')[2]}
                </span>
                <span className="text-slate-600 text-[10px]">
                  {show.date.split(' ')[1].replace(',', '')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-white font-bold text-base leading-tight">
                      {show.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {show.venue} · {show.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {show.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${color}15`,
                      color,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    {show.role}
                  </span>
                </div>

                {/* Genre */}
                <div className="text-slate-600 text-xs mb-2">{show.genre}</div>

                {/* With artists */}
                {show.withArtists.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-slate-700" />
                    <span className="text-slate-600">with</span>
                    {show.withArtists.map((a, i) => (
                      <span key={a}>
                        <a href="/discover" className="text-slate-400 hover:text-white transition-colors font-medium">
                          {a}
                        </a>
                        {i < show.withArtists.length - 1 && (
                          <span className="text-slate-700">, </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket CTA */}
              <div className="flex-shrink-0 self-center">
                <a
                  href={show.ticketUrl && show.ticketUrl !== '#' ? show.ticketUrl : '/signup'}
                  target={show.ticketUrl && show.ticketUrl !== '#' ? '_blank' : undefined}
                  rel={show.ticketUrl && show.ticketUrl !== '#' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-xs font-semibold hover:bg-white/10 transition-all border border-white/[0.08] hover:border-white/[0.16] text-slate-300 hover:text-white"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Tickets
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance history */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <h3 className="text-white font-bold text-sm">Performance History</h3>
          <span className="text-slate-500 text-xs">{artist.stats.shows} shows total</span>
        </div>

        <div className="p-5 space-y-4">
          {artist.pastShows
            .slice(0, showAllPast ? undefined : 3)
            .map((year) => (
              <div key={year.year} className="flex gap-4">
                {/* Year label */}
                <div className="flex-shrink-0 w-12 pt-1">
                  <span className="text-slate-600 text-sm font-bold">{year.year}</span>
                </div>

                {/* Content */}
                <div className="flex-1 border-l border-white/[0.06] pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="text-sm font-semibold"
                      style={{ color }}
                    >
                      {year.count} shows
                    </div>
                    {/* Bar */}
                    <div className="flex-1 h-1 bg-white/[0.05] rounded-full max-w-32">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(year.count / 60) * 100}%`,
                          backgroundColor: color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {year.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs text-slate-500 glass rounded-lg px-2 py-1 border border-white/[0.06]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

          <button
            onClick={() => setShowAllPast(!showAllPast)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors text-xs w-full justify-center pt-2"
          >
            {showAllPast ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show full history <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

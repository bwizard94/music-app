'use client';

import { useState } from 'react';
import { Play, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VenueData } from './venueData';

function Lightbox({ photos, index, onClose, onNav }: {
  photos: VenueData['photos']; index: number;
  onClose: () => void; onNav: (d: -1 | 1) => void;
}) {
  const p = photos[index];
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-slate-400 hover:text-white p-2" onClick={onClose}>
        <X className="w-6 h-6" />
      </button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 text-slate-400 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="max-w-5xl px-16" onClick={(e) => e.stopPropagation()}>
        <img src={p.url} alt={p.caption} className="max-w-full max-h-[75vh] object-contain rounded-xl" />
        <div className="mt-3 text-center">
          <p className="text-white font-medium text-sm">{p.caption}</p>
          <p className="text-slate-500 text-xs mt-1">Photo by {p.credit}</p>
        </div>
      </div>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 text-slate-400 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onNav(1); }}>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

interface Props { venue: VenueData; }

export default function VenueGallery({ venue }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [tab, setTab] = useState<'photos' | 'videos'>('photos');
  const color = venue.accentColor;

  return (
    <>
      {lightboxIdx !== null && (
        <Lightbox
          photos={venue.photos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNav={(d) => setLightboxIdx((i) => i === null ? null : (i + d + venue.photos.length) % venue.photos.length)}
        />
      )}

      <div className="space-y-5">
        {/* Tab switch */}
        <div className="flex gap-1 glass rounded-xl p-1 w-fit border border-white/[0.06]">
          {(['photos', 'videos'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
              style={tab === t ? { backgroundColor: `${color}20`, color, border: `1px solid ${color}40` } : { color: '#64748b' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'photos' && (
          <div>
            {/* Hero image */}
            <div
              className="relative rounded-2xl overflow-hidden mb-3 cursor-pointer group h-72"
              onClick={() => setLightboxIdx(0)}
            >
              <img src={venue.photos[0].url} alt={venue.photos[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold text-sm">{venue.photos[0].caption}</p>
                <p className="text-slate-400 text-xs">{venue.photos[0].credit}</p>
              </div>
            </div>

            {/* Photo grid */}
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {venue.photos.slice(1).map((photo, i) => (
                <div key={photo.id}
                  className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => setLightboxIdx(i + 1)}
                >
                  <img src={photo.url} alt={photo.caption}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium leading-tight">{photo.caption}</p>
                    <p className="text-slate-400 text-xs">{photo.credit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'videos' && (
          <div className="space-y-4">
            {/* Featured video */}
            {venue.videos.filter((v) => v.featured).map((video) => (
              <div key={video.id} className="relative group cursor-pointer rounded-2xl overflow-hidden">
                <img src={video.thumbnail} alt={video.title}
                  className="w-full h-72 md:h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 0 50px ${color}50` }}
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block"
                    style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}>
                    {video.platform}
                  </span>
                  <h3 className="text-white font-black text-xl">{video.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">{video.views} views · {video.duration}</p>
                </div>
              </div>
            ))}

            {/* Video grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {venue.videos.filter((v) => !v.featured).map((video) => (
                <div key={video.id} className="glass rounded-xl overflow-hidden group cursor-pointer border border-white/[0.07] hover:border-white/[0.14] transition-colors">
                  <div className="relative h-40 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 glass rounded px-1.5 py-0.5">
                      <span className="text-xs text-slate-300">{video.duration}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-slate-200 font-medium text-sm truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span>{video.platform}</span>
                      <span>·</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

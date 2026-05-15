'use client';

import { useState } from 'react';
import { X, Play, ExternalLink, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ArtistData } from './artistData';

function Lightbox({ photos, index, onClose, onNav }: {
  photos: ArtistData['photos'];
  index: number;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
}) {
  const photo = photos[index];
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-3 glass rounded-full"
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        className="max-w-5xl max-h-[85vh] px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          className="max-w-full max-h-[75vh] object-contain rounded-xl"
        />
        <div className="mt-3 text-center">
          <p className="text-white font-medium text-sm">{photo.caption}</p>
          <p className="text-slate-500 text-xs mt-1">Photo by {photo.credit}</p>
        </div>
      </div>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-3 glass rounded-full"
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ backgroundColor: i === index ? '#f43f5e' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>
    </div>
  );
}

interface Props {
  artist: ArtistData;
}

export default function MediaGallery({ artist }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const color = artist.accentColor;

  const navigate = (dir: -1 | 1) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((i) => {
      if (i === null) return null;
      return (i + dir + artist.photos.length) % artist.photos.length;
    });
  };

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          photos={artist.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={navigate}
        />
      )}

      <div className="space-y-5">
        {/* Tab switcher */}
        <div className="flex gap-1 glass rounded-xl p-1 w-fit border border-white/[0.06]">
          {(['photos', 'videos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
              style={
                activeTab === tab
                  ? {
                      backgroundColor: `${color}20`,
                      color,
                      border: `1px solid ${color}40`,
                    }
                  : {
                      color: '#64748b',
                    }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Photos */}
        {activeTab === 'photos' && (
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {artist.photos.map((photo, i) => (
              <div
                key={photo.id}
                className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Caption overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium leading-tight">{photo.caption}</p>
                  <p className="text-slate-400 text-xs">{photo.credit}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {/* Featured video */}
            {artist.videos.filter((v) => v.featured).map((video) => (
              <div key={video.id} className="relative group cursor-pointer rounded-2xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}99)`,
                      boxShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block"
                    style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
                  >
                    {video.platform}
                  </span>
                  <h3 className="text-white font-bold text-lg">{video.title}</h3>
                  <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
                    <span>{video.views} views</span>
                    <span>·</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Other videos grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artist.videos.filter((v) => !v.featured).map((video) => (
                <div key={video.id} className="glass rounded-xl overflow-hidden group cursor-pointer border border-white/[0.07] hover:border-white/[0.14] transition-colors">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600">{video.platform}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-xs text-slate-600">{video.views} views</span>
                      <ExternalLink className="w-3 h-3 text-slate-700 ml-auto" />
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

'use client';

import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ExternalLink, Music, Headphones } from 'lucide-react';
import type { ArtistData } from './artistData';

function WaveformBars({ bars, progress, color, isPlaying }: {
  bars: number[];
  progress: number;
  color: string;
  isPlaying: boolean;
}) {
  const maxBar = Math.max(...bars);
  return (
    <div
      className="flex items-end gap-px h-10 cursor-pointer"
      style={{ width: '100%' }}
    >
      {bars.map((h, i) => {
        const pct = i / bars.length;
        const isActive = pct < progress;
        const height = `${(h / maxBar) * 100}%`;
        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height,
              minHeight: '2px',
              backgroundColor: isActive ? color : 'rgba(255,255,255,0.12)',
              opacity: isPlaying && isActive ? 1 : 0.7,
              animation: isPlaying && isActive && i % 3 === 0
                ? `pulse-glow ${0.5 + (i % 5) * 0.15}s ease-in-out infinite`
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

interface Props {
  artist: ArtistData;
}

export default function MusicPlayer({ artist }: Props) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.32);
  const [volume] = useState(0.8);

  const track = artist.tracks[currentTrack];
  const color = artist.accentColor;

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentTrack((t) => (t + 1) % artist.tracks.length);
  const handlePrev = () => setCurrentTrack((t) => (t - 1 + artist.tracks.length) % artist.tracks.length);

  return (
    <div className="space-y-4">
      {/* Featured player */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4" style={{ color }} />
            <span className="text-white font-bold text-sm">Discography</span>
          </div>
          <a href="#" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ExternalLink className="w-3 h-3" />
            Open on Spotify
          </a>
        </div>

        {/* Main player area */}
        <div className="p-5">
          <div className="flex items-start gap-4 mb-5">
            {/* Album art / visualizer */}
            <div
              className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
                border: `1px solid ${color}30`,
              }}
            >
              <Music className="w-8 h-8 opacity-40" style={{ color }} />
              {isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-0.5 pb-2 px-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full"
                      style={{
                        backgroundColor: color,
                        height: `${20 + (i % 3) * 10}%`,
                        animation: `pulse-glow ${0.4 + i * 0.1}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-base md:text-lg truncate mb-0.5">
                {track.title}
              </div>
              <div className="text-slate-500 text-xs mb-1">
                {artist.name} · {track.label} · {track.year}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="glass rounded px-2 py-0.5 border border-white/[0.06]">
                  {track.bpm} BPM
                </span>
                <span className="glass rounded px-2 py-0.5 border border-white/[0.06]">
                  {track.key}
                </span>
                <span>{(track.plays / 1000).toFixed(1)}K plays</span>
              </div>
            </div>

            <div className="flex-shrink-0 text-slate-600 text-xs">{track.duration}</div>
          </div>

          {/* Waveform */}
          <div
            className="mb-4 cursor-pointer"
            onClick={() => setProgress(Math.random() * 0.9 + 0.05)}
          >
            <WaveformBars
              bars={track.waveform}
              progress={progress}
              color={color}
              isPlaying={isPlaying}
            />
            <div className="flex justify-between text-xs text-slate-700 mt-1">
              <span>
                {/* Current time */}
                {Math.floor(parseInt(track.duration.split(':')[0]) * progress)}:
                {String(Math.floor(parseInt(track.duration.split(':')[1]) * progress)).padStart(2, '0')}
              </span>
              <span>{track.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-slate-600" />
              <div className="w-16 h-0.5 bg-white/10 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${volume * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  boxShadow: isPlaying ? `0 0 24px ${color}50` : 'none',
                }}
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-white fill-white" />
                  : <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                }
              </button>

              <button
                onClick={handleNext}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>

        {/* Track list */}
        <div className="border-t border-white/[0.05]">
          {artist.tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setCurrentTrack(i); setIsPlaying(true); setProgress(0); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors ${
                i < artist.tracks.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              {/* Index / playing indicator */}
              <div className="w-6 flex-shrink-0 text-center">
                {i === currentTrack && isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    {[1, 2, 3].map((b) => (
                      <div
                        key={b}
                        className="w-0.5 rounded-full"
                        style={{
                          backgroundColor: color,
                          height: `${40 + b * 20}%`,
                          animation: `pulse-glow ${0.4 + b * 0.1}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className={`text-xs font-medium ${i === currentTrack ? 'text-white' : 'text-slate-600'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium truncate ${i === currentTrack ? 'text-white' : 'text-slate-300'}`}
                  style={i === currentTrack ? { color } : undefined}
                >
                  {t.title}
                </div>
                <div className="text-slate-600 text-xs">{t.label} · {t.year}</div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 flex-shrink-0">
                <span className="hidden sm:block">{(t.plays / 1000).toFixed(1)}K</span>
                <span className="hidden sm:block">{t.bpm} bpm</span>
                <span>{t.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mixes / Sets */}
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
          <span className="text-white font-bold text-sm">DJ Sets & Mixes</span>
          <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            View all on Mixcloud →
          </a>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {artist.sets.map((set) => (
            <a
              key={set.id}
              href={set.url}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={set.image} alt={set.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 font-medium text-sm truncate group-hover:text-white transition-colors">
                  {set.title}
                </div>
                <div className="text-slate-600 text-xs mt-0.5">
                  {set.platform} · {set.date} · {(set.plays / 1000).toFixed(0)}K plays
                </div>
              </div>
              <div className="text-slate-600 text-xs flex-shrink-0">{set.duration}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

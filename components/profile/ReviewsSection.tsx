'use client';

import { Star, Check, Award, Users, Music2, Zap, Building2, Mic2 } from 'lucide-react';
import type { ArtistData } from './artistData';

const REVIEW_TYPE_ICONS: Record<string, React.ElementType> = {
  Booking: Building2,
  Collaboration: Users,
  Festival: Zap,
};

interface Props {
  artist: ArtistData;
}

export default function ReviewsSection({ artist }: Props) {
  const color = artist.accentColor;
  const avgRating = artist.stats.rating;

  // Rating distribution (fake but realistic)
  const distribution = [
    { stars: 5, pct: 92 },
    { stars: 4, pct: 6 },
    { stars: 3, pct: 2 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Collaboration badges */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-bold text-sm">Collaboration Badges</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {artist.collaborationBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
              style={{
                backgroundColor: `${badge.color}10`,
                borderColor: `${badge.color}25`,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: badge.color }}
              >
                {badge.count}
              </div>
              <span className="text-sm font-medium" style={{ color: badge.color }}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating summary */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07]">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Big rating */}
          <div className="text-center sm:text-left flex-shrink-0">
            <div
              className="text-6xl font-black tracking-tighter"
              style={{ color }}
            >
              {avgRating}
            </div>
            <div className="flex justify-center sm:justify-start gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <div className="text-slate-500 text-xs">{artist.stats.reviewCount} reviews</div>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {distribution.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8 flex-shrink-0">
                  <span className="text-xs text-slate-500">{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct > 50 ? color : '#94a3b8',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {artist.reviews.map((review) => {
          const TypeIcon = REVIEW_TYPE_ICONS[review.type] || Music2;
          return (
            <div
              key={review.id}
              className="glass rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Reviewer avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={review.reviewerImage}
                    alt={review.reviewer}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  {review.verified && (
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border border-[#060608]"
                      style={{ backgroundColor: color }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Review content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{review.reviewer}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{review.reviewerType}</span>
                    {/* Type badge */}
                    <span
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: '#94a3b8',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <TypeIcon className="w-3 h-3" />
                      {review.type}
                    </span>
                    {review.verified && (
                      <span className="text-[10px] text-green-400 font-semibold">✓ Verified</span>
                    )}
                  </div>

                  {/* Stars + date */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 text-xs">{review.date}</span>
                  </div>

                  <blockquote className="text-slate-400 text-sm leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave a review CTA */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07] text-center">
        <Mic2 className="w-6 h-6 mx-auto mb-3 text-slate-600" />
        <h4 className="text-white font-semibold text-sm mb-1">Worked with NOVA VEGA?</h4>
        <p className="text-slate-500 text-xs mb-4">
          Leave a verified review to help build their professional reputation on Stagefront.
        </p>
        <button
          className="relative font-semibold text-white px-6 py-2.5 rounded-xl overflow-hidden group text-sm"
        >
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          />
          <span className="relative">Write a Review</span>
        </button>
      </div>
    </div>
  );
}

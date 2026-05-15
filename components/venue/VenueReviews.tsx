'use client';

import { Star, Check, Mic2, Award } from 'lucide-react';
import type { VenueData } from './venueData';

const TYPE_COLORS: Record<string, string> = {
  Residency: '#a855f7',
  Headliner: '#f43f5e',
  'Event Photography': '#ec4899',
};

interface Props { venue: VenueData; }

export default function VenueReviews({ venue }: Props) {
  const color = venue.accentColor;

  const distribution = [
    { stars: 5, pct: 95 },
    { stars: 4, pct: 4 },
    { stars: 3, pct: 1 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sound Quality', value: '9.8', suffix: '/10' },
          { label: 'Artist Hospitality', value: '9.6', suffix: '/10' },
          { label: 'Production Quality', value: '9.7', suffix: '/10' },
        ].map(({ label, value, suffix }) => (
          <div key={label}
            className="glass rounded-xl p-4 text-center border border-white/[0.07]"
          >
            <div className="flex items-baseline justify-center gap-0.5 mb-1">
              <span className="text-white font-black text-2xl" style={{ color }}>{value}</span>
              <span className="text-slate-600 text-sm">{suffix}</span>
            </div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Rating summary */}
      <div className="glass rounded-2xl p-6 border border-white/[0.07]">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="text-center flex-shrink-0">
            <div className="text-6xl font-black tracking-tighter" style={{ color }}>
              {venue.stats.rating}
            </div>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div className="text-slate-500 text-xs">{venue.stats.reviewCount} artist reviews</div>
          </div>

          <div className="flex-1 space-y-2">
            {distribution.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-xs text-slate-500">{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: pct > 50 ? color : '#94a3b8' }} />
                </div>
                <span className="text-xs text-slate-600 w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {venue.reviews.map((review) => {
          const typeColor = TYPE_COLORS[review.type] || color;
          return (
            <div key={review.id}
              className="glass rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.12] transition-colors">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img src={review.reviewerImage} alt={review.reviewer}
                    className="w-11 h-11 rounded-xl object-cover" />
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border border-[#060608]"
                      style={{ backgroundColor: color }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{review.reviewer}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{review.reviewerType}</span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25` }}
                    >
                      {review.type}
                    </span>
                    {review.verified && <span className="text-[10px] text-green-400 font-semibold">✓ Verified</span>}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
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

      {/* Write review CTA */}
      <div className="glass rounded-2xl p-5 border border-white/[0.07] text-center">
        <Award className="w-6 h-6 mx-auto mb-3 text-slate-600" />
        <h4 className="text-white font-semibold text-sm mb-1">Performed at The Blind Pig?</h4>
        <p className="text-slate-500 text-xs mb-4">
          Your verified review helps other artists know what to expect from this venue.
        </p>
        <button className="relative font-semibold text-white px-6 py-2.5 rounded-xl overflow-hidden text-sm">
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
          <span className="relative flex items-center justify-center gap-2">
            <Mic2 className="w-4 h-4" />
            Write a Review
          </span>
        </button>
      </div>
    </div>
  );
}

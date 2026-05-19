'use client';

const testimonials = [
  {
    quote:
      "Before Stagefront, booking was just cold emails and prayer. Now I have 3 months of gigs locked in, all sourced through the platform. It's the missing infrastructure the scene needed.",
    name: 'Jordan "JXRDXN" Ellis',
    role: 'DJ / Producer',
    city: 'Chicago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    color: '#a855f7',
  },
  {
    quote:
      "We needed a lighting designer for a last-minute festival slot. Found one, confirmed the contract, and had them on-site — all in 48 hours. That would have taken weeks before.",
    name: 'Priya Nair',
    role: 'Festival Promoter',
    city: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=200&q=80',
    color: '#06b6d4',
  },
  {
    quote:
      "As a venue owner, I used to struggle to find talent that fit our vibe. Now I get targeted artist recommendations that actually understand our aesthetic. Our bookings are up 40%.",
    name: 'Marcus Webb',
    role: 'Venue Director, The Void',
    city: 'Brooklyn',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    color: '#f43f5e',
  },
  {
    quote:
      "I'm a photographer, not a musician — but this platform got me three residency contracts with clubs for their event coverage. It's for the whole creative ecosystem.",
    name: 'Aaliya Chen',
    role: 'Music Photographer',
    city: 'Portland',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    color: '#f59e0b',
  },
  {
    quote:
      "The collaboration tools are next level. I found my current band through Stagefront — drummer, bassist, visual artist. We went from 'strangers' to 'sold-out show' in six weeks.",
    name: 'Dex Romano',
    role: 'Musician / Bandleader',
    city: 'Austin',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    color: '#10b981',
  },
  {
    quote:
      "Every serious booking I've had in the past year came through Stagefront. It's not a social media app — it's a real professional network that moves at the speed of nightlife.",
    name: 'SABLE',
    role: 'Electronic Artist',
    city: 'Detroit',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    color: '#8b5cf6',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-indigo-600/10 bottom-0 right-0 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-purple-500" />
            <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
              Community Voices
            </span>
            <div className="w-6 h-px bg-purple-500" />
          </div>
          <h2 className="display-md text-white mb-4">
            Hear It From <br />
            <span className="gradient-text-purple">The Scene</span>
          </h2>
        </div>

        {/* Testimonial masonry */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass rounded-2xl p-6 break-inside-avoid card-hover cursor-default hover:border-white/15 transition-all duration-300"
            >
              {/* Quote mark */}
              <div
                className="text-5xl font-black leading-none mb-4"
                style={{ color: `${t.color}30` }}
              >
                &ldquo;
              </div>

              <blockquote className="text-slate-300 text-sm leading-relaxed mb-6">
                {t.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 0 2px ${t.color}40` }}
                  />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role} · {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

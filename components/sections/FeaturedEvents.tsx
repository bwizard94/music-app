'use client';

import { Calendar, Clock, MapPin, Users, ChevronRight, Ticket } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Subterranean Sessions Vol. 12',
    venue: 'The Blind Pig',
    city: 'Chicago, IL',
    date: 'Fri, May 23',
    time: '10 PM – 4 AM',
    genre: 'Techno / Industrial',
    capacity: '300 cap',
    attending: 247,
    image: 'https://images.unsplash.com/photo-1571266028753-bfe6cc7f0e8e?w=600&q=80',
    artists: ['NOVA VEGA', 'CRYPT0', 'LUX'],
    color: '#a855f7',
    featured: true,
    price: '$15–25',
  },
  {
    id: 2,
    title: 'Midnight Frequencies',
    venue: 'Echoplex',
    city: 'Los Angeles, CA',
    date: 'Sat, May 24',
    time: '9 PM – 3 AM',
    genre: 'Ambient / Experimental',
    capacity: '500 cap',
    attending: 389,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    artists: ['LUNA CROSS', 'DRIFT STATE'],
    color: '#06b6d4',
    featured: false,
    price: '$20',
  },
  {
    id: 3,
    title: 'Underground Collective #07',
    venue: 'Elsewhere Zone One',
    city: 'Brooklyn, NY',
    date: 'Sun, May 25',
    time: '8 PM – 2 AM',
    genre: 'House / Afrobeat',
    capacity: '600 cap',
    attending: 501,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    artists: ['AMARA K', 'DEEP SPACE FIVE', 'RITUAL'],
    color: '#f43f5e',
    featured: false,
    price: '$18',
  },
];

export default function FeaturedEvents() {
  return (
    <section id="events" className="py-24 relative">
      <div className="orb w-[400px] h-[400px] bg-cyan-500/10 bottom-0 left-0 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-cyan-500" />
              <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                Upcoming Events
              </span>
            </div>
            <h2 className="display-md text-white">
              This Weekend <br />
              <span className="gradient-text-cyan">Across the Country</span>
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            View all events
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <div
              key={event.id}
              className={`group cursor-pointer card-hover ${i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}
            >
              <div className="glass rounded-2xl overflow-hidden h-full hover:border-white/15 transition-all duration-300">
                {/* Image */}
                <div className={`relative overflow-hidden ${i === 0 ? 'h-72' : 'h-48'}`}>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {event.featured && (
                    <div className="absolute top-4 left-4 glass rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                        ✦ Featured
                      </span>
                    </div>
                  )}

                  {/* Genre tag */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                      border: `1px solid ${event.color}40`,
                    }}
                  >
                    {event.genre}
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-1 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {event.artists.map((a) => (
                        <span key={a} className="text-xs text-slate-300 glass rounded px-2 py-0.5">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Event details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {event.venue} · {event.city}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Users className="w-3 h-3 text-slate-500" />
                      {event.attending} going · {event.capacity}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-white font-semibold text-sm">{event.price}</span>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: `${event.color}20`,
                        border: `1px solid ${event.color}30`,
                        color: event.color,
                      }}
                    >
                      <Ticket className="w-3 h-3" />
                      Get Tickets
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

const items = [
  'Live Events', 'Booking', 'Collaboration', 'Music Production', 'DJ Sets',
  'Venue Partnerships', 'Residencies', 'Tour Logistics', 'Visual Art', 'Photography',
  'Sound Design', 'Lighting Design', 'Open Calls', 'Local Scenes', 'Underground Culture',
  'Creative Direction', 'Artist Management', 'Festival Slots', 'Studio Sessions', 'Networking',
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative py-5 overflow-hidden border-y border-white/[0.05]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-transparent to-[#060608] z-10 pointer-events-none" />
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
              {item}
            </span>
            <span className="text-purple-600 text-lg">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

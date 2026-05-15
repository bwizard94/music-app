'use client';

import { Zap, Music2, Users, Clock, DollarSign, Volume2, Lightbulb, Camera, Wifi, Car } from 'lucide-react';
import type { VenueData } from './venueData';

interface Props { venue: VenueData; onBook: () => void; }

function SpecBlock({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div>
        <div className="text-slate-600 text-xs mb-0.5">{label}</div>
        <div className="text-slate-200 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function VenueOverview({ venue, onBook }: Props) {
  const color = venue.accentColor;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-5">

        {/* About */}
        <div className="glass rounded-2xl p-6 border border-white/[0.07]">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            About The Blind Pig
          </h3>
          <div className="space-y-3">
            {venue.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-400 text-sm leading-relaxed">{para}</p>
            ))}
          </div>
        </div>

        {/* Tech Specs — Sound */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
            <Volume2 className="w-4 h-4" style={{ color }} />
            <h3 className="text-white font-bold text-sm">Sound System</h3>
            <span className="ml-auto text-xs text-slate-600">Main Room</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SpecBlock icon={Volume2} label="PA System" value={venue.specs.sound.system} color={color} />
            <SpecBlock icon={Volume2} label="Subwoofers" value={venue.specs.sound.subwoofers} color={color} />
            <SpecBlock icon={Volume2} label="Stage Monitors" value={venue.specs.sound.monitors} color={color} />
            <SpecBlock icon={Volume2} label="Mixer" value={venue.specs.sound.mixer} color={color} />
            <SpecBlock icon={Music2} label="DJ Booth" value={venue.specs.sound.djBooth} color={color} />
            <SpecBlock icon={Music2} label="Backline" value={venue.specs.sound.backline} color={color} />
          </div>
        </div>

        {/* Lighting Specs */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
            <Lightbulb className="w-4 h-4" style={{ color }} />
            <h3 className="text-white font-bold text-sm">Lighting & Production</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SpecBlock icon={Lightbulb} label="Console" value={venue.specs.lighting.system} color={color} />
            <SpecBlock icon={Lightbulb} label="Moving Heads" value={venue.specs.lighting.moving} color={color} />
            <SpecBlock icon={Lightbulb} label="Static Lighting" value={venue.specs.lighting.static} color={color} />
            <SpecBlock icon={Zap} label="Laser System" value={venue.specs.lighting.lasers} color={color} />
            <SpecBlock icon={Camera} label="Hazer" value={venue.specs.lighting.hazer} color={color} />
            <SpecBlock icon={Lightbulb} label="Custom Rigs" value={venue.specs.lighting.customRigs ? 'Available on request' : 'Not available'} color={color} />
          </div>
        </div>

        {/* Venue Rooms */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
            <Users className="w-4 h-4" style={{ color }} />
            <h3 className="text-white font-bold text-sm">Rooms & Spaces</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Main Room', data: venue.specs.mainRoom },
              { label: 'Basement Stage', data: venue.specs.basement },
            ].map(({ label, data }) => (
              <div
                key={label}
                className="rounded-xl p-4 border"
                style={{ backgroundColor: `${color}06`, borderColor: `${color}18` }}
              >
                <h4 className="text-white font-bold text-sm mb-3">{label}</h4>
                <div className="space-y-2">
                  {[
                    { k: 'Capacity', v: `${data.capacity} persons` },
                    { k: 'Stage', v: data.stageDimensions },
                    { k: 'Ceiling', v: data.ceilingHeight },
                    { k: 'Dance Floor', v: data.danceFloor },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-slate-600">{k}</span>
                      <span className="text-slate-300 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production amenities */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h3 className="text-white font-bold text-sm mb-4">Production Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Private Green Room' },
              { icon: Car, label: 'Loading Dock' },
              { icon: Wifi, label: 'Dedicated WiFi' },
              { icon: Camera, label: 'Rider Fulfillment' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                style={{ backgroundColor: `${color}08`, border: `1px solid ${color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
                <span className="text-xs text-slate-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right sidebar ─────────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Book CTA card */}
        <div
          className="rounded-2xl p-5 border relative overflow-hidden"
          style={{ backgroundColor: `${color}08`, borderColor: `${color}22` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
            style={{ backgroundColor: color, opacity: 0.12 }} />
          <h4 className="text-white font-bold text-base mb-1 relative">Book The Blind Pig</h4>
          <p className="text-slate-400 text-xs mb-4 relative leading-relaxed">
            Submit a booking proposal. We review all submissions within 72 hours.
          </p>
          <button
            onClick={onBook}
            className="relative w-full font-bold text-white py-3 rounded-xl overflow-hidden group text-sm"
          >
            <div className="absolute inset-0 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }} />
            <span className="relative flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-white" />
              Submit Booking Proposal
            </span>
          </button>
          <div className="mt-3 flex justify-center">
            <span className="text-slate-600 text-xs">Avg response: 48 hours</span>
          </div>
        </div>

        {/* Genres */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Music2 className="w-3.5 h-3.5" style={{ color }} />
            Genres We Host
          </h4>
          <div className="flex flex-wrap gap-2">
            {venue.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ backgroundColor: `${color}12`, color, borderColor: `${color}28` }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Atmosphere</h4>
          <div className="flex flex-wrap gap-2">
            {venue.atmosphere.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/[0.06] bg-white/[0.03]">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Booking preferences */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" style={{ color }} />
            Booking Info
          </h4>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Min. Artist Fee', value: venue.bookingPrefs.minFee },
              { label: 'Advance Booking', value: venue.bookingPrefs.advanceBooking },
              { label: 'Doors Open', value: venue.bookingPrefs.typicalDoorTime },
              { label: 'End Time', value: venue.bookingPrefs.typicalEndTime },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-600">{label}</span>
                <span className="text-slate-200 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <p className="text-xs text-slate-600 mb-2">Formats we book</p>
            <div className="flex flex-wrap gap-1.5">
              {venue.bookingPrefs.formats.map((f) => (
                <span key={f} className="text-xs px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Open slots teaser */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" style={{ color }} />
              Open Slots
            </h4>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {venue.openSlots.length} available
            </span>
          </div>
          <div className="space-y-2">
            {venue.openSlots.slice(0, 3).map((slot) => (
              <div key={slot.date} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-slate-300 font-medium">{slot.date}</span>
                <span className="text-slate-600">{slot.available[0]}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onBook}
            className="w-full mt-3 text-xs font-semibold py-2 rounded-lg border transition-all hover:bg-white/10"
            style={{ borderColor: `${color}30`, color }}
          >
            View all open slots →
          </button>
        </div>

        {/* Contact */}
        <div className="glass rounded-2xl p-5 border border-white/[0.07]">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Contact</h4>
          <div className="space-y-2 text-xs">
            <a href={`mailto:${venue.contact.bookingEmail}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <span className="text-slate-600">Booking:</span>
              <span className="font-medium">{venue.contact.bookingEmail}</span>
            </a>
            <a href={`mailto:${venue.contact.generalEmail}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <span className="text-slate-600">General:</span>
              <span className="font-medium">{venue.contact.generalEmail}</span>
            </a>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600">Phone:</span>
              <span className="font-medium">{venue.contact.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

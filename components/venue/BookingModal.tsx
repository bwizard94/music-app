'use client';

import { useState } from 'react';
import { X, ChevronRight, Check, Zap, CalendarDays, Music2, DollarSign, FileText } from 'lucide-react';
import type { VenueData } from './venueData';

interface Props { venue: VenueData; onClose: () => void; }

const STEPS = ['Date & Format', 'Artist Info', 'Details', 'Submit'];

export default function BookingModal({ venue, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: '',
    format: '',
    artistName: '',
    role: '',
    genre: '',
    soundcloudUrl: '',
    proposedFee: '',
    message: '',
    techRider: false,
  });

  const color = venue.accentColor;
  const canNext = (() => {
    if (step === 0) return form.date.length > 0 && form.format.length > 0;
    if (step === 1) return form.artistName.length > 0 && form.genre.length > 0;
    if (step === 2) return form.message.length > 20;
    return true;
  })();

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative glass rounded-2xl p-10 max-w-md w-full border border-white/[0.1] text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `radial-gradient(circle, ${color}30, ${color}10)`, border: `2px solid ${color}40` }}
          >
            <Check className="w-8 h-8" style={{ color }} />
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Proposal Sent!</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your booking proposal has been submitted to <strong className="text-white">The Blind Pig</strong>.
            They typically respond within 48–72 hours.
          </p>
          <div className="glass rounded-xl p-4 text-left mb-6 border border-white/[0.06]">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-600">Date Requested</span><span className="text-slate-300">{form.date || 'Jun 8, 2025'}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Format</span><span className="text-slate-300">{form.format}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Artist</span><span className="text-slate-300">{form.artistName}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Status</span><span className="text-green-400 font-semibold">Under Review</span></div>
            </div>
          </div>
          <button onClick={onClose} className="w-full relative font-semibold text-white py-3 rounded-xl overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
            <span className="relative">Done</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass rounded-2xl w-full max-w-lg border border-white/[0.1] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-white font-bold text-base">Book The Blind Pig</h2>
            <p className="text-slate-500 text-xs">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/[0.05]">
          <div className="h-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: color }} />
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">

          {/* Step 0: Date & Format */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  <CalendarDays className="inline w-3 h-3 mr-1" />Preferred Date
                </label>
                <select
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm outline-none bg-white/[0.03] border border-white/[0.08]"
                >
                  <option value="" className="bg-[#0c0c14]">Select an open date…</option>
                  {venue.openSlots.map((s) => (
                    <option key={s.date} value={s.date} className="bg-[#0c0c14]">
                      {s.date} — {s.type} ({s.available.join(', ')})
                    </option>
                  ))}
                  <option value="custom" className="bg-[#0c0c14]">Propose a different date</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Booking Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {venue.bookingPrefs.formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => update('format', f)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all border text-left"
                      style={form.format === f
                        ? { backgroundColor: `${color}18`, borderColor: `${color}50`, color }
                        : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#64748b' }
                      }
                    >
                      {form.format === f && <span className="mr-1.5">✓</span>}{f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Artist Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  <Music2 className="inline w-3 h-3 mr-1" />Artist / Act Name
                </label>
                <input
                  value={form.artistName}
                  onChange={(e) => update('artistName', e.target.value)}
                  placeholder="Your artist name or collective"
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  Role / Type
                </label>
                <input
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  placeholder="DJ, Live Act, Producer, AV Artist…"
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  Genre / Style
                </label>
                <input
                  value={form.genre}
                  onChange={(e) => update('genre', e.target.value)}
                  placeholder="Techno, Industrial, Dark Electro…"
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  SoundCloud / Mix Link
                </label>
                <input
                  value={form.soundcloudUrl}
                  onChange={(e) => update('soundcloudUrl', e.target.value)}
                  placeholder="soundcloud.com/yourname or mixcloud.com/…"
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  <DollarSign className="inline w-3 h-3 mr-1" />Proposed Fee
                </label>
                <input
                  value={form.proposedFee}
                  onChange={(e) => update('proposedFee', e.target.value)}
                  placeholder="$300 or negotiable"
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03]"
                />
                <p className="text-slate-700 text-xs mt-1">Venue minimum: {venue.bookingPrefs.minFee}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  <FileText className="inline w-3 h-3 mr-1" />Message to The Blind Pig
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Tell us about yourself, your sound, and why you'd be a great fit for our room…"
                  rows={5}
                  className="w-full glass rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none bg-white/[0.03] resize-none"
                />
                <p className="text-slate-700 text-xs mt-1">{form.message.length} chars (min 20)</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => update('techRider', !form.techRider)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all border ${form.techRider ? 'border-0' : 'border-white/20'}`}
                  style={form.techRider ? { backgroundColor: color } : {}}
                >
                  {form.techRider && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-slate-400 text-sm">I have a technical rider and will supply it upon confirmation</span>
              </label>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 border border-white/[0.06] space-y-3">
                {[
                  { label: 'Date', value: form.date || 'TBD' },
                  { label: 'Format', value: form.format },
                  { label: 'Artist', value: form.artistName },
                  { label: 'Genre', value: form.genre },
                  { label: 'Proposed Fee', value: form.proposedFee || 'Negotiable' },
                  { label: 'Tech Rider', value: form.techRider ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-3 border border-white/[0.06]">
                <p className="text-slate-500 text-xs leading-relaxed">
                  <span className="text-slate-300 font-medium">Your message: </span>
                  {form.message}
                </p>
              </div>
              <p className="text-slate-600 text-xs">
                By submitting, you agree that this is a genuine booking inquiry. Spam proposals result in account suspension.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>

          <button
            disabled={!canNext}
            onClick={() => {
              if (step < STEPS.length - 1) setStep(step + 1);
              else setSubmitted(true);
            }}
            className="relative flex items-center gap-2 font-semibold text-white px-7 py-3 rounded-xl overflow-hidden text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
            <span className="relative">
              {step === STEPS.length - 1 ? 'Submit Proposal' : 'Continue'}
            </span>
            {step < STEPS.length - 1 && <ChevronRight className="relative w-4 h-4" />}
            {step === STEPS.length - 1 && <Zap className="relative w-4 h-4 fill-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}

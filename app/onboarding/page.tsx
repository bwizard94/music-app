'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, ArrowLeft, Check, MapPin, Link as LinkIcon, Target, Sparkles, ChevronRight } from 'lucide-react';
import { ROLE_CONFIGS, ALL_ROLES, type RoleId } from '@/components/onboarding/roleConfig';
import SceneBackground from '@/components/ui/SceneBackground';
import { createOnboardingProfile } from '@/lib/services/profiles';
import { useAuth } from '@/components/providers/AuthProvider';

// ─── Step config ─────────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

interface OnboardingState {
  role: RoleId | null;
  genres: string[];
  city: string;
  specialties: string[];
  goals: string[];
  links: Record<string, string>;
}

const INITIAL_STATE: OnboardingState = {
  role: null,
  genres: [],
  city: '',
  specialties: [],
  goals: [],
  links: {},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ProgressBar({ step, total, color }: { step: number; total: number; color: string }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium">
          Step {step} of {total}
        </span>
        <span className="text-xs font-medium" style={{ color }}>
          {Math.round((step / total) * 100)}% complete
        </span>
      </div>
      <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(step / total) * 100}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            boxShadow: `0 0 12px ${color}60`,
          }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < step ? color : 'rgba(255,255,255,0.1)',
              boxShadow: i === step - 1 ? `0 0 8px ${color}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChipSelect({
  options,
  selected,
  onToggle,
  color,
  max,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  color: string;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        const disabled = !active && max !== undefined && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => !disabled && onToggle(opt)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
              disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-white/30'
            }`}
            style={
              active
                ? {
                    backgroundColor: `${color}20`,
                    borderColor: `${color}60`,
                    color: color,
                    boxShadow: `0 0 16px ${color}25`,
                  }
                : {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#94a3b8',
                  }
            }
          >
            {active && <span className="mr-1.5">✓</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function StepRole({ state, set }: { state: OnboardingState; set: (s: Partial<OnboardingState>) => void }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-2">
          What best describes you?
        </h2>
        <p className="text-slate-500 text-sm">
          Choose your primary role. You can add more later.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_ROLES.map((roleId) => {
          const role = ROLE_CONFIGS[roleId];
          const active = state.role === roleId;
          return (
            <button
              key={roleId}
              type="button"
              onClick={() => set({ role: roleId })}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-300 group ${
                active ? '' : 'hover:border-white/20'
              }`}
              style={
                active
                  ? {
                      backgroundColor: `${role.color}12`,
                      borderColor: `${role.color}50`,
                      boxShadow: `0 0 30px ${role.color}20, inset 0 0 20px ${role.color}08`,
                    }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.07)',
                    }
              }
            >
              {active && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: role.color }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="text-2xl mb-2">{role.emoji}</div>
              <div
                className="font-bold text-sm mb-0.5 transition-colors"
                style={{ color: active ? role.color : '#e2e8f0' }}
              >
                {role.label}
              </div>
              <div className="text-slate-600 text-xs leading-tight">{role.tagline}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepGenres({ state, set, color, genres }: {
  state: OnboardingState; set: (s: Partial<OnboardingState>) => void;
  color: string; genres: string[];
}) {
  const toggle = (g: string) => {
    const next = state.genres.includes(g)
      ? state.genres.filter((x) => x !== g)
      : [...state.genres, g];
    set({ genres: next });
  };
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-2">
          What&apos;s your sound?
        </h2>
        <p className="text-slate-500 text-sm">
          Select up to 6 genres or styles that define your work.
        </p>
      </div>
      <ChipSelect options={genres} selected={state.genres} onToggle={toggle} color={color} max={6} />
      {state.genres.length > 0 && (
        <p className="text-xs mt-4" style={{ color }}>
          {state.genres.length} selected
        </p>
      )}
    </div>
  );
}

function StepLocation({ state, set, color }: {
  state: OnboardingState; set: (s: Partial<OnboardingState>) => void; color: string;
}) {
  const CITY_SUGGESTIONS = [
    'Chicago, IL', 'New York, NY', 'Los Angeles, CA', 'Austin, TX',
    'Detroit, MI', 'Portland, OR', 'Atlanta, GA', 'Nashville, TN',
    'Seattle, WA', 'Miami, FL', 'Denver, CO', 'San Francisco, CA',
    'Brooklyn, NY', 'Philadelphia, PA', 'New Orleans, LA', 'Minneapolis, MN',
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = CITY_SUGGESTIONS.filter((c) =>
    c.toLowerCase().includes(state.city.toLowerCase()) && state.city.length > 0
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-2">
          Where&apos;s your scene?
        </h2>
        <p className="text-slate-500 text-sm">
          Your city connects you to the local network that matters most.
        </p>
      </div>

      {/* City input */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-4 border border-white/[0.08] focus-within:border-white/20 transition-colors">
          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color }} />
          <input
            type="text"
            value={state.city}
            onChange={(e) => { set({ city: e.target.value }); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Start typing your city…"
            className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-base"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-white/[0.08] overflow-hidden z-20">
            {filtered.slice(0, 6).map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={() => { set({ city }); setShowSuggestions(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scene tiles */}
      <div>
        <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest">Active Scenes</p>
        <div className="flex flex-wrap gap-2">
          {CITY_SUGGESTIONS.slice(0, 12).map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => set({ city })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border"
              style={
                state.city === city
                  ? { backgroundColor: `${color}20`, borderColor: `${color}50`, color }
                  : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', color: '#64748b' }
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full pulse-glow"
                style={{ backgroundColor: state.city === city ? color : '#334155' }}
              />
              {city.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepGoals({ state, set, color, goals, specialties }: {
  state: OnboardingState; set: (s: Partial<OnboardingState>) => void;
  color: string; goals: string[]; specialties: string[];
}) {
  const toggleGoal = (g: string) => {
    const next = state.goals.includes(g) ? state.goals.filter((x) => x !== g) : [...state.goals, g];
    set({ goals: next });
  };
  const toggleSpec = (s: string) => {
    const next = state.specialties.includes(s) ? state.specialties.filter((x) => x !== s) : [...state.specialties, s];
    set({ specialties: next });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-2">
          What are you here to do?
        </h2>
        <p className="text-slate-500 text-sm">
          Tell us your goals and specialties — we&apos;ll tailor your experience.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color }} />
            <span className="text-white font-semibold text-sm">Your Goals</span>
            <span className="text-slate-600 text-xs">(pick any)</span>
          </div>
          <ChipSelect options={goals} selected={state.goals} onToggle={toggleGoal} color={color} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color }} />
            <span className="text-white font-semibold text-sm">Your Specialties</span>
            <span className="text-slate-600 text-xs">(pick any)</span>
          </div>
          <ChipSelect options={specialties} selected={state.specialties} onToggle={toggleSpec} color={color} />
        </div>
      </div>
    </div>
  );
}

function StepLinks({ state, set, color, platforms }: {
  state: OnboardingState; set: (s: Partial<OnboardingState>) => void;
  color: string; platforms: { label: string; placeholder: string }[];
}) {
  const updateLink = (label: string, val: string) => {
    set({ links: { ...state.links, [label]: val } });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-2">
          Connect your world.
        </h2>
        <p className="text-slate-500 text-sm">
          Add your links so people can discover your work. All fields are optional.
        </p>
      </div>

      <div className="space-y-3">
        {platforms.map(({ label, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
              {label}
            </label>
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/[0.08] focus-within:border-white/20 transition-colors">
              <LinkIcon className="w-4 h-4 flex-shrink-0 text-slate-600" />
              <input
                type="text"
                value={state.links[label] || ''}
                onChange={(e) => updateLink(label, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 glass rounded-xl p-4 border border-white/[0.06]">
        <p className="text-slate-500 text-xs leading-relaxed">
          <span className="text-slate-300 font-medium">You can skip this for now.</span>{' '}
          Links can always be added or updated from your profile settings after setup is complete.
        </p>
      </div>
    </div>
  );
}

function StepComplete({ state, color, role, onComplete, saving }: {
  state: OnboardingState; color: string; role: NonNullable<OnboardingState['role']>;
  onComplete: () => void; saving: boolean;
}) {
  const cfg = ROLE_CONFIGS[role];
  const filled = [
    state.genres.length > 0,
    state.city.length > 0,
    state.goals.length > 0,
    state.specialties.length > 0,
    Object.values(state.links).some(Boolean),
  ];
  const pct = Math.round((filled.filter(Boolean).length / filled.length) * 100);

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: `radial-gradient(circle, ${color}30, ${color}10)`,
            border: `2px solid ${color}40`,
          }}
        >
          {cfg.emoji}
        </div>
      </div>

      <h2 className="text-white font-bold text-3xl md:text-4xl tracking-tight mb-3">
        You&apos;re in the scene.
      </h2>
      <p className="text-slate-400 text-base mb-8 max-w-sm mx-auto leading-relaxed">
        Your <span style={{ color }} className="font-semibold">{cfg.label}</span> profile is
        ready. Let&apos;s take you to your dashboard.
      </p>

      {/* Profile completeness */}
      <div className="glass rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">Profile Strength</span>
          <span className="font-bold text-sm" style={{ color }}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="space-y-2">
          {[
            { label: 'Role selected', done: true },
            { label: 'Genre / Style', done: state.genres.length > 0 },
            { label: 'City / Location', done: state.city.length > 0 },
            { label: 'Goals & Specialties', done: state.goals.length > 0 },
            { label: 'Platform Links', done: Object.values(state.links).some(Boolean) },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={done ? { backgroundColor: color } : { border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {done && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className={`text-xs ${done ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={saving}
        className="inline-flex items-center gap-3 font-bold text-white px-10 py-4 rounded-xl overflow-hidden group relative disabled:opacity-70"
      >
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
        />
        <span className="relative">{saving ? 'Saving…' : 'Enter Dashboard'}</span>
        <ChevronRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    if (!user) {
      window.location.href = '/dashboard';
      return;
    }
    setSaving(true);
    const slug = (user.email?.split('@')[0] ?? 'user') + '-' + Date.now().toString(36);
    const roleConfig = state.role ? ROLE_CONFIGS[state.role as keyof typeof ROLE_CONFIGS] : null;
    const accentColor = roleConfig?.color ?? '#a855f7';

    await createOnboardingProfile(user.id, {
      role: state.role ?? 'solo_artist',
      displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Artist',
      city: state.city,
      genres: state.genres,
      links: state.links,
      accentColor,
      slug,
    });
    window.location.href = '/dashboard';
  };

  const set = (partial: Partial<OnboardingState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const activeColor = state.role ? ROLE_CONFIGS[state.role].color : '#a855f7';
  const activeConfig = state.role ? ROLE_CONFIGS[state.role] : null;

  const canAdvance = (() => {
    if (step === 1) return state.role !== null;
    if (step === 2) return state.genres.length > 0;
    if (step === 3) return state.city.length > 0;
    return true;
  })();

  const navigate = (dir: 'forward' | 'back') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => dir === 'forward' ? s + 1 : s - 1);
      setAnimating(false);
    }, 280);
  };

  const stepProps = { state, set, color: activeColor };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepRole {...stepProps} />;
      case 2: return <StepGenres {...stepProps} genres={activeConfig?.genres ?? []} />;
      case 3: return <StepLocation {...stepProps} />;
      case 4: return <StepGoals {...stepProps} goals={activeConfig?.goals ?? []} specialties={activeConfig?.specialties ?? []} />;
      case 5: return <StepLinks {...stepProps} platforms={activeConfig?.platforms ?? []} />;
      case 6: return <StepComplete state={state} color={activeColor} role={state.role!} onComplete={handleComplete} saving={saving} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <SceneBackground accentColor={activeColor} intensity="low" />

      {/* Logo */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-bold tracking-tight hidden sm:block">STAGEFRONT</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          Save & exit
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          {step < TOTAL_STEPS && (
            <ProgressBar step={step} total={TOTAL_STEPS - 1} color={activeColor} />
          )}

          {/* Step card */}
          <div
            className="glass rounded-2xl p-7 md:p-10 border border-white/[0.08] transition-all duration-300"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? direction === 'forward' ? 'translateX(24px)' : 'translateX(-24px)'
                : 'translateX(0)',
              boxShadow: `0 0 80px ${activeColor}10`,
            }}
          >
            {/* Role badge (steps 2+) */}
            {step > 1 && step < TOTAL_STEPS && activeConfig && (
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-semibold border"
                style={{
                  backgroundColor: `${activeColor}12`,
                  borderColor: `${activeColor}30`,
                  color: activeColor,
                }}
              >
                <span>{activeConfig.emoji}</span>
                {activeConfig.label}
              </div>
            )}

            {renderStep()}
          </div>

          {/* Navigation */}
          {step < TOTAL_STEPS && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => navigate('back')}
                disabled={step === 1}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-0 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={() => navigate('forward')}
                disabled={!canAdvance}
                className="relative flex items-center gap-2 font-semibold text-white px-8 py-3.5 rounded-xl overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`,
                  }}
                />
                <span className="relative text-sm">
                  {step === TOTAL_STEPS - 1 ? 'Complete Setup' : 'Continue'}
                </span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

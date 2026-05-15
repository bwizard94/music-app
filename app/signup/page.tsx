'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import SceneBackground from '@/components/ui/SceneBackground';
import { signUp } from '@/lib/services/auth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['', '#f43f5e', '#f59e0b', '#06b6d4', '#10b981'][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setError('');
    const { error } = await signUp(form.email, form.password, form.name);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <SceneBackground accentColor="#a855f7" intensity="medium" />

      {/* Logo */}
      <Link href="/" className="fixed top-6 left-6 z-20 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-3xl scale-110" />

        <div className="relative glass rounded-2xl p-8 md:p-10 border border-white/[0.08]">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 pulse-glow" />
              <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
                Free to Join
              </span>
            </div>
            <h1 className="text-white font-bold text-2xl mb-2 tracking-tight">
              Create your account.
            </h1>
            <p className="text-slate-500 text-sm">
              Build your professional presence in the scene.
            </p>
          </div>

          {/* Social sign-up */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                className="flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200 font-medium"
              >
                <span className="font-bold">{provider === 'Google' ? 'G' : ''}</span>
                Continue with {provider}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-600 text-xs">or sign up with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Your Name or Artist Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="NOVA VEGA or Jane Smith"
                required
                className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 transition-colors bg-white/[0.03]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 transition-colors bg-white/[0.03]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Choose a strong password"
                  required
                  className="w-full glass rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 transition-colors bg-white/[0.03]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-0.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= passwordStrength ? strengthColor : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className="flex items-start gap-3 text-left w-full group"
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center mt-0.5 ${
                  agreed
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/20 bg-white/5 group-hover:border-white/40'
                }`}
              >
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-slate-500 text-xs leading-relaxed">
                I agree to Stagefront&apos;s{' '}
                <a href="#" className="text-purple-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                  Privacy Policy
                </a>
              </span>
            </button>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full relative flex items-center justify-center gap-2 font-semibold text-white py-3.5 rounded-xl overflow-hidden group disabled:opacity-50 transition-opacity mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
              {loading ? (
                <span className="relative flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {error && (
            <p className="text-rose-400 text-xs text-center -mt-2">{error}</p>
          )}

          <p className="text-center text-slate-600 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6 tracking-widest uppercase">
          Free Forever · No Credit Card Required
        </p>
      </div>
    </div>
  );
}

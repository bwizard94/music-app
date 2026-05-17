'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, ArrowRight, Music } from 'lucide-react';
import SceneBackground from '@/components/ui/SceneBackground';
import { signIn, signInWithGoogle, signInWithApple } from '@/lib/services/auth';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email above first.');
      return;
    }
    setResetLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile/settings`,
    });
    setResetSent(true);
    setResetLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <SceneBackground accentColor="#a855f7" intensity="medium" />

      {/* Logo */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-20 flex items-center gap-2 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow behind card */}
        <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-3xl scale-110" />

        <div className="relative glass rounded-2xl p-8 md:p-10 border border-white/[0.08]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
              <Music className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-white font-bold text-2xl mb-2 tracking-tight">
              Welcome back.
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to your Stagefront account
            </p>
          </div>

          {/* Social sign-in */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200 font-medium"
            >
              <span className="text-base">G</span>
              Continue with Google
            </button>
            <button
              onClick={() => signInWithApple()}
              className="flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200 font-medium"
            >
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-600 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full glass rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 transition-colors bg-white/[0.03]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-xs text-slate-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  {resetSent ? 'Reset email sent!' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-2 font-semibold text-white py-3.5 rounded-xl overflow-hidden group disabled:opacity-70 transition-opacity mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
              {loading ? (
                <span className="relative flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {error && (
            <p className="text-rose-400 text-xs text-center -mt-2">{error}</p>
          )}

          {/* Footer */}
          <p className="text-center text-slate-600 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Join the scene
            </Link>
          </p>
        </div>

        {/* Scene label */}
        <p className="text-center text-slate-700 text-xs mt-6 tracking-widest uppercase">
          Professional Network · Live Entertainment Industry
        </p>
      </div>
    </div>
  );
}

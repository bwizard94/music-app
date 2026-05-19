'use client';

import { useState, useCallback } from 'react';
import { Zap } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ToastProvider } from '@/components/ui/Toast';

const CORRECT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? 'stagefront2025';
const PIN_KEY = 'sf_admin_pin';
const PIN_TS_KEY = 'sf_admin_pin_ts';
const PIN_ATTEMPTS_KEY = 'sf_admin_attempts';
const PIN_LOCKOUT_KEY = 'sf_admin_lockout';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const SESSION_MS = 8 * 60 * 60 * 1000;

function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  const storedPin = localStorage.getItem(PIN_KEY);
  const storedTs = parseInt(localStorage.getItem(PIN_TS_KEY) ?? '0', 10);
  if (storedPin !== CORRECT_PIN) return false;
  if (Date.now() - storedTs > SESSION_MS) {
    localStorage.removeItem(PIN_KEY);
    localStorage.removeItem(PIN_TS_KEY);
    return false;
  }
  return true;
}

function getLockoutRemainingMs(): number {
  if (typeof window === 'undefined') return 0;
  const lockoutUntil = parseInt(localStorage.getItem(PIN_LOCKOUT_KEY) ?? '0', 10);
  const remaining = lockoutUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

function getAttempts(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(PIN_ATTEMPTS_KEY) ?? '0', 10);
}

function recordFailedAttempt(): { attempts: number; locked: boolean } {
  const attempts = getAttempts() + 1;
  localStorage.setItem(PIN_ATTEMPTS_KEY, String(attempts));
  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(PIN_LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
    localStorage.setItem(PIN_ATTEMPTS_KEY, '0');
    return { attempts, locked: true };
  }
  return { attempts, locked: false };
}

function clearAttempts(): void {
  localStorage.removeItem(PIN_ATTEMPTS_KEY);
  localStorage.removeItem(PIN_LOCKOUT_KEY);
}

function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [lockoutMs, setLockoutMs] = useState(() => getLockoutRemainingMs());

  const refreshLockout = useCallback(() => {
    const remaining = getLockoutRemainingMs();
    setLockoutMs(remaining);
    return remaining;
  }, []);

  const handleSubmit = useCallback(() => {
    if (refreshLockout() > 0) return;

    if (pin === CORRECT_PIN) {
      localStorage.setItem(PIN_KEY, pin);
      localStorage.setItem(PIN_TS_KEY, String(Date.now()));
      clearAttempts();
      onUnlock();
    } else {
      const { attempts, locked } = recordFailedAttempt();
      setShake(true);
      setPin('');
      if (locked) {
        setError('Too many attempts. Try again in 15 minutes.');
        setLockoutMs(LOCKOUT_MS);
      } else {
        const remaining = MAX_ATTEMPTS - attempts;
        setError(`Incorrect PIN. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      }
      setTimeout(() => { setShake(false); }, 800);
    }
  }, [pin, onUnlock, refreshLockout]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const lockoutMinutes = Math.ceil(lockoutMs / 60000);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#060608' }}
    >
      <div
        className="glass rounded-2xl border border-white/[0.07] p-10 w-full max-w-sm"
        style={{ animation: shake ? 'shake 0.4s ease' : undefined }}
      >
        <div className="flex items-center gap-3 justify-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="text-white font-bold tracking-tight">STAGEFRONT</div>
            <div className="text-xs tracking-widest" style={{ color: '#f59e0b' }}>ADMIN</div>
          </div>
        </div>

        <h2 className="text-white text-lg font-semibold text-center mb-1">Platform Control</h2>
        <p className="text-slate-500 text-sm text-center mb-8">Enter your admin PIN to continue</p>

        {lockoutMs > 0 ? (
          <div className="text-center py-4">
            <p className="text-rose-400 text-sm font-semibold mb-1">Account locked</p>
            <p className="text-slate-500 text-xs">
              Too many failed attempts. Try again in {lockoutMinutes} minute{lockoutMinutes !== 1 ? 's' : ''}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Admin PIN"
              autoFocus
              maxLength={64}
              className="w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors"
              style={{
                borderColor: error ? '#f43f5e' : 'rgba(255,255,255,0.08)',
              }}
            />
            {error && (
              <p className="text-xs text-center" style={{ color: '#f43f5e' }}>
                {error}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!pin}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
            >
              Unlock Admin Panel
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    return isSessionValid();
  });

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (unlocked === null) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#060608' }} />
    );
  }

  if (!unlocked) {
    return (
      <ToastProvider>
        <PinScreen onUnlock={handleUnlock} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex" style={{ backgroundColor: '#060608' }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}

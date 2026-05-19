'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ToastProvider } from '@/components/ui/Toast';

const CORRECT_PIN = 'stagefront2025';
const PIN_KEY = 'sf_admin_pin';

function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(() => {
    if (pin === CORRECT_PIN) {
      localStorage.setItem(PIN_KEY, pin);
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setPin('');
      setTimeout(() => { setShake(false); setError(false); }, 800);
    }
  }, [pin, onUnlock]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#060608' }}
    >
      <div
        className="glass rounded-2xl border border-white/[0.07] p-10 w-full max-w-sm"
        style={{ animation: shake ? 'shake 0.4s ease' : undefined }}
      >
        {/* Logo */}
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

        <div className="space-y-3">
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            onKeyDown={handleKeyDown}
            placeholder="Admin PIN"
            autoFocus
            className="w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors"
            style={{
              borderColor: error ? '#f43f5e' : 'rgba(255,255,255,0.08)',
            }}
          />
          {error && (
            <p className="text-xs text-center" style={{ color: '#f43f5e' }}>
              Incorrect PIN. Try again.
            </p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-75"
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
          >
            Unlock Admin Panel
          </button>
        </div>
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
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PIN_KEY);
    setUnlocked(stored === CORRECT_PIN);
  }, []);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  // Avoid flash before checking localStorage
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

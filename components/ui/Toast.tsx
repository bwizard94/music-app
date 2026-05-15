'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
  exiting?: boolean;
}

interface ToastCtx {
  toast: (opts: Omit<ToastItem, 'id' | 'exiting'>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ToastType, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}> = {
  success: { icon: CheckCircle2, color: '#10b981', bg: '#10b98115', border: '#10b98130' },
  error:   { icon: XCircle,      color: '#f43f5e', bg: '#f43f5e15', border: '#f43f5e30' },
  warning: { icon: AlertTriangle,color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b30' },
  info:    { icon: Info,         color: '#a855f7', bg: '#a855f715', border: '#a855f730' },
};

// ─── Single toast ─────────────────────────────────────────────────────────────

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { icon: Icon, color, bg, border } = TYPE_CONFIG[item.type];
  const duration = item.duration ?? 4000;
  const [progress, setProgress] = useState(100);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (item.exiting) return;
    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [duration, item.exiting]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl w-80 ${item.exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ backgroundColor: bg, borderColor: border }}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-snug">{item.title}</p>
          {item.message && (
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.message}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(item.id)}
          className="flex-shrink-0 text-slate-500 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full">
        <div
          className="h-full transition-none rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 320);
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, 'id' | 'exiting'>) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = { ...opts, id };
    setToasts((prev) => [...prev.slice(-2), item]); // max 3
    const duration = opts.duration ?? 4000;
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 items-end pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Toast item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

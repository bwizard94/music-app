'use client';

import { useEffect, type ReactNode } from 'react';
import { AlertTriangle, X, Trash2, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm?: () => void;
  loading?: boolean;
  children?: ReactNode;
  icon?: 'warning' | 'danger' | 'success';
}

export function Modal({
  open, onClose, title, description, confirmLabel = 'Confirm',
  confirmVariant = 'primary', onConfirm, loading, children, icon = 'warning',
}: ModalProps) {
  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const iconConfig = {
    warning: { icon: AlertTriangle, color: '#f59e0b', bg: '#f59e0b15' },
    danger:  { icon: Trash2,        color: '#f43f5e', bg: '#f43f5e15' },
    success: { icon: CheckCircle2,  color: '#10b981', bg: '#10b98115' },
  }[icon];
  const Icon = iconConfig.icon;

  const confirmColors = confirmVariant === 'danger'
    ? 'bg-rose-500 hover:bg-rose-600 text-white'
    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md modal-panel">
        <div className="glass-strong rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition-all btn-press"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon + header */}
          <div className="p-6 pb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: iconConfig.bg }}
            >
              <Icon className="w-6 h-6" style={{ color: iconConfig.color }} />
            </div>
            <h2 className="text-white font-bold text-lg leading-snug">{title}</h2>
            {description && (
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Custom content */}
          {children && <div className="px-6 pb-4">{children}</div>}

          {/* Actions */}
          {onConfirm && (
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all btn-press"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all btn-press disabled:opacity-50 ${confirmColors}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </span>
                ) : confirmLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

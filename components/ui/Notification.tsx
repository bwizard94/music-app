'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, X, CheckCheck, FileText, MessageSquare,
  Users, CalendarDays, Zap, CheckCircle2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'booking' | 'collab' | 'message' | 'proposal' | 'system';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
  avatar?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFS: Notif[] = [
  {
    id: 'n1', type: 'booking', read: false,
    title: 'New booking request',
    body: 'The Blind Pig wants to book you for Fri May 30 — Dark Techno Night',
    time: '2m ago', href: '/proposals',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80',
  },
  {
    id: 'n2', type: 'collab', read: false,
    title: 'Collaboration invite',
    body: 'LUX invited you to join NEURAL DRIFT as support act',
    time: '18m ago', href: '/messages',
    avatar: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&q=80',
  },
  {
    id: 'n3', type: 'message', read: false,
    title: 'New message from Marcus Bell',
    body: '"Hey — are you free for a call this week to discuss the lineup?"',
    time: '1h ago', href: '/messages',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
  },
  {
    id: 'n4', type: 'proposal', read: false,
    title: 'Proposal update',
    body: 'Smart Bar accepted your SIGNAL COLLAPSE proposal',
    time: '3h ago', href: '/proposals',
  },
  {
    id: 'n5', type: 'collab', read: true,
    title: 'Kira Sólaris connected with you',
    body: 'You are now connected — start a conversation',
    time: '1d ago', href: '/messages',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
  },
  {
    id: 'n6', type: 'system', read: true,
    title: 'Profile 80% complete',
    body: 'Add your technical rider to reach 90% and unlock more features',
    time: '2d ago', href: '/profile/settings',
  },
];

const TYPE_ICON: Record<NotifType, React.ElementType> = {
  booking:  CalendarDays,
  collab:   Users,
  message:  MessageSquare,
  proposal: FileText,
  system:   Zap,
};

const TYPE_COLOR: Record<NotifType, string> = {
  booking:  '#a855f7',
  collab:   '#06b6d4',
  message:  '#10b981',
  proposal: '#f43f5e',
  system:   '#f59e0b',
};

// ─── Notification item ────────────────────────────────────────────────────────

function NotifItem({ notif, onDismiss }: { notif: Notif; onDismiss: (id: string) => void }) {
  const Icon = TYPE_ICON[notif.type];
  const color = TYPE_COLOR[notif.type];

  return (
    <Link
      href={notif.href}
      className={`group flex items-start gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors relative ${
        !notif.read ? 'bg-white/[0.02]' : ''
      }`}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Avatar or icon */}
      <div className="relative flex-shrink-0">
        {notif.avatar ? (
          <img src={notif.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
        ) : (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color }} />
          </div>
        )}
        {/* Type overlay icon on avatar */}
        {notif.avatar && (
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border border-[#0c0c14]"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-snug ${notif.read ? 'text-slate-300' : 'text-white'}`}>
          {notif.title}
        </p>
        <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
        <p className="text-slate-600 text-[10px] mt-1">{notif.time}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(notif.id); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] flex items-center justify-center text-slate-500 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </Link>
  );
}

// ─── Notification center ──────────────────────────────────────────────────────

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative w-9 h-9 glass rounded-xl flex items-center justify-center transition-all border btn-press ${
          open
            ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
            : 'border-white/[0.06] hover:border-white/[0.14] text-slate-400 hover:text-white'
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-purple-500 text-white text-[9px] font-black flex items-center justify-center border border-[#060608] badge-new">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl border border-white/[0.12] overflow-hidden shadow-2xl z-50"
          style={{ animation: 'modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">Notifications</span>
              {unread > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-white/[0.04]">
            {notifs.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-xs">All caught up!</p>
              </div>
            ) : (
              notifs.map((n) => (
                <NotifItem key={n.id} notif={n} onDismiss={dismiss} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.05] px-4 py-3">
            <Link
              href="/notifications"
              className="text-xs text-center text-slate-500 hover:text-purple-400 transition-colors block"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

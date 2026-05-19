'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, BarChart3, Users, ShieldCheck, Flag,
  MapPin, Star, FileText, Clock, ArrowLeft,
} from 'lucide-react';
import { ADMIN_WAITLIST, VERIFICATION_QUEUE, REPORTS } from '@/lib/data/admin';

const pendingVerifications = VERIFICATION_QUEUE.filter((v) => v.status === 'pending').length;
const pendingReports = REPORTS.filter((r) => r.status === 'pending').length;
const pendingWaitlist = ADMIN_WAITLIST.filter((w) => w.status === 'pending').length;

const NAV_ITEMS = [
  { icon: BarChart3,   label: 'Overview',     href: '/admin/metrics',      badge: null },
  { icon: Users,       label: 'Users',         href: '/admin/users',        badge: null },
  { icon: ShieldCheck, label: 'Verification',  href: '/admin/verification', badge: String(pendingVerifications) },
  { icon: Flag,        label: 'Reports',       href: '/admin/reports',      badge: String(pendingReports) },
  { icon: MapPin,      label: 'Scenes',        href: '/admin/scenes',       badge: null },
  { icon: Star,        label: 'Featured',      href: '/admin/featured',     badge: null },
  { icon: FileText,    label: 'Proposals',     href: '/admin/proposals',    badge: null },
  { icon: Clock,       label: 'Waitlist',      href: '/admin/waitlist',     badge: String(pendingWaitlist) },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 bg-[#08080f] border-r border-white/[0.05] h-screen sticky top-0"
      style={{ width: 220 }}
    >
      {/* Header */}
      <div className="px-5 py-5 mb-2">
        <div className="flex items-center gap-2.5 mb-0.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span
            className="font-bold text-sm tracking-widest"
            style={{ color: '#f59e0b' }}
          >
            ADMIN
          </span>
        </div>
        <p className="text-slate-500 text-xs pl-9">Platform Control</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-2 mb-2">
          Management
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={active ? {
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              } : {
                color: '#64748b',
                border: '1px solid transparent',
              }}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? '#f59e0b' : '#475569' }}
              />
              <span className="flex-1">{label}</span>
              {badge && badge !== '0' && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={active
                    ? { backgroundColor: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24' }
                    : { backgroundColor: 'rgba(255,255,255,0.07)', color: '#64748b' }
                  }
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5">
        <div className="h-px bg-white/[0.05] mb-3" />
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}

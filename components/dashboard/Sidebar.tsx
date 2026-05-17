'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, LayoutDashboard, Search, CalendarDays, Users,
  MessageSquare, Bookmark, Settings, Bell, ChevronRight,
  Music2, MapPin, Sparkles, Menu, X, FileText, Building2,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard',   badge: null },
  { icon: Search,          label: 'Discover',      href: '/discover',    badge: null },
  { icon: MapPin,          label: 'Scene Hubs',    href: '/scene',       badge: null },
  { icon: CalendarDays,    label: 'Show Builder',  href: '/show-builder',badge: null },
  { icon: FileText,        label: 'Proposals',     href: '/proposals',   badge: '3' },
  { icon: MessageSquare,   label: 'Messages',      href: '/messages',    badge: '11' },
];

const QUICK_LINKS = [
  { icon: Music2,     label: 'Open Calls',       href: '/board',            badge: '12 new' },
  { icon: MapPin,     label: 'Chicago Scene',    href: '/scene/chicago',    badge: null },
  { icon: Building2,  label: 'Venue Inbox',      href: '/venue/proposals',  badge: '5' },
  { icon: Sparkles,   label: 'New Proposal',     href: '/proposals/new',    badge: null },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { profile, profileSlug } = useAuth();
  const myProfileHref = profileSlug ? `/profile/${profileSlug}` : '/profile/settings';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-bold tracking-tight">STAGEFRONT</span>
      </div>

      {/* User card */}
      <div className="mx-3 mb-5">
        <Link href={myProfileHref} className="glass rounded-xl p-3 flex items-center gap-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors block">
          <div className="relative w-9 h-9 flex-shrink-0">
            <img
              src={profile?.avatar_url ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"}
              alt="User"
              className="w-full h-full rounded-lg object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0c0c14]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm truncate">{profile?.display_name ?? 'My Profile'}</div>
            <div className="text-slate-500 text-xs">DJ · Chicago, IL</div>
          </div>
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <ChevronRight className="w-3 h-3 text-purple-400" />
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-2 mb-2">
          Main
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-purple-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-slate-500'
                }`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick links */}
        <div className="pt-5 pb-2">
          <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-2 mb-2">
            Quick Links
          </p>
          {QUICK_LINKS.map(({ icon: Icon, label, href, badge }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] text-purple-400 font-semibold">{badge}</span>
              )}
            </a>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        <Link
          href="/profile/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        {/* Profile complete nudge */}
        <div className="glass rounded-xl p-3 mt-3 border border-amber-500/15">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <span className="text-amber-400 text-xs font-semibold">Complete your profile</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
            <div className="h-full w-[60%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
          </div>
          <p className="text-slate-600 text-xs">60% complete · 3 items left</p>
          <Link
            href="/signup"
            className="mt-2 block text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#08080f] border-r border-white/[0.05] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#060608]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">STAGEFRONT</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative text-slate-400 hover:text-white transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-[#08080f] border-r border-white/[0.06] transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="pt-16 h-full overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>
      </div>
    </>
  );
}

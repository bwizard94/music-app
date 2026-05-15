'use client';

import { Search, Plus, LogOut } from 'lucide-react';
import { NotificationCenter } from '@/components/ui/Notification';
import { signOut } from '@/lib/services/auth';
import { useAuth } from '@/components/providers/AuthProvider';

export default function TopBar() {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <Search className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search artists, venues, events…"
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
            />
            <kbd className="text-[10px] text-slate-700 border border-white/[0.08] rounded px-1.5 py-0.5 font-mono hidden sm:block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 relative font-semibold text-white text-xs px-4 py-2.5 rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-500" />
            <Plus className="relative w-3.5 h-3.5" />
            <span className="relative">Post Opportunity</span>
          </a>

          <NotificationCenter />

          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/[0.1] cursor-pointer hover:border-purple-500/50 transition-colors">
            <img
              src={profile?.avatar_url ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

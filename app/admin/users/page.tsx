'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { ADMIN_USERS } from '@/lib/data/admin';
import type { AdminUser, UserStatus } from '@/lib/data/admin';

type TabFilter = 'all' | UserStatus;

const STATUS_COLOR: Record<UserStatus, string> = {
  active: '#10b981',
  suspended: '#f43f5e',
  pending: '#f59e0b',
};

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesTab = tab === 'all' || u.status === tab;
      return matchesSearch && matchesTab;
    });
  }, [users, search, tab]);

  const counts = useMemo(() => ({
    all: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    pending: users.filter((u) => u.status === 'pending').length,
  }), [users]);

  const toggleSuspend = (user: AdminUser) => {
    const next: UserStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u));
    toast({
      type: next === 'suspended' ? 'warning' : 'success',
      title: next === 'suspended' ? `${user.name} suspended` : `${user.name} reactivated`,
    });
  };

  const handleDropdownAction = (user: AdminUser, action: string) => {
    setOpenDropdown(null);
    if (action === 'pro') {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, proMember: !u.proMember } : u));
      toast({ type: 'success', title: user.proMember ? `Pro removed from ${user.name}` : `${user.name} is now Pro` });
    } else if (action === 'reset') {
      toast({ type: 'info', title: `Password reset email sent to ${user.email}` });
    } else if (action === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast({ type: 'warning', title: `${user.name} deleted` });
    }
  };

  const TABS: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'suspended', label: 'Suspended' },
    { key: 'pending', label: 'Pending' },
  ];

  return (
    <>
      <AdminTopBar title="Users" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary bar */}
        <div className="flex items-center gap-6">
          {TABS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <div className="text-white font-bold text-lg">{counts[key]}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none"
          />
          <div className="flex gap-1">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={tab === key
                  ? { backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
                  : { color: '#64748b', border: '1px solid transparent' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.05]">
            {['User', 'Role / City', 'Status', 'Joined', 'Last Seen', 'Props', 'Actions'].map((h) => (
              <div key={h} className="text-xs text-slate-600 font-semibold uppercase tracking-wide">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              {/* Avatar + name */}
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-sm font-medium truncate">{user.name}</span>
                  {user.verified && <span className="text-[10px] text-cyan-400 font-semibold">✓</span>}
                  {user.proMember && (
                    <span className="text-[10px] px-1 rounded font-semibold" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>PRO</span>
                  )}
                </div>
                <div className="text-slate-500 text-xs truncate">{user.email}</div>
              </div>

              {/* Role + city */}
              <div className="text-right">
                <div className="text-slate-300 text-xs">{user.role}</div>
                <div className="text-slate-600 text-xs">{user.city}</div>
              </div>

              {/* Status */}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                style={{
                  backgroundColor: `${STATUS_COLOR[user.status]}18`,
                  color: STATUS_COLOR[user.status],
                }}
              >
                {user.status}
              </span>

              {/* Joined */}
              <span className="text-slate-500 text-xs whitespace-nowrap">{user.joinedAt}</span>

              {/* Last seen */}
              <span className="text-slate-500 text-xs whitespace-nowrap">{user.lastSeen}</span>

              {/* Proposals */}
              <span className="text-slate-400 text-xs text-center">{user.proposals}</span>

              {/* Actions — this col is outside the grid definition; let's do inline flex */}
              <div className="flex items-center gap-1 relative">
                <a
                  href={`/profile/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors"
                  title="View profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => toggleSuspend(user)}
                  className="px-2 py-1 rounded-lg text-xs font-medium transition-all"
                  style={user.status === 'suspended'
                    ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }
                    : { backgroundColor: 'rgba(244,63,94,0.1)', color: '#f43f5e' }
                  }
                >
                  {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {openDropdown === user.id && (
                    <div
                      className="absolute right-0 top-8 z-20 glass rounded-xl border border-white/[0.1] py-1 min-w-[140px]"
                      style={{ backgroundColor: '#0f0f1a' }}
                    >
                      {[
                        { key: 'reset', label: 'Reset Password' },
                        { key: 'pro', label: user.proMember ? 'Remove Pro' : 'Make Pro' },
                        { key: 'delete', label: 'Delete User' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => handleDropdownAction(user, key)}
                          className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                          style={key === 'delete' ? { color: '#f43f5e' } : {}}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

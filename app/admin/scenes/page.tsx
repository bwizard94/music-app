'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { ADMIN_CITIES } from '@/lib/data/admin';
import type { AdminCity, CityStatus } from '@/lib/data/admin';

export default function ScenesPage() {
  const { toast } = useToast();
  const [cities, setCities] = useState<AdminCity[]>(ADMIN_CITIES);
  const [launching, setLaunching] = useState<string | null>(null);

  const STATUS_COLOR: Record<CityStatus, string> = {
    active: '#10b981',
    launching: '#f59e0b',
    waitlist: '#475569',
  };

  const setStatus = (id: string, status: CityStatus) => {
    setCities((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  };

  const confirmLaunch = (city: AdminCity) => {
    setStatus(city.id, 'launching');
    setLaunching(null);
    toast({
      type: 'success',
      title: `${city.name} is now launching`,
      message: 'Waitlisted users will be notified.',
    });
  };

  return (
    <>
      <AdminTopBar title="Scenes" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{cities.length} cities tracked</p>
          <button
            onClick={() => toast({ type: 'info', title: 'Add City — coming soon' })}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            + Add City
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {cities.map((city) => (
            <div key={city.id} className="glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{city.name}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                  style={{
                    backgroundColor: `${STATUS_COLOR[city.status]}18`,
                    color: STATUS_COLOR[city.status],
                  }}
                >
                  {city.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Artists', value: city.artists.toLocaleString() },
                  { label: 'Venues', value: city.venues.toLocaleString() },
                  { label: 'Events', value: city.events.toLocaleString() },
                  { label: 'Waitlist', value: city.waitlistCount.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/[0.03] rounded-xl px-3 py-2">
                    <div className="text-white text-sm font-semibold">{value}</div>
                    <div className="text-slate-600 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              <div className="text-slate-500 text-xs">{city.trend}</div>
              {city.launchDate && (
                <div className="text-xs" style={{ color: '#f59e0b' }}>Launch: {city.launchDate}</div>
              )}

              {/* Status toggle */}
              <div className="flex gap-1">
                {(['active', 'launching', 'waitlist'] as CityStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(city.id, s)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                    style={city.status === s
                      ? { backgroundColor: `${STATUS_COLOR[s]}20`, color: STATUS_COLOR[s] }
                      : { color: '#475569', backgroundColor: 'rgba(255,255,255,0.03)' }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toast({ type: 'success', title: `${city.name} set as featured city` })}
                  className="flex-1 py-2 rounded-xl text-xs font-medium border transition-colors"
                  style={{ borderColor: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}
                >
                  Set Featured
                </button>
                <Link
                  href={`/scene/${city.id}`}
                  className="flex-1 py-2 rounded-xl text-xs font-medium border border-white/[0.08] text-slate-400 hover:text-white text-center transition-colors"
                >
                  View Hub
                </Link>
              </div>

              {/* Launch button for waitlist cities */}
              {city.status === 'waitlist' && (
                <div>
                  {launching === city.id ? (
                    <div className="glass rounded-xl border border-white/[0.1] p-3 space-y-2">
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Launch <strong>{city.name}</strong> on Stagefront? This will open the scene hub and notify all waitlisted users.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmLaunch(city)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ backgroundColor: '#10b981', color: '#fff' }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setLaunching(null)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLaunching(city.id)}
                      className="w-full py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#f59e0b', color: '#000' }}
                    >
                      Launch {city.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

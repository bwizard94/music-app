'use client';

import { useState } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useToast } from '@/components/ui/Toast';
import { FEATURED_SLOTS } from '@/lib/data/admin';
import type { FeaturedSlot } from '@/lib/data/admin';
import { ARTISTS } from '@/lib/data/artists';
import { VENUES } from '@/lib/data/venues';

type SectionTab = 'artists' | 'venues';

const SLOT_COUNT: Record<SectionTab, number> = { artists: 3, venues: 2 };

export default function FeaturedPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<SectionTab>('artists');
  const [slots, setSlots] = useState<(FeaturedSlot | null)[][]>(() => ({
    artists: buildSlots('artists'),
    venues: buildSlots('venues'),
  }) as unknown as (FeaturedSlot | null)[][]);
  const [slotMap, setSlotMap] = useState<Record<SectionTab, (FeaturedSlot | null)[]>>({
    artists: buildSlots('artists'),
    venues: buildSlots('venues'),
  });
  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  function buildSlots(section: SectionTab): (FeaturedSlot | null)[] {
    const count = SLOT_COUNT[section];
    const active = FEATURED_SLOTS.filter((s) => s.section === section && s.active);
    return Array.from({ length: count }, (_, i) => active[i] ?? null);
  }

  const currentSlots = slotMap[tab];

  const handleAddSearch = (slotIndex: number) => {
    setSearchOpen(slotIndex);
    setSearchQuery('');
  };

  const handleSelect = (slotIndex: number, entity: { name: string; image: string; slug: string; type: SectionTab extends 'artists' ? 'artist' : 'venue' }) => {
    const newSlot: FeaturedSlot = {
      id: `new-${Date.now()}`,
      section: tab,
      entityName: entity.name,
      entityImage: entity.image,
      entityType: tab === 'artists' ? 'artist' : 'venue',
      entitySlug: entity.slug,
      startDate: 'May 18, 2025',
      endDate: 'Jun 1, 2025',
      active: true,
    };
    setSlotMap((prev) => {
      const updated = [...prev[tab]];
      updated[slotIndex] = newSlot;
      return { ...prev, [tab]: updated };
    });
    setSearchOpen(null);
    toast({ type: 'success', title: `${entity.name} added to featured` });
  };

  const handleRemove = (slotIndex: number) => {
    const slot = currentSlots[slotIndex];
    setSlotMap((prev) => {
      const updated = [...prev[tab]];
      updated[slotIndex] = null;
      return { ...prev, [tab]: updated };
    });
    toast({ type: 'warning', title: `${slot?.entityName ?? 'Slot'} removed from featured` });
  };

  const searchResults = tab === 'artists'
    ? ARTISTS.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : VENUES.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);

  const upcoming = FEATURED_SLOTS.filter((s) => !s.active);

  return (
    <>
      <AdminTopBar title="Featured" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1">
          {(['artists', 'venues'] as SectionTab[]).map((s) => (
            <button
              key={s}
              onClick={() => { setTab(s); setSearchOpen(null); }}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={tab === s
                ? { backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
                : { color: '#64748b', border: '1px solid transparent' }
              }
            >
              {s}
            </button>
          ))}
        </div>

        {/* Slots grid */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 capitalize">Featured {tab}</h3>
          <div className="grid grid-cols-3 gap-4">
            {currentSlots.map((slot, i) => (
              <div key={i}>
                {slot ? (
                  <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
                    <div className="relative">
                      <img src={slot.entityImage} alt={slot.entityName} className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: 'rgba(16,185,129,0.9)', color: '#fff' }}
                        >
                          Live
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-semibold">{slot.entityName}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{slot.startDate} – {slot.endDate}</p>
                      <button
                        onClick={() => handleRemove(i)}
                        className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-slate-500 hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => handleAddSearch(i)}
                      className="w-full rounded-2xl border-2 border-dashed border-white/[0.1] p-8 text-center hover:border-amber-500/30 transition-colors group"
                    >
                      <div className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm">
                        + Add {tab === 'artists' ? 'Artist' : 'Venue'}
                      </div>
                    </button>
                    {searchOpen === i && (
                      <div className="mt-2 glass rounded-2xl border border-white/[0.1] p-3 space-y-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={`Search ${tab}…`}
                          autoFocus
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm placeholder-slate-600 outline-none"
                        />
                        <div className="space-y-1">
                          {searchResults.map((r) => {
                            const isArtist = tab === 'artists';
                            const name = r.name;
                            const image = isArtist ? (r as typeof ARTISTS[0]).image : (r as typeof VENUES[0]).coverImage;
                            const slug = isArtist ? (r as typeof ARTISTS[0]).slug : (r as typeof VENUES[0]).slug;
                            return (
                              <button
                                key={r.id}
                                onClick={() => handleSelect(i, { name, image, slug, type: isArtist ? 'artist' : 'venue' } as Parameters<typeof handleSelect>[1])}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-left"
                              >
                                <img src={image} alt={name} className="w-6 h-6 rounded object-cover" />
                                <span className="text-slate-300 text-sm">{name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled */}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Scheduled</h3>
            <div className="glass rounded-2xl border border-white/[0.07] divide-y divide-white/[0.04]">
              {upcoming.map((slot) => (
                <div key={slot.id} className="flex items-center gap-4 px-4 py-3">
                  <img src={slot.entityImage} alt={slot.entityName} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <span className="text-white text-sm font-medium">{slot.entityName}</span>
                    <span className="text-slate-500 text-xs ml-2 capitalize">{slot.entityType}</span>
                  </div>
                  <div className="text-slate-500 text-xs">{slot.startDate} – {slot.endDate}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(100,116,139,0.15)', color: '#64748b' }}>
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { CheckCircle2, Zap } from 'lucide-react';

// Online/presence dot
export function PresenceDot({ status }: { status: 'online' | 'away' | 'busy' | 'offline' }) {
  return (
    <span
      className={`block rounded-full flex-shrink-0 ${
        status === 'online' ? 'status-online w-2.5 h-2.5' :
        status === 'away'   ? 'status-away   w-2.5 h-2.5' :
        status === 'busy'   ? 'status-busy   w-2.5 h-2.5' :
                              'status-offline w-2.5 h-2.5'
      }`}
      title={status}
      aria-label={`Status: ${status}`}
    />
  );
}

// Text availability badge
export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
        available
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${available ? 'status-online' : 'bg-slate-600'}`} />
      {available ? 'Available' : 'Unavailable'}
    </span>
  );
}

// Verified badge
export function VerifiedBadge({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4' };
  return (
    <span title="Verified on Stagefront" aria-label="Verified">
      <CheckCircle2 className={`${sizes[size]} text-cyan-400 flex-shrink-0`} />
    </span>
  );
}

// PRO badge
export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider"
      style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white' }}
    >
      <Zap className="w-2.5 h-2.5" /> PRO
    </span>
  );
}

// Unread count badge
export function UnreadBadge({ count, max = 99 }: { count: number; max?: number }) {
  if (count === 0) return null;
  const label = count > max ? `${max}+` : String(count);
  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-500 text-white text-[9px] font-black badge-new">
      {label}
    </span>
  );
}

// Status pill (for proposals, events, etc.)
export function StatusPill({
  status, config,
}: {
  status: string;
  config: Record<string, { label: string; color: string }>;
}) {
  const s = config[status] ?? { label: status, color: '#64748b' };
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}35` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

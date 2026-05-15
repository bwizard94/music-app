// Skeleton loader components

export function SkeletonPulse({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3.5 ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-20 h-20' };
  return <div className={`skeleton rounded-xl flex-shrink-0 ${sizes[size]}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden" aria-hidden="true">
      <div className="skeleton h-40 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-32" />
            <div className="skeleton h-3 w-20" />
          </div>
        </div>
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="glass rounded-2xl border border-white/[0.07] p-3.5 flex items-center gap-4" aria-hidden="true">
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-36" />
        <div className="skeleton h-3 w-24" />
        <div className="flex gap-2">
          <div className="skeleton h-4 w-14 rounded-full" />
          <div className="skeleton h-4 w-18 rounded-full" />
        </div>
      </div>
      <div className="flex-shrink-0 space-y-2">
        <div className="skeleton h-3 w-12" />
        <div className="skeleton h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div aria-hidden="true">
      {/* Banner */}
      <div className="skeleton h-48 w-full rounded-none" />
      {/* Avatar + info */}
      <div className="px-6 pt-4 space-y-3">
        <div className="flex items-end gap-4">
          <div className="skeleton w-24 h-24 rounded-2xl -mt-12 border-4 border-[#060608]" />
          <div className="flex-1 space-y-2 pb-1">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-3.5 w-28" />
          </div>
        </div>
        <SkeletonText lines={3} />
        <div className="flex gap-2">
          {[80, 60, 70, 90].map((w) => (
            <div key={w} className={`skeleton h-5 rounded-full`} style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="space-y-4 px-4 py-5" aria-hidden="true">
      {/* Them */}
      <div className="flex items-end gap-2">
        <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />
        <div className="space-y-1 max-w-xs">
          <div className="skeleton h-10 w-52 rounded-2xl rounded-bl-sm" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      {/* Me */}
      <div className="flex items-end gap-2 flex-row-reverse">
        <div className="space-y-1 max-w-xs items-end flex flex-col">
          <div className="skeleton h-14 w-60 rounded-2xl rounded-br-sm" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      {/* Them */}
      <div className="flex items-end gap-2">
        <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />
        <div className="space-y-1 max-w-xs">
          <div className="skeleton h-8 w-40 rounded-2xl rounded-bl-sm" />
        </div>
      </div>
    </div>
  );
}

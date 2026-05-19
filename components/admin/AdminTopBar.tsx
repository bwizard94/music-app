'use client';

interface AdminTopBarProps {
  title: string;
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-6 border-b border-white/[0.05] flex-shrink-0"
      style={{ height: 48, backgroundColor: '#08080f' }}
    >
      <h1 className="text-white text-sm font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: '#10b981' }}
          />
          Last sync: just now
        </div>

        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderColor: 'rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#f59e0b' }}
          />
          stagefront2025
        </div>
      </div>
    </div>
  );
}

'use client';

import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
}

export default function StatCard({ icon: Icon, label, value, change, changePositive }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-4 border border-white/[0.07]">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}
        >
          <Icon className="w-4 h-4" style={{ color: '#f59e0b' }} />
        </div>
        {change && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style={changePositive !== false
              ? { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }
              : { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }
            }
          >
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-slate-500 text-xs">{label}</div>
    </div>
  );
}

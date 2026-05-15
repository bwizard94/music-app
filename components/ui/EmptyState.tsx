import type { ReactNode } from 'react';
import {
  Search, MessageSquare, FileText, Music2, Calendar,
  Users, Inbox, Star, Zap, Building2,
} from 'lucide-react';

type EmptyKind =
  | 'search' | 'messages' | 'proposals' | 'music' | 'events'
  | 'connections' | 'inbox' | 'reviews' | 'generic' | 'venues';

const CONFIGS: Record<EmptyKind, {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
}> = {
  search:      { icon: Search,       color: '#a855f7', title: 'No results found',           description: 'Try different keywords or adjust your filters' },
  messages:    { icon: MessageSquare,color: '#06b6d4', title: 'No conversations yet',        description: 'Connect with artists, venues, and promoters to start planning shows' },
  proposals:   { icon: FileText,     color: '#f43f5e', title: 'No proposals yet',            description: 'Create your first show proposal and send it to a venue' },
  music:       { icon: Music2,       color: '#a855f7', title: 'No music added yet',          description: 'Link your SoundCloud, Spotify, or other music platforms' },
  events:      { icon: Calendar,     color: '#f59e0b', title: 'No upcoming events',          description: 'Start building your next show with the Show Builder' },
  connections: { icon: Users,        color: '#10b981', title: 'No connections yet',          description: 'Discover artists and venues in your local scene' },
  inbox:       { icon: Inbox,        color: '#06b6d4', title: 'Your inbox is empty',         description: 'Booking proposals from artists will appear here' },
  reviews:     { icon: Star,         color: '#f59e0b', title: 'No reviews yet',              description: 'Collaborate with artists and promoters to build your reputation' },
  venues:      { icon: Building2,    color: '#06b6d4', title: 'No venues found',             description: 'Try adjusting your city or genre filters' },
  generic:     { icon: Zap,          color: '#a855f7', title: 'Nothing here yet',            description: 'Check back soon' },
};

interface EmptyStateProps {
  kind?: EmptyKind;
  title?: string;
  description?: string;
  icon?: React.ElementType;
  color?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  kind = 'generic', title, description, icon, color, action, compact,
}: EmptyStateProps) {
  const config = CONFIGS[kind];
  const Icon = icon ?? config.icon;
  const c = color ?? config.color;
  const t = title ?? config.title;
  const d = description ?? config.description;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10 px-4' : 'py-20 px-6'}`}>
      <div
        className={`${compact ? 'w-12 h-12 mb-4' : 'w-16 h-16 mb-5'} rounded-2xl flex items-center justify-center`}
        style={{ backgroundColor: `${c}15`, border: `1px solid ${c}25` }}
      >
        <Icon className={`${compact ? 'w-6 h-6' : 'w-7 h-7'}`} style={{ color: c }} />
      </div>
      <h3 className={`text-white font-bold ${compact ? 'text-sm' : 'text-base'} mb-1.5`}>{t}</h3>
      <p className={`text-slate-500 ${compact ? 'text-xs' : 'text-sm'} max-w-xs leading-relaxed`}>{d}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

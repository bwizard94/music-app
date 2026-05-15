'use client';

import { useState, useRef, useEffect } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import {
  Search, Plus, Send, Users, ArrowLeft, Phone, Video,
  MoreHorizontal, FileText, GitMerge, MessageSquare,
  CheckCircle2, X, ChevronRight, Zap, Calendar,
  ExternalLink, Clock, AlertCircle, Mic2, Star,
  Check, RefreshCw,
} from 'lucide-react';
import {
  RICH_CONVERSATIONS,
  type RichConversation,
  type RichMessage,
  type ConvoType,
  type MsgCard,
  type EventCard,
  type ProposalCard,
  type ArtistCard,
  typeColor,
} from '@/lib/data/messages';

// ─── Status configs ────────────────────────────────────────────────────────────

const PROPOSAL_STATUS: Record<string, { label: string; color: string }> = {
  'submitted':          { label: 'Submitted',       color: '#06b6d4' },
  'under-review':       { label: 'Under Review',    color: '#f59e0b' },
  'accepted':           { label: 'Accepted',        color: '#10b981' },
  'rejected':           { label: 'Rejected',        color: '#f43f5e' },
  'changes-requested':  { label: 'Changes Requested', color: '#a855f7' },
};

const EVENT_STATUS: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Draft',     color: '#64748b' },
  pitching:  { label: 'Pitching',  color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#10b981' },
};

// ─── Type filter config ───────────────────────────────────────────────────────

type FilterType = 'all' | ConvoType;

const TYPE_FILTERS: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all',      label: 'All',       icon: MessageSquare },
  { id: 'dm',       label: 'DMs',       icon: MessageSquare },
  { id: 'group',    label: 'Groups',    icon: Users },
  { id: 'proposal', label: 'Proposals', icon: FileText },
  { id: 'collab',   label: 'Collabs',   icon: GitMerge },
];

// ─── Inline attachment card renders ──────────────────────────────────────────

function EventCardView({ card }: { card: EventCard }) {
  const status = EVENT_STATUS[card.status];
  return (
    <Link href={card.href}
      className="block mt-2 rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/[0.16] transition-all group"
      style={{ backgroundColor: `${card.accentColor}0d` }}>
      <div className="relative h-24 overflow-hidden">
        <img src={card.coverImage} alt={card.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity" />
        <div className="absolute inset-0 flex items-end p-3"
          style={{ background: `linear-gradient(to top, ${card.accentColor}60, transparent)` }}>
          <span className="text-white font-black text-sm tracking-wide">{card.name}</span>
        </div>
        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${status.color}25`, color: status.color, border: `1px solid ${status.color}40` }}>
          {status.label}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-xs">{card.venue} · {card.date}</span>
          <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {card.lineup.map((a) => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-500 border border-white/[0.06]">{a}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function ProposalCardView({ card }: { card: ProposalCard }) {
  const status = PROPOSAL_STATUS[card.status];
  return (
    <Link href={card.href}
      className="block mt-2 rounded-xl border border-white/[0.08] hover:border-white/[0.16] transition-all group"
      style={{ backgroundColor: `${card.accentColor}0a` }}>
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <FileText className="w-3 h-3 text-slate-600" />
              <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Proposal</span>
            </div>
            <div className="text-white font-bold text-sm">{card.name}</div>
            <div className="text-slate-500 text-xs mt-0.5">{card.venue} · {card.proposedDate}</div>
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${status.color}20`, color: status.color, border: `1px solid ${status.color}35` }}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-500 border-t border-white/[0.06] pt-2">
          <span>{card.lineupCount} artists</span>
          <span>~{card.estimatedDraw} draw</span>
          <span>${card.totalBudget.toLocaleString()} budget</span>
          <ExternalLink className="w-3 h-3 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

function ArtistCardView({ card }: { card: ArtistCard }) {
  return (
    <Link href={card.href}
      className="flex items-center gap-3 mt-2 p-2.5 rounded-xl border border-white/[0.08] hover:border-white/[0.16] transition-all group"
      style={{ backgroundColor: `${card.accentColor}0a` }}>
      <img src={card.image} alt={card.name}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-xs">{card.name}</div>
        <div className="text-slate-500 text-[10px]">{card.role} · {card.city}</div>
        <div className="flex items-center gap-3 text-[10px] text-slate-600 mt-0.5">
          <span>~{card.draw} draw</span>
          <span style={{ color: card.accentColor }}>{card.fee}</span>
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

function AttachmentView({ card }: { card: MsgCard }) {
  if (card.kind === 'event')    return <EventCardView card={card} />;
  if (card.kind === 'proposal') return <ProposalCardView card={card} />;
  if (card.kind === 'artist')   return <ArtistCardView card={card} />;
  return null;
}

// ─── System message ───────────────────────────────────────────────────────────

function SystemMsg({ msg }: { msg: RichMessage }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-white/[0.04]" />
      <span className="text-slate-700 text-[10px] font-medium px-2 flex-shrink-0">{msg.content}</span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MsgBubble({
  msg, showAvatar, accentColor,
}: { msg: RichMessage; showAvatar: boolean; accentColor: string }) {
  if (msg.isSystem) return <SystemMsg msg={msg} />;

  if (msg.isMe) {
    return (
      <div className="flex items-end justify-end gap-2 group">
        <div className="max-w-xs sm:max-w-sm">
          {msg.content && (
            <div className="px-4 py-2.5 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}>
              {msg.content}
            </div>
          )}
          {msg.card && <AttachmentView card={msg.card} />}
          {msg.reactions && (
            <div className="flex gap-1 justify-end mt-1">
              {msg.reactions.map((r) => (
                <span key={r.emoji} className="text-xs px-1.5 py-0.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/[0.06]">
                  {r.emoji} {r.count}
                </span>
              ))}
            </div>
          )}
          <div className="text-slate-700 text-[10px] mt-1 text-right">{msg.time}</div>
        </div>
        <img src={msg.fromImage} alt="You"
          className="w-7 h-7 rounded-lg object-cover flex-shrink-0 mb-5" />
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 group">
      {showAvatar
        ? <img src={msg.fromImage} alt={msg.from}
            className="w-7 h-7 rounded-lg object-cover flex-shrink-0 mb-5" />
        : <div className="w-7 flex-shrink-0" />
      }
      <div className="max-w-xs sm:max-w-sm">
        {showAvatar && <div className="text-slate-500 text-[10px] mb-1 ml-1">{msg.from}</div>}
        {msg.content && (
          <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-slate-200 text-sm leading-relaxed"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {msg.content}
          </div>
        )}
        {msg.card && <AttachmentView card={msg.card} />}
        {msg.reactions && (
          <div className="flex gap-1 mt-1 ml-1">
            {msg.reactions.map((r) => (
              <span key={r.emoji} className={`text-xs px-1.5 py-0.5 rounded-full border ${
                r.mine ? 'bg-white/[0.08] text-white border-white/[0.14]' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]'
              }`}>
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}
        <div className="text-slate-700 text-[10px] mt-1 ml-1">{msg.time}</div>
      </div>
    </div>
  );
}

// ─── Conversation row ─────────────────────────────────────────────────────────

const TYPE_ICON: Record<ConvoType, React.ElementType> = {
  dm: MessageSquare, group: Users, proposal: FileText, collab: GitMerge,
};

function ConvoRow({ convo, active, onClick }: {
  convo: RichConversation; active: boolean; onClick: () => void;
}) {
  const Icon = TYPE_ICON[convo.type];
  const color = typeColor[convo.type];

  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 transition-all text-left group relative"
      style={{ backgroundColor: active ? `${convo.accentColor}10` : 'transparent' }}>
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r"
          style={{ backgroundColor: convo.accentColor }} />
      )}

      {/* Avatar / Icon */}
      <div className="relative flex-shrink-0">
        {convo.image ? (
          <>
            <img src={convo.image} alt={convo.name}
              className="w-10 h-10 rounded-xl object-cover" />
            {convo.type === 'dm' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060608]" />
            )}
          </>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${convo.accentColor}20`, border: `1px solid ${convo.accentColor}30` }}>
            <Icon className="w-5 h-5" style={{ color: convo.accentColor }} />
          </div>
        )}
        {/* Type badge */}
        {convo.type !== 'dm' && convo.type !== 'group' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}30`, border: `1px solid ${color}50` }}>
            <Icon className="w-2.5 h-2.5" style={{ color }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-semibold text-sm truncate ${active ? 'text-white' : 'text-slate-200'}`}>
            {convo.name}
          </span>
          <span className="text-slate-600 text-[10px] flex-shrink-0">{convo.lastTime}</span>
        </div>

        {/* Context subtitle for proposal/collab */}
        {convo.context && (
          <div className="mb-0.5">
            {convo.context.kind === 'proposal' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${PROPOSAL_STATUS[convo.context.status].color}18`, color: PROPOSAL_STATUS[convo.context.status].color }}>
                {PROPOSAL_STATUS[convo.context.status].label}
              </span>
            )}
            {convo.context.kind === 'collab' && (
              <span className="text-[10px] text-slate-500 capitalize">{convo.context.collabType} · {convo.context.status}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-slate-500 text-xs truncate">{convo.lastMessage}</span>
          {convo.unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: convo.accentColor }}>
              {convo.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Quick actions bar ────────────────────────────────────────────────────────

type QuickActionId = 'schedule-call' | 'share-rider' | 'open-builder' | 'accept' | 'decline' | 'view' | 'withdraw' | 'follow-up';

interface QuickAction {
  id: QuickActionId;
  label: string;
  icon: React.ElementType;
  color: string;
  variant: 'primary' | 'ghost' | 'danger';
}

function getQuickActions(convo: RichConversation): QuickAction[] {
  if (convo.type === 'proposal' && convo.context?.kind === 'proposal') {
    const { status } = convo.context;
    if (status === 'under-review' || status === 'submitted') {
      return [
        { id: 'follow-up',     label: 'Follow Up',     icon: RefreshCw,     color: '#a855f7', variant: 'ghost' },
        { id: 'schedule-call', label: 'Schedule Call',  icon: Phone,         color: '#06b6d4', variant: 'ghost' },
        { id: 'withdraw',      label: 'Withdraw',       icon: X,             color: '#f43f5e', variant: 'danger' },
      ];
    }
    if (status === 'accepted') {
      return [
        { id: 'share-rider',   label: 'Share Tech Rider', icon: FileText,    color: '#10b981', variant: 'primary' },
        { id: 'open-builder',  label: 'Open Show Builder', icon: Zap,        color: '#a855f7', variant: 'ghost' },
        { id: 'schedule-call', label: 'Schedule Call',  icon: Phone,         color: '#06b6d4', variant: 'ghost' },
      ];
    }
    if (status === 'changes-requested') {
      return [
        { id: 'view',          label: 'View Changes',   icon: AlertCircle,   color: '#f59e0b', variant: 'primary' },
        { id: 'schedule-call', label: 'Schedule Call',  icon: Phone,         color: '#06b6d4', variant: 'ghost' },
      ];
    }
  }

  if (convo.type === 'collab' && convo.context?.kind === 'collab') {
    const { status } = convo.context;
    if (status === 'pending') {
      return [
        { id: 'accept',  label: 'Accept Invite', icon: CheckCircle2, color: '#10b981', variant: 'primary' },
        { id: 'view',    label: 'View Project',  icon: ExternalLink, color: '#a855f7', variant: 'ghost' },
        { id: 'decline', label: 'Decline',       icon: X,            color: '#f43f5e', variant: 'danger' },
      ];
    }
    if (status === 'active') {
      return [
        { id: 'view',    label: 'View Project',  icon: ExternalLink, color: '#a855f7', variant: 'ghost' },
      ];
    }
  }

  if (convo.type === 'group') {
    return [
      { id: 'open-builder', label: 'View Event',    icon: Zap,       color: '#a855f7', variant: 'ghost' },
      { id: 'view',         label: 'View Lineup',   icon: Mic2,      color: '#06b6d4', variant: 'ghost' },
    ];
  }

  return [];
}

function QuickActionsBar({ convo, onAction }: {
  convo: RichConversation;
  onAction: (id: QuickActionId, label: string) => void;
}) {
  const actions = getQuickActions(convo);
  if (actions.length === 0) return null;

  return (
    <div className="flex-shrink-0 px-4 py-2 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto">
      <span className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider flex-shrink-0">Quick:</span>
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            onClick={() => onAction(a.id, a.label)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
            style={
              a.variant === 'primary'
                ? { backgroundColor: `${a.color}20`, color: a.color, border: `1px solid ${a.color}35` }
                : a.variant === 'danger'
                ? { backgroundColor: 'transparent', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }
                : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }
            }
          >
            <Icon className="w-3 h-3" />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Thread header ────────────────────────────────────────────────────────────

function ThreadHeader({
  convo, onBack,
}: { convo: RichConversation; onBack: () => void }) {
  const Icon = TYPE_ICON[convo.type];
  const color = typeColor[convo.type];

  return (
    <div className="flex-shrink-0 border-b border-white/[0.06]">
      {/* Main header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button className="sm:hidden text-slate-400 hover:text-white transition-colors p-1" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        {convo.image ? (
          <div className="relative w-10 h-10 flex-shrink-0">
            <img src={convo.image} alt={convo.name}
              className="w-full h-full rounded-xl object-cover" />
            {convo.type === 'dm' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060608]" />
            )}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${convo.accentColor}20`, border: `1px solid ${convo.accentColor}30` }}>
            <Icon className="w-5 h-5" style={{ color: convo.accentColor }} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm">{convo.name}</div>
          <div className="text-slate-500 text-xs">
            {convo.type === 'dm' && 'Online now'}
            {convo.type === 'group' && `${convo.members?.length} members · ${convo.members?.filter((m) => m.online).length} online`}
            {convo.type === 'proposal' && convo.context?.kind === 'proposal' && `${convo.context.venueName} · ${convo.context.proposedDate}`}
            {convo.type === 'collab' && convo.context?.kind === 'collab' && `${convo.context.projectName}`}
          </div>
        </div>

        {/* Member avatars for groups */}
        {convo.type === 'group' && convo.members && (
          <div className="hidden sm:flex -space-x-1.5 mr-1">
            {convo.members.slice(0, 4).map((m) => (
              <img key={m.name} src={m.image} alt={m.name}
                className="w-6 h-6 rounded-full object-cover border border-[#060608]"
                style={{ opacity: m.online ? 1 : 0.4 }} />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {(convo.type === 'proposal' || convo.type === 'collab') && convo.context && (
            <Link
              href={convo.type === 'proposal' ? `/venue/proposals/${(convo.context as { proposalId?: string }).proposalId ?? ''}` : '#'}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}28` }}>
              <ExternalLink className="w-3 h-3" />
              {convo.type === 'proposal' ? 'Full Proposal' : 'View Project'}
            </Link>
          )}
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-white border border-white/[0.08] transition-colors">
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-white border border-white/[0.08] transition-colors">
            <Video className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-white border border-white/[0.08] transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Proposal context banner */}
      {convo.type === 'proposal' && convo.context?.kind === 'proposal' && (
        <div className="px-4 py-2 border-t border-white/[0.04] flex items-center gap-3"
          style={{ backgroundColor: `${convo.context.accentColor}08` }}>
          <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: convo.context.accentColor }} />
          <span className="text-slate-400 text-xs flex-1 truncate">
            Proposal for <span className="text-white font-semibold">{convo.context.eventName}</span>
            {' '}at <span className="text-white font-semibold">{convo.context.venueName}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: `${PROPOSAL_STATUS[convo.context.status].color}18`,
              color: PROPOSAL_STATUS[convo.context.status].color,
              border: `1px solid ${PROPOSAL_STATUS[convo.context.status].color}30`,
            }}>
            {PROPOSAL_STATUS[convo.context.status].label}
          </span>
        </div>
      )}

      {/* Collab context banner */}
      {convo.type === 'collab' && convo.context?.kind === 'collab' && (
        <div className="px-4 py-2 border-t border-white/[0.04] flex items-center gap-3"
          style={{ backgroundColor: `${convo.context.accentColor}08` }}>
          <GitMerge className="w-3.5 h-3.5 flex-shrink-0" style={{ color: convo.context.accentColor }} />
          <span className="text-slate-400 text-xs flex-1 truncate">
            <span className="capitalize">{convo.context.collabType}</span> collaboration ·{' '}
            <span className="text-white font-semibold">{convo.context.projectName}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
            style={{
              backgroundColor: convo.context.status === 'active' ? '#10b98118' : convo.context.status === 'pending' ? '#f59e0b18' : '#f43f5e18',
              color: convo.context.status === 'active' ? '#10b981' : convo.context.status === 'pending' ? '#f59e0b' : '#f43f5e',
              border: `1px solid ${convo.context.status === 'active' ? '#10b981' : convo.context.status === 'pending' ? '#f59e0b' : '#f43f5e'}30`,
            }}>
            {convo.context.status}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [conversations, setConversations] = useState<RichConversation[]>(RICH_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>('neural-drift-crew');
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find((c) => c.id === activeId) ?? null;

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
  const unreadByType = (type: ConvoType) =>
    conversations.filter((c) => c.type === type).reduce((s, c) => s + c.unread, 0);

  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q
      || c.name.toLowerCase().includes(q)
      || c.lastMessage.toLowerCase().includes(q)
      || c.messages.some((m) => m.content.toLowerCase().includes(q));
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConvo?.messages.length]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeId) return;
    const msg: RichMessage = {
      id: `msg-${Date.now()}`,
      from: 'You',
      fromImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
      content: input.trim(),
      time: 'now',
      isMe: true,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, msg], lastMessage: `You: ${input.trim()}`, lastTime: 'now', unread: 0 }
          : c
      )
    );
    setInput('');
  };

  const selectConvo = (id: string) => {
    setActiveId(id);
    setShowMobileThread(true);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleQuickAction = (id: QuickActionId, label: string) => {
    const TEMPLATES: Partial<Record<QuickActionId, string>> = {
      'follow-up':     'Just following up on the proposal — let me know if you need any additional info.',
      'schedule-call': 'Would you be available for a quick call this week to discuss the details?',
      'share-rider':   'Sending over the full tech rider now. Let me know if anything needs adjusting.',
      'withdraw':      'I\'d like to withdraw this proposal for now. I\'ll be in touch about future dates.',
      'accept':        'I\'m in — excited to be part of this project. What are the next steps?',
      'decline':       'Thanks for reaching out, but I\'m not able to commit to this one right now.',
    };
    const template = TEMPLATES[id];
    if (template) {
      setInput(template);
    }
    if (id === 'open-builder' && activeConvo) {
      showToast('Opening Show Builder…');
    }
    if (id === 'view') {
      showToast(`Opening ${label}…`);
    }
  };

  return (
    <div className="h-screen bg-[#060608] flex flex-col overflow-hidden">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl glass border border-white/[0.12] text-white text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-shrink-0 h-14 glass border-b border-white/[0.06] flex items-center px-4 sm:px-6 gap-2 z-40">
        <Link href="/" className="font-black text-base tracking-tight gradient-text-purple hidden sm:block">STAGEFRONT</Link>
        <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block" />
        <Link href="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors hidden sm:block">Dashboard</Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
          Inbox
          {totalUnread > 0 && (
            <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">{totalUnread}</span>
          )}
        </span>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-1.5 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #a855f7, #a855f788)' }} />
            <Plus className="w-3.5 h-3.5 relative" />
            <span className="relative hidden sm:block">New</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Conversation list ──────────────────────────────── */}
        <aside className={`flex-shrink-0 w-full sm:w-72 xl:w-80 border-r border-white/[0.06] flex flex-col ${showMobileThread ? 'hidden sm:flex' : 'flex'}`}>

          {/* Search */}
          <div className="p-3 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages…"
                className="w-full glass rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-600 outline-none bg-white/[0.03] border border-white/[0.06]"
              />
            </div>
          </div>

          {/* Type filter tabs */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto flex-shrink-0">
            {TYPE_FILTERS.map(({ id, label }) => {
              const unread = id === 'all' ? totalUnread : unreadByType(id);
              return (
                <button
                  key={id}
                  onClick={() => setTypeFilter(id)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                    typeFilter === id
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-slate-600 hover:text-slate-400'
                  }`}
                >
                  {label}
                  {unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {pinned.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1">
                  <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-1">Pinned</p>
                </div>
                {pinned.map((c) => (
                  <ConvoRow key={c.id} convo={c} active={activeId === c.id} onClick={() => selectConvo(c.id)} />
                ))}
                {unpinned.length > 0 && (
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] text-slate-700 font-semibold uppercase tracking-widest px-1">All Messages</p>
                  </div>
                )}
              </>
            )}
            {unpinned.map((c) => (
              <ConvoRow key={c.id} convo={c} active={activeId === c.id} onClick={() => selectConvo(c.id)} />
            ))}
            {filtered.length === 0 && (
              <EmptyState kind="search" compact title="No conversations found" description="Try a different name or filter" />
            )}
          </div>
        </aside>

        {/* ── Right: Thread ────────────────────────────────────────── */}
        <div className={`flex-1 flex flex-col overflow-hidden ${!showMobileThread && activeConvo ? 'hidden sm:flex' : showMobileThread ? 'flex' : 'hidden sm:flex'}`}>
          {activeConvo ? (
            <>
              <ThreadHeader convo={activeConvo} onBack={() => setShowMobileThread(false)} />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {activeConvo.messages.map((msg, idx) => {
                  const prev = activeConvo.messages[idx - 1];
                  const showAvatar = !msg.isSystem && (!prev || prev.from !== msg.from || !!prev.isSystem);
                  return (
                    <MsgBubble
                      key={msg.id}
                      msg={msg}
                      showAvatar={showAvatar}
                      accentColor={activeConvo.accentColor}
                    />
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Quick actions */}
              <QuickActionsBar convo={activeConvo} onAction={handleQuickAction} />

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t border-white/[0.06]">
                <div className="flex items-end gap-2">
                  <div className="flex-1 glass rounded-2xl border border-white/[0.08] overflow-hidden">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Message ${activeConvo.name}…`}
                      rows={1}
                      className="w-full bg-transparent text-white text-sm placeholder-slate-600 outline-none resize-none px-4 py-3 max-h-32"
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn-press w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${activeConvo.accentColor}, ${activeConvo.accentColor}88)` }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-slate-700 text-[10px] mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
              <div className="w-16 h-16 rounded-2xl glass border border-white/[0.08] flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-slate-600" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Collaboration Inbox</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Direct messages, show planning groups, proposal threads, and collaboration requests — all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {[
                  { icon: FileText,  label: 'Review Proposals',    color: '#f59e0b', filter: 'proposal' as FilterType },
                  { icon: GitMerge,  label: 'View Collab Requests', color: '#10b981', filter: 'collab'   as FilterType },
                  { icon: Users,     label: 'Show Planning Groups', color: '#a855f7', filter: 'group'    as FilterType },
                ].map(({ icon: Icon, label, color, filter }) => (
                  <button
                    key={label}
                    onClick={() => setTypeFilter(filter)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] hover:border-white/[0.14] transition-all"
                    style={{ backgroundColor: `${color}08` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">{label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

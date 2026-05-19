-- ─── Security hardening additions for Stagefront ──────────────────────────────
-- Run this AFTER schema.sql in your Supabase SQL Editor

-- ─── Waitlist entries ─────────────────────────────────────────────────────────

create table if not exists waitlist_entries (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text not null,
  role text not null,
  city text not null,
  referral_code text not null unique,
  referred_by text,
  position integer not null,
  referral_count integer not null default 0,
  joined_at timestamptz not null default now(),
  ip_hash text,
  constraint waitlist_entries_email_unique unique (email),
  constraint waitlist_email_format check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  constraint waitlist_role_valid check (role in (
    'solo_artist', 'band', 'dj', 'producer', 'venue_manager',
    'promoter', 'creative', 'photographer', 'videographer', 'sound_engineer'
  )),
  constraint waitlist_position_positive check (position > 0),
  constraint waitlist_referral_count_non_negative check (referral_count >= 0)
);

alter table waitlist_entries enable row level security;
create policy "No public read waitlist" on waitlist_entries for select using (false);
create policy "No public write waitlist" on waitlist_entries for all using (false);

-- ─── Invite codes ─────────────────────────────────────────────────────────────

create table if not exists invite_codes (
  code text primary key,
  created_by_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  used_by_id uuid references profiles(id) on delete set null,
  max_uses integer not null default 1,
  use_count integer not null default 0,
  expires_at timestamptz,
  is_admin_generated boolean not null default false,
  constraint invite_use_count_non_negative check (use_count >= 0),
  constraint invite_max_uses_positive check (max_uses > 0)
);

alter table invite_codes enable row level security;
create policy "Owner read invite_codes" on invite_codes for select using (
  auth.uid() = created_by_id
);
create policy "Auth insert invite_codes" on invite_codes for insert with check (
  auth.uid() = created_by_id
  and is_admin_generated = false
);

-- ─── Rate limiting log ────────────────────────────────────────────────────────

create table if not exists rate_limit_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  actor_id uuid references profiles(id) on delete cascade,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limit_actor_action on rate_limit_log(actor_id, action, created_at);
create index if not exists idx_rate_limit_ip on rate_limit_log(ip_hash, action, created_at);

alter table rate_limit_log enable row level security;
create policy "Auth insert rate_limit" on rate_limit_log for insert with check (
  auth.uid() is not null
  and auth.uid() = actor_id
);
create policy "No public read rate_limit" on rate_limit_log for select using (false);

-- ─── Reported content ─────────────────────────────────────────────────────────

create table if not exists content_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  content_type text not null,
  content_id text not null,
  reason text not null,
  details text,
  status text not null default 'pending',
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reports_content_type_valid check (content_type in ('profile', 'event', 'proposal', 'message', 'review')),
  constraint reports_reason_valid check (reason in ('spam', 'harassment', 'fake_profile', 'inappropriate_content', 'scam', 'other')),
  constraint reports_status_valid check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
  constraint reports_unique_per_reporter unique (reporter_id, content_type, content_id)
);

alter table content_reports enable row level security;
create policy "Reporter insert content_reports" on content_reports for insert with check (
  auth.uid() = reporter_id
);
create policy "Reporter read own content_reports" on content_reports for select using (
  auth.uid() = reporter_id
);

-- ─── Additional constraints on existing tables ────────────────────────────────

alter table profiles drop constraint if exists profiles_role_valid;
alter table profiles add constraint profiles_role_valid check (role in (
  'solo_artist', 'band', 'dj', 'producer', 'venue_manager',
  'promoter', 'creative', 'photographer', 'videographer', 'sound_engineer'
));

alter table profiles drop constraint if exists profiles_display_name_length;
alter table profiles add constraint profiles_display_name_length check (
  length(display_name) <= 80
);

alter table profiles drop constraint if exists profiles_bio_length;
alter table profiles add constraint profiles_bio_length check (
  bio is null or length(bio) <= 500
);

alter table profiles drop constraint if exists profiles_username_format;
alter table profiles add constraint profiles_username_format check (
  username is null or (
    length(username) between 3 and 30
    and username ~ '^[a-z0-9_]+$'
  )
);

alter table artist_profiles drop constraint if exists artist_profiles_slug_format;
alter table artist_profiles add constraint artist_profiles_slug_format check (
  slug ~ '^[a-z0-9-]+$' and length(slug) between 2 and 60
);

alter table venue_profiles drop constraint if exists venue_profiles_slug_format;
alter table venue_profiles add constraint venue_profiles_slug_format check (
  slug ~ '^[a-z0-9-]+$' and length(slug) between 2 and 60
);

alter table events drop constraint if exists events_status_valid;
alter table events add constraint events_status_valid check (status in (
  'draft', 'published', 'cancelled', 'completed'
));

alter table events drop constraint if exists events_name_length;
alter table events add constraint events_name_length check (length(name) <= 120);

alter table proposals drop constraint if exists proposals_status_valid;
alter table proposals add constraint proposals_status_valid check (status in (
  'draft', 'submitted', 'accepted', 'changes-requested', 'rejected', 'cancelled'
));

alter table proposals drop constraint if exists proposals_name_length;
alter table proposals add constraint proposals_name_length check (length(name) <= 120);

alter table proposals drop constraint if exists proposals_budgets_non_negative;
alter table proposals add constraint proposals_budgets_non_negative check (
  total_artist_fees >= 0
  and production_budget >= 0
  and marketing_budget >= 0
  and estimated_draw >= 0
);

alter table messages drop constraint if exists messages_body_length;
alter table messages add constraint messages_body_length check (length(body) <= 2000);

alter table reviews drop constraint if exists reviews_body_length;
alter table reviews add constraint reviews_body_length check (length(body) <= 1000);

alter table reviews drop constraint if exists reviews_no_self_review;
alter table reviews add constraint reviews_no_self_review check (reviewer_id != reviewee_id);

alter table reviews drop constraint if exists reviews_reviewee_type_valid;
alter table reviews add constraint reviews_reviewee_type_valid check (
  reviewee_type in ('artist', 'venue', 'promoter')
);

alter table social_links drop constraint if exists social_links_platform_valid;
alter table social_links add constraint social_links_platform_valid check (
  platform in ('Instagram', 'Twitter', 'SoundCloud', 'Spotify', 'YouTube', 'Bandcamp', 'TikTok', 'Facebook', 'LinkedIn', 'Website')
);

alter table social_links drop constraint if exists social_links_url_safe;
alter table social_links add constraint social_links_url_safe check (
  url ~* '^https?://'
  and url !~* '^javascript:'
  and url !~* '^data:'
);

-- ─── Rate limiting function ───────────────────────────────────────────────────

create or replace function check_rate_limit(
  p_actor_id uuid,
  p_action text,
  p_max_count integer,
  p_window_seconds integer
)
returns boolean as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from rate_limit_log
  where actor_id = p_actor_id
    and action = p_action
    and created_at > now() - (p_window_seconds || ' seconds')::interval;

  return v_count < p_max_count;
end;
$$ language plpgsql security definer;

-- ─── Prevent verified=true self-assignment ────────────────────────────────────

create or replace function prevent_self_verification()
returns trigger as $$
begin
  if new.verified = true and old.verified = false then
    if current_setting('role') != 'service_role' then
      new.verified := false;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists prevent_self_verification_trigger on profiles;
create trigger prevent_self_verification_trigger
  before update on profiles
  for each row execute function prevent_self_verification();

create or replace function prevent_self_pro_assignment()
returns trigger as $$
begin
  if new.pro_member = true and old.pro_member = false then
    if current_setting('role') != 'service_role' then
      new.pro_member := false;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists prevent_self_pro_trigger on profiles;
create trigger prevent_self_pro_trigger
  before update on profiles
  for each row execute function prevent_self_pro_assignment();

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_waitlist_entries_email on waitlist_entries(email);
create index if not exists idx_waitlist_entries_referral_code on waitlist_entries(referral_code);
create index if not exists idx_content_reports_status on content_reports(status, created_at);
create index if not exists idx_invite_codes_code on invite_codes(code);

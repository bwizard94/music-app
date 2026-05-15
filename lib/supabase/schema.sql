-- Run this in your Supabase SQL Editor to set up the Stagefront database

create extension if not exists "uuid-ossp";

-- ─── Updated_at trigger function ──────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── Profiles ─────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  display_name text not null default '',
  avatar_url text,
  role text not null default 'solo_artist',
  bio text,
  city text,
  country text,
  accent_color text not null default '#a855f7',
  verified boolean not null default false,
  pro_member boolean not null default false,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

alter table profiles enable row level security;
create policy "Public read profiles" on profiles for select using (true);
create policy "Owner update profiles" on profiles for update using (auth.uid() = id);
create policy "Owner insert profiles" on profiles for insert with check (auth.uid() = id);

-- ─── Auth trigger: auto-create profile ───────────────────────────────────────

create or replace function on_auth_user_created()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function on_auth_user_created();

-- ─── Artist Profiles ──────────────────────────────────────────────────────────

create table if not exists artist_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade unique,
  slug text not null unique,
  genres text[] not null default '{}',
  tags text[] not null default '{}',
  draw integer not null default 0,
  fee_min integer not null default 0,
  fee_max integer not null default 0,
  fee_display text not null default '',
  social_score integer not null default 0,
  audience_age text,
  recent_shows integer not null default 0,
  cover_image_url text,
  available_for_booking boolean not null default true,
  travel_radius integer,
  collab_interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger artist_profiles_updated_at
  before update on artist_profiles
  for each row execute function update_updated_at();

alter table artist_profiles enable row level security;
create policy "Public read artist_profiles" on artist_profiles for select using (true);
create policy "Owner write artist_profiles" on artist_profiles for all using (
  auth.uid() = profile_id
);

-- ─── Venue Profiles ───────────────────────────────────────────────────────────

create table if not exists venue_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade unique,
  slug text not null unique,
  name text not null,
  tagline text,
  genres text[] not null default '{}',
  capacity integer not null default 0,
  city text not null default '',
  country text not null default '',
  accent_color text not null default '#a855f7',
  cover_image_url text,
  verified boolean not null default false,
  sound_system jsonb,
  lighting_system jsonb,
  rooms jsonb,
  booking_status text not null default 'open',
  preferred_genres text[] not null default '{}',
  min_fee integer,
  lead_time_days integer,
  house_rules text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger venue_profiles_updated_at
  before update on venue_profiles
  for each row execute function update_updated_at();

alter table venue_profiles enable row level security;
create policy "Public read venue_profiles" on venue_profiles for select using (true);
create policy "Owner write venue_profiles" on venue_profiles for all using (
  auth.uid() = profile_id
);

-- ─── Social Links ─────────────────────────────────────────────────────────────

create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  created_at timestamptz not null default now(),
  unique(profile_id, platform)
);

alter table social_links enable row level security;
create policy "Public read social_links" on social_links for select using (true);
create policy "Owner write social_links" on social_links for all using (
  auth.uid() = profile_id
);

-- ─── Events ───────────────────────────────────────────────────────────────────

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  tagline text,
  venue_id uuid references venue_profiles(id),
  venue_name text not null default '',
  venue_city text not null default '',
  venue_capacity integer not null default 0,
  status text not null default 'draft',
  date_display text not null default '',
  doors_time text,
  end_time text,
  accent_color text not null default '#a855f7',
  cover_image_url text,
  ticket_price text,
  genres text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_updated_at
  before update on events
  for each row execute function update_updated_at();

alter table events enable row level security;
create policy "Public read events" on events for select using (true);
create policy "Owner write events" on events for all using (
  auth.uid() = creator_id
);

-- ─── Event Lineup ─────────────────────────────────────────────────────────────

create table if not exists event_lineup (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  artist_id uuid not null references profiles(id),
  artist_name text not null,
  artist_image text,
  role text not null default 'performer',
  start_time text,
  duration_minutes integer,
  fee integer,
  status text not null default 'confirmed',
  sort_order integer not null default 0
);

alter table event_lineup enable row level security;
create policy "Public read event_lineup" on event_lineup for select using (true);
create policy "Event creator write event_lineup" on event_lineup for all using (
  auth.uid() = (select creator_id from events where id = event_id)
);

-- ─── Proposals ────────────────────────────────────────────────────────────────

create table if not exists proposals (
  id uuid primary key default uuid_generate_v4(),
  submitted_by_id uuid not null references profiles(id) on delete cascade,
  submitted_by_name text not null,
  submitted_by_role text not null,
  submitted_by_image text,
  venue_id uuid references venue_profiles(id),
  venue_name text not null,
  venue_city text not null,
  venue_capacity integer not null default 0,
  name text not null,
  tagline text,
  genres text[] not null default '{}',
  proposed_date text not null,
  doors_time text,
  end_time text,
  status text not null default 'draft',
  estimated_draw integer not null default 0,
  total_artist_fees integer not null default 0,
  production_budget integer not null default 0,
  marketing_budget integer not null default 0,
  ticket_price text,
  revenue_split text,
  budget_notes text,
  venue_response text,
  venue_note text,
  change_requests text[],
  accent_color text not null default '#a855f7',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger proposals_updated_at
  before update on proposals
  for each row execute function update_updated_at();

alter table proposals enable row level security;
create policy "Submitter read proposals" on proposals for select using (
  auth.uid() = submitted_by_id
  or auth.uid() = (select profile_id from venue_profiles where id = venue_id)
);
create policy "Submitter insert proposals" on proposals for insert with check (
  auth.uid() = submitted_by_id
);
create policy "Submitter update proposals" on proposals for update using (
  auth.uid() = submitted_by_id
  or auth.uid() = (select profile_id from venue_profiles where id = venue_id)
);

-- ─── Proposal Lineup ──────────────────────────────────────────────────────────

create table if not exists proposal_lineup (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  artist_id uuid not null references profiles(id),
  artist_name text not null,
  artist_image text,
  role text not null default 'performer',
  genres text[] not null default '{}',
  draw integer not null default 0,
  fee integer not null default 0,
  accent_color text not null default '#a855f7'
);

alter table proposal_lineup enable row level security;
create policy "Proposal read proposal_lineup" on proposal_lineup for select using (
  auth.uid() = (select submitted_by_id from proposals where id = proposal_id)
  or auth.uid() = (
    select vp.profile_id from venue_profiles vp
    inner join proposals p on p.venue_id = vp.id
    where p.id = proposal_id
    limit 1
  )
);
create policy "Submitter write proposal_lineup" on proposal_lineup for all using (
  auth.uid() = (select submitted_by_id from proposals where id = proposal_id)
);

-- ─── Conversations ────────────────────────────────────────────────────────────

create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  type text not null default 'direct',
  name text,
  accent_color text not null default '#a855f7',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function update_updated_at();

alter table conversations enable row level security;
create policy "Participant read conversations" on conversations for select using (
  auth.uid() in (
    select profile_id from conversation_participants where conversation_id = id
  )
);

-- ─── Conversation Participants ────────────────────────────────────────────────

create table if not exists conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, profile_id)
);

alter table conversation_participants enable row level security;
create policy "Participant read conversation_participants" on conversation_participants for select using (
  auth.uid() = profile_id
  or auth.uid() in (
    select profile_id from conversation_participants cp2
    where cp2.conversation_id = conversation_id
  )
);

-- ─── Messages ─────────────────────────────────────────────────────────────────

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  sender_name text not null,
  sender_image text,
  body text not null,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;
create policy "Participant read messages" on messages for select using (
  auth.uid() in (
    select profile_id from conversation_participants where conversation_id = messages.conversation_id
  )
);
create policy "Participant insert messages" on messages for insert with check (
  auth.uid() = sender_id
  and auth.uid() in (
    select profile_id from conversation_participants where conversation_id = messages.conversation_id
  )
);

-- ─── Reviews ──────────────────────────────────────────────────────────────────

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid not null references profiles(id) on delete cascade,
  reviewee_id uuid not null references profiles(id) on delete cascade,
  reviewee_type text not null default 'artist',
  rating integer not null check (rating >= 1 and rating <= 5),
  body text not null,
  show_name text,
  show_date text,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;
create policy "Public read reviews" on reviews for select using (true);
create policy "Reviewer insert reviews" on reviews for insert with check (
  auth.uid() = reviewer_id
);

-- ─── Followers ────────────────────────────────────────────────────────────────

create table if not exists followers (
  follower_id uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

alter table followers enable row level security;
create policy "Public read followers" on followers for select using (true);
create policy "Owner write followers" on followers for all using (
  auth.uid() = follower_id
);

-- ─── Local Scenes ─────────────────────────────────────────────────────────────

create table if not exists local_scenes (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  country text not null,
  slug text not null unique,
  description text,
  member_count integer not null default 0,
  event_count integer not null default 0,
  accent_color text not null default '#a855f7',
  cover_image_url text,
  created_at timestamptz not null default now()
);

alter table local_scenes enable row level security;
create policy "Public read local_scenes" on local_scenes for select using (true);
create policy "Auth insert local_scenes" on local_scenes for insert with check (
  auth.uid() is not null
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_artist_profiles_profile_id on artist_profiles(profile_id);
create index if not exists idx_artist_profiles_slug on artist_profiles(slug);
create index if not exists idx_venue_profiles_profile_id on venue_profiles(profile_id);
create index if not exists idx_venue_profiles_slug on venue_profiles(slug);
create index if not exists idx_proposals_submitted_by on proposals(submitted_by_id);
create index if not exists idx_proposals_venue on proposals(venue_id);
create index if not exists idx_messages_conversation on messages(conversation_id, created_at);
create index if not exists idx_conversation_participants_profile on conversation_participants(profile_id);
create index if not exists idx_social_links_profile on social_links(profile_id);
create index if not exists idx_events_creator on events(creator_id);
create index if not exists idx_followers_follower on followers(follower_id);
create index if not exists idx_followers_following on followers(following_id);

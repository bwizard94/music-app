# Stagefront

**The professional network powering local music culture.**

Stagefront connects artists, venues, promoters, and creatives to collaborate, perform, and build something real — city by city, scene by scene.

---

## What It Is

Stagefront is an invite-only platform launching city by city. It gives the local music industry the infrastructure it's always been missing:

- **Show Builder** — Build events with smart lineup intelligence, drag-and-drop artist slots, compatibility scoring, and a one-click venue proposal generator
- **Proposal System** — Pitch venues with a full show concept. Venues respond, negotiate, and commit — all in one thread
- **Scene Hubs** — Every city gets its own feed, artist roster, event map, and community board
- **Creative Board** — Post open slots, find collaborators, form collectives, and share gear
- **Waitlist & Invite System** — Referral-based waitlist with city-specific queues and scarcity mechanics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth) |
| Language | TypeScript |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/bwizard94/music-app.git
cd music-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |

Copy `.env.example` to `.env.local` and fill in your values. Never commit `.env.local`.

### Supabase Setup

The app uses Supabase for authentication and a `profiles` table. Without valid credentials, all pages fall back to mock data and remain fully functional for development and preview purposes.

To enable full auth:
1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key into `.env.local`
3. Create a `profiles` table with columns: `id`, `display_name`, `bio`, `city`, `avatar_url`, `slug`

---

## Project Structure

```
app/                    # Next.js App Router pages
├── admin/              # PIN-gated admin panel
├── dashboard/          # Authenticated main feed
├── discover/           # Artist & venue discovery
├── invite/[code]/      # Invite landing pages
├── proposals/          # Proposal management
├── scene/[city]/       # City scene hubs
├── share/              # Public share pages (OG-optimized)
├── show-builder/       # Show Builder tool
├── venue/              # Venue management
└── waitlist/           # Waitlist & invite flow

components/             # Shared React components
├── admin/              # Admin panel components
├── dashboard/          # Dashboard layout & sidebar
├── profile/            # Artist profile components
├── providers/          # Auth context provider
├── sections/           # Landing page sections
├── share/              # Public share page components
├── show-builder/       # Show Builder panels
├── ui/                 # Core UI primitives
├── venue/              # Venue page components
└── waitlist/           # Waitlist & invite components

lib/
├── data/               # Mock data & static fixtures
├── supabase/           # Supabase client & helpers
└── utils/              # Shared utilities & scoring logic
```

---

## Key Features

### Show Builder
The core feature. Build a complete show concept:
- Search and filter artists by genre, fee range, and lineup compatibility
- Drag-and-drop lineup ordering with headliner/support slot types
- Smart scoring: genre fit, venue fit, promo strength, audience overlap
- Risk warnings and suggested missing pieces
- One-click venue proposal generation with a pitch preview

### Invite & Waitlist System
Scarcity-driven, referral-powered growth:
- Users join a city-specific waitlist queue
- Each referral moves you up 10 spots
- Invite codes grant priority access (position 1–25)
- Referral links are unique and shareable
- Status page shows live queue position and activity feed

### Public Share Pages
Every artist, venue, event, and proposal has a shareable public page:
- Full Open Graph metadata for rich social previews
- Beautiful hero sections viewable without login
- Share buttons (copy link, X/Twitter)
- Clear CTA to join the platform

### Admin Panel
PIN-gated at `/admin` (PIN: `stagefront2025`):
- Platform metrics with daily signup chart
- User management and verification queue
- Content moderation (reports)
- Featured slots management
- Waitlist management and invite batch generation

---

## Design System

- Background: `#060608` (near-black)
- Glass morphism cards via `.glass` CSS class with `backdrop-blur`
- Accent: Purple (`#a855f7`) primary · Cyan (`#06b6d4`) secondary · Pink (`#f43f5e`) tertiary
- All dynamic colors use inline `style={{}}` (Tailwind v4 compatibility — no dynamic class names)
- Particle canvas animation on the Hero section

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel dashboard
4. Deploy

No custom `vercel.json` needed — Next.js defaults are sufficient.

### Build Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## License

Private — all rights reserved.

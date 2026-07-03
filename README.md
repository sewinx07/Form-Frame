# Form & Frame

**A luxury creative agency portfolio platform** — a full-stack Next.js application with a cinematic dark-mode frontend, role-based admin backend, and interactive Arabic-calligraphy-inspired background effects.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Prisma (SQLite).

---

## Features

### Public Site
- **Cinematic Hero** — Animated headline, scroll indicator, gradient overlays
- **Core Pillars** — Three-discipline showcase (Design, Frame, Code) with glass-morphism cards
- **Stats Section** — Animated counters with staggered entrance
- **Portfolio Grid** — Filterable project gallery with tab navigation, image thumbnails, and external platform link indicators (Instagram, YouTube, Vimeo, GitHub)
- **Contact Form** — Floating-label inputs with validation and animated success state
- **Interactive Background** — Seamless Islamic geometric pattern with `F&F` micro-branding; gold spotlight follows cursor via `requestAnimationFrame` lerp; idle float animation; respects `prefers-reduced-motion`
- **Noise Overlay** — Subtle SVG fractal-noise grain across the entire site

### Admin Backend (`/secret-gate`)
- **Hidden Login** — Terminal-aesthetic gate at an unlinked route; JWT-based session auth with 7-day expiry
- **Dashboard** — Animated stat cards (projects, team, categories), recent projects timeline, category breakdown bar chart
- **Project Management** — Publish form (title, description, image URL, external link URL, category), data table with delete + confirmation modal; platform detection shows Instagram/YouTube/Vimeo/GitHub icons
- **Team Management** — CEO-only `/admin/users` with Add Member form, team directory, and removal confirmation; Role enum: `super_user` / `team_member`

### Design System
- **Dark-mode-first** — Deep charcoal palette (`#0a0a0a` primary), warm off-white text, gold accent (`#D4AF37`)
- **Glass Morphism** — `backdrop-blur` cards with subtle borders throughout
- **Typography** — Playfair Display (serif headings) + Inter (sans-serif body)
- **Typography Scale** — Refined hierarchy with generous tracking and leading
- **Animations** — Framer Motion with custom cubic-bezier easing `[0.16, 1, 0.3, 1]`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Database | SQLite (via Prisma + libsql adapter) |
| Auth | JWT (jose) + bcryptjs |
| Fonts | Google Fonts (Inter, Playfair Display) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (local or [Neon](https://neon.tech) — free tier works)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your PostgreSQL connection string.

### Database

```bash
npx prisma db push
```

### Seed (default accounts)

```bash
npm run db:seed
```

| Email | Password | Role |
|-------|----------|------|
| `ceo@formandframe.com` | `admin123` | super_user |
| `team@formandframe.com` | `team123` | team_member |

### Development

```bash
npm run dev
```

> **Note:** Local commands use `--webpack` (SWC native bindings unavailable on this Win32 platform). Vercel builds with SWC automatically.

### Build

```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000). Login at `/secret-gate`.

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<your-username>%2Fform-and-frame&env=DATABASE_URL&envDescription=PostgreSQL%20connection%20string%20(from%20Neon))

1. Push this repo to GitHub
2. Import the repo on [Vercel](https://vercel.com/new)
3. Set the **Environment Variable**:
   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your PostgreSQL connection string |
4. Deploy — Vercel runs `prisma generate && next build`

### Database on Vercel

This project uses PostgreSQL. [Neon](https://neon.tech) provides a free serverless PostgreSQL database and is the recommended option:

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → copy the connection string
3. Add it as `DATABASE_URL` in Vercel project settings

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (sidebar + content)
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── projects/page.tsx   # Project CRUD
│   │   └── users/page.tsx      # Team management (CEO only)
│   ├── api/
│   │   ├── auth/route.ts       # Auth endpoints (login/session/logout)
│   │   ├── projects/route.ts   # List & create projects
│   │   ├── projects/[id]/route.ts  # Delete project
│   │   ├── users/route.ts      # List & create users
│   │   └── users/[id]/route.ts # Delete user
│   ├── secret-gate/page.tsx    # Hidden login page
│   ├── page.tsx                # Home (hero, pillars, portfolio, contact)
│   ├── layout.tsx              # Root layout (fonts, noise overlay)
│   └── globals.css             # Tailwind theme + glass/noise utilities
├── components/
│   ├── Header.tsx              # Scroll-aware nav with glass effect
│   ├── Footer.tsx              # Site footer
│   ├── AdminSidebar.tsx        # Admin navigation sidebar
│   ├── LuxuryBackground.tsx    # Interactive calligraphy pattern background
│   └── ui/
│       ├── Button.tsx          # Button component (5 variants)
│       ├── Input.tsx           # Floating-label input
│       ├── Badge.tsx           # Badge with status dot
│       └── DataTable.tsx       # Generic data table with delete action
├── lib/
│   ├── auth.ts                 # JWT sign/verify, session management
│   ├── prisma.ts               # PrismaClient singleton (pg adapter)
│   ├── types.ts                # Shared TypeScript types
│   └── platform.tsx            # URL platform detection (Instagram, YouTube, etc.)
└── proxy.ts                    # Route guard for /admin/* routes
prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed script
vercel.json                     # Vercel deployment config
.env.example                    # Environment template
```

---

## Key Design Decisions

- **PostgreSQL + Prisma v7** — Uses `@prisma/adapter-pg` with the `pg` driver adapter (required for Prisma v7); `DATABASE_URL` env var configures the connection
- **Next.js 16 proxy** — Uses `src/proxy.ts` instead of deprecated `middleware.ts`; validates JWT expiry via simple cookie check (avoids Edge Runtime `CompressionStream` incompatibility)
- **Client-side admin pages** — Session and role enforcement happens client-side since server components can't access the proxy context
- **`--webpack` flag** — Required locally on this Win32 platform; Vercel uses its own SWC-based build
- **Platform detection** — External links auto-detect Instagram, YouTube, Vimeo, GitHub and render corresponding icons with brand-specific colors

---

## License

MIT

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

### Install

```bash
npm install
```

### Database

```bash
npx prisma db push
```

### Seed (default accounts)

```bash
npx tsx prisma/seed.ts
```

| Email | Password | Role |
|-------|----------|------|
| `ceo@formandframe.com` | `admin123` | super_user |
| `team@formandframe.com` | `team123` | team_member |

### Development

```bash
npm run dev
```

> **Note:** This project uses the `--webpack` flag (SWC/Turbopack native bindings unavailable on this platform).

### Build

```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000). Login at `/secret-gate`.

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
│   ├── prisma.ts               # PrismaClient singleton (libsql adapter)
│   ├── types.ts                # Shared TypeScript types
│   └── platform.tsx            # URL platform detection (Instagram, YouTube, etc.)
└── proxy.ts                    # Route guard for /admin/* routes
prisma/
├── schema.prisma               # Database schema
├── seed.ts                     # Seed script
└── dev.db                      # SQLite database
```

---

## Key Design Decisions

- **Prisma v7 + libsql adapter** — Required for SQLite in Prisma v7 (no direct datasource URL)
- **Next.js 16 proxy** — Uses `src/proxy.ts` instead of deprecated `middleware.ts`; validates JWT expiry via simple cookie check (avoids Edge Runtime `CompressionStream` incompatibility)
- **Client-side admin pages** — Session and role enforcement happens client-side since server components can't access the proxy context
- **`--webpack` flag** — Required for all `next` commands on this Win32 platform
- **Platform detection** — External links auto-detect Instagram, YouTube, Vimeo, GitHub and render corresponding icons with brand-specific colors

---

## License

MIT

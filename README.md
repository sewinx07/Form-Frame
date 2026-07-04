# Form & Frame

**Luxury creative agency portfolio platform** — a full-stack Next.js application with a cinematic dark-mode frontend, role-based admin backend, interactive geometric background, contact form with email notifications, and PostgreSQL on Neon.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Prisma v7.

---

## Features

### Public Site
- **Cinematic Hero** — Animated headline, scroll indicator, gradient overlays
- **Core Pillars** — Three-discipline showcase (Design, Frame, Code) with glass-morphism cards
- **Stats Section** — Animated counters fetched from the database; editable via admin panel
- **Portfolio Grid** — Filterable project gallery with tab navigation, image thumbnails, and external platform link indicators (Instagram, YouTube, Vimeo, GitHub)
- **Contact Form** — Floating-label inputs with validation and animated success state; sends email notification via SMTP
- **Interactive Background** — Seamless geometric star/diamond pattern with `F&F` micro-branding; gold spotlight follows cursor via `requestAnimationFrame` lerp; idle float animation; respects `prefers-reduced-motion`
- **Noise Overlay** — Subtle SVG fractal-noise grain across the entire site

### Admin Backend (`/secret-gate`)
- **Hidden Login** — Terminal-aesthetic gate at an unlinked route; JWT-based session auth with 7-day httpOnly cookie
- **Dashboard** — Stat cards (projects, team, categories), recent projects timeline, category breakdown bar chart
- **Project Management** — Publish form (title, description, image URL, external link, category), data table with delete confirmation modal; platform detection shows Instagram/YouTube/Vimeo/GitHub icons
- **Stats Management** — Edit homepage statistics (Projects Delivered, Years Experience, etc.) inline; changes take effect immediately
- **Team Management** — CEO-only `/admin/users` with Add Member form, team directory, and removal confirmation; Role enum: `super_user` / `team_member`

### Design System
- **Dark-mode-first** — Deep charcoal palette (`#0a0a0a` primary), warm off-white text, gold accent (`#D4AF37`)
- **Glass Morphism** — `backdrop-blur` cards with subtle borders throughout
- **Typography** — Playfair Display (serif headings) + Inter (sans-serif body)
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
| Database | PostgreSQL (Neon) via Prisma v7 + `@prisma/adapter-pg` |
| Auth | JWT (jose) + bcryptjs |
| Email | Nodemailer (SMTP) |
| Fonts | Google Fonts (Inter, Playfair Display) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database — [Neon](https://neon.tech) (free tier works)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Configure these variables in `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing auth tokens |
| `SMTP_HOST` | For contact form | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | For contact form | SMTP port (e.g. `587`) |
| `SMTP_USER` | For contact form | SMTP username |
| `SMTP_PASS` | For contact form | SMTP password or App Password |
| `NOTIFICATION_EMAIL` | For contact form | Where to send contact inquiries |

### Database

```bash
npx prisma migrate deploy
```

### Seed

```bash
npx tsx prisma/seed.ts
```

Creates the initial admin accounts.

### Development

```bash
npm run dev
```

> **Note:** Local commands use `--webpack` (Turbopack not supported on this Win32 platform). Vercel builds with its own SWC-based pipeline regardless.

### Build

```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000). Login at `/secret-gate`.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Set these **Environment Variables** in the Vercel project dashboard:

   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | PostgreSQL connection string from Neon |
   | `JWT_SECRET` | Secret for signing auth tokens |
   | `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
   | `SMTP_PORT` | SMTP port (e.g. `587`) |
   | `SMTP_USER` | SMTP username |
   | `SMTP_PASS` | SMTP password or App Password |
   | `NOTIFICATION_EMAIL` | Email to receive contact form submissions |

4. Deploy — Vercel runs `prisma generate && next build`

### Notes

- The lockfile is deleted before install on Vercel (`rm -f package-lock.json && npm install`) to avoid platform-specific optional dep conflicts (Windows-generated lockfile vs Linux build environment).
- Contact form email uses Gmail SMTP with an App Password ([create one here](https://myaccount.google.com/apppasswords) — 2FA must be enabled on the account).

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout (sidebar + content)
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── projects/page.tsx    # Project CRUD
│   │   ├── stats/page.tsx       # Editable statistics
│   │   └── users/page.tsx       # Team management (CEO only)
│   ├── api/
│   │   ├── auth/route.ts        # Auth (login/session/logout)
│   │   ├── contact/route.ts     # Contact form + email notification
│   │   ├── projects/route.ts    # List & create projects
│   │   ├── projects/[id]/route.ts  # Delete project
│   │   ├── stats/route.ts       # GET & update statistics
│   │   ├── users/route.ts       # List & create users
│   │   └── users/[id]/route.ts  # Delete user
│   ├── secret-gate/page.tsx     # Hidden login page
│   ├── page.tsx                 # Home (hero, pillars, stats, portfolio, contact)
│   ├── layout.tsx               # Root layout (fonts, noise overlay)
│   ├── not-found.tsx            # Custom 404 page
│   └── globals.css              # Tailwind theme + glass/noise utilities
├── components/
│   ├── Header.tsx               # Scroll-aware nav with glass effect
│   ├── Footer.tsx               # Site footer
│   ├── AdminSidebar.tsx         # Admin navigation sidebar
│   ├── LuxuryBackground.tsx     # Interactive geometric pattern background
│   └── ui/
│       ├── Button.tsx           # Button (5 variants)
│       ├── Input.tsx            # Floating-label input
│       ├── Badge.tsx            # Badge with status dot
│       └── DataTable.tsx        # Generic data table with delete action
├── lib/
│   ├── auth.ts                  # JWT sign/verify, session management
│   ├── prisma.ts                # PrismaClient singleton (pg adapter, lazy Proxy)
│   ├── email.ts                 # Nodemailer transport + sendContactNotification
│   ├── platform.tsx             # URL platform detection (Instagram, YouTube, etc.)
│   └── types.ts                 # Shared TypeScript types
└── proxy.ts                     # Route guard for /admin/* routes
prisma/
├── schema.prisma                # Database schema (User, Project, ContactInquiry, Stat)
├── seed.ts                      # Seed script
├── config.ts                    # Prisma v7 datasource config
└── migrations/                  # Migration history
vercel.json                      # Vercel deployment config
.env.example                     # Environment template
```

---

## Key Design Decisions

- **PostgreSQL + Prisma v7** — Uses `@prisma/adapter-pg` with the `pg` driver adapter (required for Prisma v7); `DATABASE_URL` is configured in `prisma.config.ts` (not the schema file)
- **Lazy Prisma Client** — Wrapped in a Proxy so module import doesn't crash at build time when `DATABASE_URL` isn't set
- **Next.js 16 proxy** — Uses `src/proxy.ts` instead of deprecated `middleware.ts`; validates JWT expiry via simple cookie check (avoids Edge Runtime `CompressionStream` incompatibility)
- **Client-side admin pages** — Session and role enforcement happens client-side since server components can't access the proxy context
- **`--webpack` flag** — Required locally on Win32; Vercel uses its own SWC-based build regardless
- **Platform detection** — External links auto-detect Instagram, YouTube, Vimeo, GitHub and render corresponding icons with brand-specific colors
- **Editable statistics** — Homepage stats are stored in the database and editable via the admin panel, so the team can update them without touching code

---

## License

MIT

# Rony Tech Labs — Immersive Digital Innovation Platform

A flagship Awwwards-style site with WebGL hero, 7 public pages, AI chatbot, and full admin CMS. Built on TanStack Start + Lovable Cloud + Lovable AI.

## Tech adaptations (from your brief)

- **Framework**: TanStack Start (React + SSR) instead of Next.js — Lovable's native stack. Same React ecosystem, all your animation libs work.
- **Backend/DB/Auth/Storage**: Lovable Cloud (Postgres + auth + file storage + edge functions) replaces Node/Express + MongoDB + custom CMS.
- **CMS**: Custom admin panel inside the app (no Sanity).
- **AI Chatbot**: Lovable AI Gateway (Gemini/GPT, no API key needed).
- **Libraries installed**: GSAP + ScrollTrigger, Framer Motion, Lenis, @react-three/fiber, @react-three/drei, three, zustand, react-markdown, zod.

---

## Design system

- Palette: Deep Navy `#0B0F29`, Carbon Black `#0A0A0F`, Electric Blue `#2563EB`, Teal `#14B8A6`, Glass White `rgba(255,255,255,0.08)`.
- Typography: Inter (body) + Satoshi/Space Grotesk (display) — kinetic, large, bold.
- Tokens defined as semantic CSS variables in `src/styles.css` (HSL/oklch). All components reference tokens, never raw hex.
- Reusable primitives: `<GlassPanel>`, `<MagneticButton>`, `<KineticHeading>`, `<ScrollReveal>`, `<CustomCursor>`.

## Global experience layer

- Lenis smooth scroll wired into root layout.
- Custom magnetic morphing cursor (desktop only, hidden on touch).
- GSAP page transitions between routes (fade + slide overlay).
- Reduced-motion fallbacks throughout (respect `prefers-reduced-motion`).
- Mobile: WebGL downgraded to CSS gradient + static composition; Lenis disabled below 768px; cursor disabled.

## Public site (7 routes)

1. **`/` Home** — Full-viewport hero combining:
   - GLSL liquid distortion shader background (R3F, mouse-reactive)
   - Floating 3D morphing orb centerpiece (icosahedron + displacement noise)
   - Kinetic headline "We Build Digital Worlds" with split-text GSAP reveal
   - Floating glassmorphic UI panels with parallax depth
   - CTA: "Start Your Innovation Journey" (magnetic button → /contact)
   - Scroll sections: services preview, featured projects, stats, CTA band
2. **`/about`** — Scroll-storytelling: pinned sections with large words (Innovation / Precision / Systems), 3D rotating object reacting to scroll, animated process timeline (5 steps).
3. **`/services`** — Circular/orbit grid of 8 service cards (Web, WordPress, Apps, AI, Marketing, Canva, Software, Consulting). Hover = tilt + glow. Click = expanded modal with details (content from DB).
4. **`/projects`** — Filterable grid (categories from DB). Hover = WebGL distortion thumbnail. Click → `/projects/$slug` case study with hero image, metrics, gallery, tech stack.
5. **`/lab` Innovation Lab** — Interactive demos: shader playground, particle sandbox, AI mini-demo (text → summary via Lovable AI). Cards loaded from DB.
6. **`/insights` Blog** — Card grid → `/insights/$slug` clean reading layout with rich text, code blocks, related posts.
7. **`/contact`** — Glassmorphic form with magnetic inputs, animated submit, success state. Phone displayed: 82000 61970. Submissions saved to leads table.

Each route has unique `head()` metadata (title, description, og tags).

## AI Chatbot (santifer.io-inspired)

- Floating glass orb bottom-right, opens to glassmorphic chat panel with smooth scale/blur animation.
- Suggested prompts: "Build me a website", "AI automation for my business", "See your work", "Get a quote".
- Streams responses from Lovable AI (Gemini Flash by default) via TanStack server function.
- System prompt knows the company's services and routes users to relevant pages.
- Lead capture: when user shows intent, bot collects name + email/phone → saved to `chatbot_leads` table.
- Conversation persisted in `localStorage` per session.

## Admin panel (`/admin/*`)

Auth-gated via Lovable Cloud (email + password). Role: `admin` stored in `user_roles` table (separate from profiles, security-definer `has_role()` function).

- `/admin/login` — sign-in
- `/admin/dashboard` — overview cards (leads count, projects, posts, recent activity)
- `/admin/projects` — CRUD: title, slug, category, summary, hero image (upload to storage), gallery, metrics, tech tags, body (rich text), featured toggle, published toggle
- `/admin/services` — CRUD: name, icon, short + long description, order
- `/admin/insights` — CRUD: title, slug, cover image, excerpt, body (rich text via Tiptap or simple MD editor), tags, published
- `/admin/lab` — CRUD: experiment cards (title, description, demo type, link/embed)
- `/admin/leads` — table of contact + chatbot leads, filter, CSV export
- `/admin/settings` — phone number, branding (logo upload), feature toggles (chatbot on/off, lab on/off), social links
- Dark/light theme toggle, responsive sidebar layout (shadcn Sidebar)

## Database schema (Lovable Cloud)

- `profiles` (id → auth.users, name, avatar_url)
- `user_roles` (user_id, role enum: admin/user) + `has_role()` security definer
- `projects` (slug, title, category, summary, body, hero_url, gallery jsonb, metrics jsonb, tech text[], featured, published, created_at)
- `services` (slug, name, icon, short_desc, long_desc, sort_order)
- `posts` (slug, title, excerpt, cover_url, body, tags text[], published, published_at)
- `lab_items` (title, description, demo_type, config jsonb, sort_order)
- `contact_leads` (name, email, phone, message, source, created_at)
- `chatbot_leads` (name, contact, transcript jsonb, created_at)
- `site_settings` (singleton: phone, social jsonb, feature_flags jsonb, logo_url)
- Storage bucket `media` (public read, admin write) for images.
- RLS: public SELECT on published rows; admin-only INSERT/UPDATE/DELETE via `has_role(auth.uid(), 'admin')`.

## Seed content

Polished placeholder content seeded for: 8 services, 6 projects with case studies, 4 blog posts, 4 lab experiments, default site settings (phone 82000 61970). All editable via admin.

## Performance & quality

- Lazy-load 3D scenes with `React.lazy` + Suspense fallback.
- Conditional WebGL: skip on mobile + reduced-motion.
- Image optimization via `loading="lazy"` and responsive sizes.
- Route-level code splitting (TanStack default).
- Target Lighthouse 90+ on desktop.

---

## Build phases (delivered in one go but staged internally)

1. Design system, fonts, tokens, primitives, Lenis, cursor, page transitions
2. Lovable Cloud schema + RLS + seed data + storage bucket
3. WebGL hero (shader + 3D orb) + Home page
4. About, Services, Contact pages
5. Projects list + detail + Lab + Insights list + detail
6. AI Chatbot (server fn + streaming UI + lead capture)
7. Admin auth + sidebar + all CRUD screens + leads export + settings

## What you'll need to do after

- Sign up at `/admin/login` then I'll grant your account the admin role (one SQL insert via the data tool).
- Replace seeded copy/images via the admin panel.
- Optional: add custom domain in Lovable settings.

## Heads-up / trade-offs

- "Awwwards-winning" polish typically takes multiple iteration rounds — first pass will be strong but expect tuning of timings, easing, and micro-interactions after you see it live.
- Heavy WebGL + many CRUD screens in one shot means each area gets solid-but-not-perfect depth. We'll polish hot spots in follow-ups.
- No Next.js — TanStack Start serves the same SSR/SEO purpose.
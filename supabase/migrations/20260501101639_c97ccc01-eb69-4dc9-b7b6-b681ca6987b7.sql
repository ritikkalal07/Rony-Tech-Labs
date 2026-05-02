
-- Enums
create type public.app_role as enum ('admin', 'user');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

-- Security definer role check
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Updated-at trigger helper
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default 'Sparkles',
  short_desc text not null default '',
  long_desc text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger services_updated_at before update on public.services
  for each row execute function public.tg_set_updated_at();

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Web',
  summary text not null default '',
  body text not null default '',
  hero_url text,
  gallery jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  tech text[] not null default '{}',
  client text,
  year int,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_updated_at before update on public.projects
  for each row execute function public.tg_set_updated_at();

-- Posts (blog / insights)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  cover_url text,
  body text not null default '',
  tags text[] not null default '{}',
  author text not null default 'Rony Tech Labs',
  read_minutes int not null default 5,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger posts_updated_at before update on public.posts
  for each row execute function public.tg_set_updated_at();

-- Lab items
create table public.lab_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  demo_type text not null default 'shader',
  config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger lab_items_updated_at before update on public.lab_items
  for each row execute function public.tg_set_updated_at();

-- Contact leads
create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  source text not null default 'contact_form',
  created_at timestamptz not null default now()
);

-- Chatbot leads
create table public.chatbot_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  intent text,
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Site settings (singleton)
create table public.site_settings (
  id int primary key default 1,
  phone text not null default '82000 61970',
  email text not null default 'hello@ronytechlabs.com',
  social jsonb not null default '{}'::jsonb,
  feature_flags jsonb not null default '{"chatbot": true, "lab": true}'::jsonb,
  logo_url text,
  tagline text not null default 'We Build Digital Worlds',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.tg_set_updated_at();

insert into public.site_settings (id) values (1);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.lab_items enable row level security;
alter table public.contact_leads enable row level security;
alter table public.chatbot_leads enable row level security;
alter table public.site_settings enable row level security;

-- Profiles policies
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles admin all" on public.profiles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- user_roles policies (admins manage; users read own)
create policy "roles self read" on public.user_roles for select using (auth.uid() = user_id);
create policy "roles admin all" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Public-readable content
create policy "services public read" on public.services for select using (published = true or public.has_role(auth.uid(),'admin'));
create policy "services admin write" on public.services for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "projects public read" on public.projects for select using (published = true or public.has_role(auth.uid(),'admin'));
create policy "projects admin write" on public.projects for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "posts public read" on public.posts for select using (published = true or public.has_role(auth.uid(),'admin'));
create policy "posts admin write" on public.posts for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "lab public read" on public.lab_items for select using (published = true or public.has_role(auth.uid(),'admin'));
create policy "lab admin write" on public.lab_items for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Leads: anyone can insert; only admins can read/manage
create policy "contact insert any" on public.contact_leads for insert with check (true);
create policy "contact admin read" on public.contact_leads for select using (public.has_role(auth.uid(),'admin'));
create policy "contact admin all" on public.contact_leads for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "chatbot insert any" on public.chatbot_leads for insert with check (true);
create policy "chatbot admin read" on public.chatbot_leads for select using (public.has_role(auth.uid(),'admin'));
create policy "chatbot admin all" on public.chatbot_leads for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('media','media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects for insert with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));

-- Seed services
insert into public.services (slug,name,icon,short_desc,long_desc,sort_order) values
('web','Web Development','Globe','High-performance custom websites engineered for scale and speed.','We build production-grade web platforms using modern frameworks, edge rendering, and design systems that scale from MVP to enterprise.',1),
('wordpress','WordPress','Layers','Custom WordPress builds, headless CMS and performance optimization.','Bespoke themes, headless integrations, Gutenberg blocks and conversion-optimized landing pages — fast, secure, maintainable.',2),
('apps','Mobile & Web Apps','Smartphone','Cross-platform apps that feel native and ship fast.','React Native, PWAs and full-stack web apps with offline support, real-time sync and beautiful interaction design.',3),
('ai','AI & Automation','Brain','LLM products, RAG systems and intelligent automation pipelines.','From chatbots and copilots to vector search and workflow automation — production AI that actually moves business metrics.',4),
('marketing','Digital Marketing','TrendingUp','SEO, paid, content and lifecycle systems built around real data.','Performance marketing engineered with the same rigor as product — measurable, compounding, technically sound.',5),
('canva','Design Systems','Palette','Brand systems, design tokens and Canva templates for teams.','Scalable visual languages: tokens, components, brand kits and ready-to-use templates that keep teams shipping consistently.',6),
('software','Custom Software','Code2','Bespoke software platforms, internal tools and SaaS products.','From admin dashboards to multi-tenant SaaS — typed, tested, observable and built for the next 5 years of change.',7),
('consulting','Tech Consulting','Compass','Architecture reviews, team coaching and digital transformation.','Senior engineering input on architecture, hiring, AI strategy and product velocity — for founders and leaders who need clarity.',8);

-- Seed projects
insert into public.projects (slug,title,category,summary,body,hero_url,metrics,tech,client,year,featured,sort_order) values
('aurora-finance','Aurora Finance — Realtime Trading Platform','Web','A high-frequency dashboard rendering 50k+ data points at 60fps.','Aurora Finance needed a realtime market dashboard rebuilt from scratch. We delivered a WebGL-accelerated charting layer, sub-second updates and a design system unifying 40+ screens.','https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1600','[{"label":"Latency","value":"<80ms"},{"label":"Concurrent users","value":"12k"},{"label":"Frame rate","value":"60fps"}]','{TanStack,WebGL,Postgres,Redis}','Aurora Finance',2025,true,1),
('lumen-health','Lumen Health — Patient Companion App','Apps','HIPAA-grade mobile app for chronic care, used by 80k patients.','We built Lumen''s patient app from zero to scale: secure messaging, AI symptom triage, and offline-first medication tracking.','https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600','[{"label":"Active patients","value":"80k"},{"label":"NPS","value":"72"},{"label":"Crash-free","value":"99.96%"}]','{"React Native","FastAPI","Postgres","OpenAI"}','Lumen Health',2025,true,2),
('northwind-ai','Northwind — AI Sales Copilot','AI','LLM copilot generating $14M in additional pipeline.','A retrieval-augmented copilot trained on Northwind''s knowledge base, deployed to 600 reps with sub-2s responses.','https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600','[{"label":"Pipeline added","value":"$14M"},{"label":"Avg response","value":"1.6s"},{"label":"Adoption","value":"94%"}]','{"OpenAI","pgvector","TanStack","Stripe"}','Northwind',2025,true,3),
('stratus-cloud','Stratus — Multi-tenant SaaS','Software','Bespoke SaaS platform with per-tenant theming and SSO.','Built the complete Stratus platform: auth, billing, RBAC, audit logs, white-label theming and a plugin API.','https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600','[{"label":"Tenants","value":"320"},{"label":"Uptime","value":"99.99%"},{"label":"Time to ship","value":"14 weeks"}]','{TanStack,Postgres,Stripe,SAML}','Stratus',2024,false,4),
('orbit-marketing','Orbit — Lifecycle Marketing System','Marketing','Lifecycle automation that 3x''d activation in 90 days.','Designed and shipped a complete lifecycle stack — events, segmentation, journeys and experimentation — wired to product analytics.','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600','[{"label":"Activation","value":"+212%"},{"label":"Revenue lift","value":"$3.4M"},{"label":"Experiments","value":"68"}]','{Segment,Customer.io,BigQuery,dbt}','Orbit',2024,false,5),
('vela-design','Vela — Design System & Brand','Design','Token-driven design system spanning web, app and print.','Rebuilt Vela''s identity from the ground up: tokens, components, motion language and a Canva kit for the marketing team.','https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600','[{"label":"Components","value":"120+"},{"label":"Brand consistency","value":"+88%"},{"label":"Design velocity","value":"4x"}]','{Figma,"Style Dictionary",Canva,Storybook}','Vela',2024,false,6);

-- Seed posts
insert into public.posts (slug,title,excerpt,cover_url,body,tags,read_minutes,published_at) values
('shaders-for-product-designers','Shaders for Product Designers','A pragmatic introduction to GLSL for designers shipping real products — no PhD required.','https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=1600','# Shaders for Product Designers

GLSL feels intimidating, but the mental model is small. In this guide we walk through the three primitives you actually need...

## What is a fragment shader?
A fragment shader is a tiny program that runs once per pixel...

## Building your first liquid effect
We start with a noise field, distort UVs, and composite over a base layer...

## Production tips
- Use lower precision when you can
- Cap the resolution on mobile
- Always profile on real devices', '{Shaders,Design,WebGL}',7,now() - interval '3 days'),
('ai-products-that-ship','AI Products That Actually Ship','We''ve shipped 30+ LLM features. Here''s the architecture pattern that survived contact with reality.','https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600','# AI Products That Actually Ship

Most AI demos die in production. The ones that survive share a common shape: thin model layer, fat retrieval, deterministic fallback...

## The thin-model pattern
Treat the LLM as a stateless function. Move state to your retrieval layer.

## Evals, evals, evals
You cannot ship what you cannot measure.','{AI,Engineering,Product}',9,now() - interval '8 days'),
('the-magnetic-cursor','The Magnetic Cursor: A Tiny Detail That Changes Everything','How a 40-line cursor implementation can elevate a brand from "nice site" to "memorable product".','https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600','# The Magnetic Cursor

The magnetic cursor is the most overused micro-interaction on Awwwards — and also one of the most effective when done right...

## Implementation
A few lerps, a transform, and respect for `prefers-reduced-motion`. That''s it.','{Interaction,Design}',5,now() - interval '14 days'),
('headless-wordpress-2026','Headless WordPress in 2026','When headless makes sense, when it doesn''t, and the architecture we use for clients shipping content at scale.','https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1600','# Headless WordPress in 2026

Headless WordPress is no longer experimental. Here is the stack we deploy for editorial teams that need both authoring comfort and frontend freedom...','{WordPress,Architecture,CMS}',8,now() - interval '20 days');

-- Seed lab items
insert into public.lab_items (title,description,demo_type,config,sort_order) values
('Liquid Distortion Field','Mouse-reactive GLSL noise field with chromatic aberration.','shader','{"colorA":"#2563EB","colorB":"#14B8A6"}',1),
('Particle Constellation','10,000 GPU-instanced particles forming dynamic constellations.','particles','{"count":10000}',2),
('AI Text Compressor','Lovable AI compresses long-form text into a single luminous sentence.','ai','{"model":"google/gemini-3-flash-preview"}',3),
('Generative Grid','Procedural geometry grid responding to scroll velocity.','grid','{"rows":12,"cols":12}',4);

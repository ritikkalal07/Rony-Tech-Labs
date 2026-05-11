import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Zap, Layers, Cpu, Sparkles, Star, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { MagneticButton } from "@/components/ui-kit/MagneticButton";
import { GlassPanel } from "@/components/ui-kit/GlassPanel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const HeroScene = lazy(() => import("@/components/fx/HeroScene").then((m) => ({ default: m.HeroScene })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rony Tech Labs — India's digital innovation studio" },
      { name: "description", content: "Ahmedabad-based product studio building web, AI, mobile and SaaS for Indian and global brands. From MVP to scale." },
      { property: "og:title", content: "Rony Tech Labs — India's digital innovation studio" },
      { property: "og:description", content: "Ahmedabad-based studio shipping web, AI and mobile products for Indian and global brands." },
    ],
  }),
  component: HomePage,
});

function useFeaturedProjects() {
  return useQuery({
    queryKey: ["projects-featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("slug,title,category,summary,hero_url")
        .eq("featured", true)
        .order("sort_order");
      return data ?? [];
    },
  });
}

function useServices() {
  return useQuery({
    queryKey: ["services-home"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });
}

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesPreview />
      <FeaturedProjects />
      <Stats />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC]" />}>
        <HeroScene />
      </Suspense>
      <div className="absolute inset-0 -z-10 grid-faint opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-foreground/80">Now booking — Ahmedabad · Mumbai · Bengaluru · Remote</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--teal))]" /> NDA-first engagements</span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-[hsl(var(--electric))]" /> MSME registered</span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5 on Clutch & Google</span>
          </div>
        </motion.div>

        <h1 className="mt-6 font-display font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(2.75rem,10vw,9.5rem)]">
          {["Built", "in", "India."].map((w, i) => (
            <motion.span
              key={w}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.18em] overflow-hidden"
            >{w}</motion.span>
          ))}
          <motion.span
            initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-gradient"
          >Shipped worldwide.</motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          A Gujarat-born product studio engineering websites, AI tools, mobile apps
          and SaaS for Indian startups, D2C brands and enterprises. Honest pricing,
          fixed timelines, and code you actually own.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link to="/contact">
            <MagneticButton>
              Start Your Innovation Journey <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </Link>
          <Link to="/projects">
            <MagneticButton variant="outline">See selected work</MagneticButton>
          </Link>
        </motion.div>

        {/* Floating trust panels */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute right-8 top-32 float-slow"
          >
            <GlassPanel strong className="p-5 w-72">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Client rating
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="font-display text-4xl">4.9<span className="text-xl text-muted-foreground">/5</span></div>
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Across 80+ verified reviews on Clutch, Google & GoodFirms</div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-foreground/80"><Clock className="h-3 w-3" /> 24h reply</span>
                <span className="inline-flex items-center gap-1.5 text-foreground/80"><ShieldCheck className="h-3 w-3" /> NDA signed</span>
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.55, duration: 1 }}
            className="absolute left-8 bottom-24 float-slow"
            style={{ animationDelay: "1.2s" }}
          >
            <GlassPanel className="p-4 w-80 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-brand grid place-items-center shrink-0">
                <BadgeCheck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Trusted by founders & CTOs</div>
                <div className="text-sm font-medium truncate">120+ products live · 8 years · Zero ghosted projects</div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-foreground/30 to-transparent" />
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Tata Neu", "Zomato", "CRED", "Razorpay", "Swiggy", "Nykaa", "PhonePe", "Flipkart", "Meesho", "Boat"];
  const all = [...items, ...items];
  return (
    <div className="border-y border-border/60 overflow-hidden py-6 bg-white/40 backdrop-blur">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {all.map((n, i) => (
          <div key={i} className="font-display text-2xl text-muted-foreground/50 tracking-tight shrink-0">{n}</div>
        ))}
      </div>
    </div>
  );
}

function ServicesPreview() {
  const { data: services = [] } = useServices();
  return (
    <section className="relative py-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">/ 01 — What we build</div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.95]">
              An ecosystem<br /><span className="text-gradient">engineered</span> end-to-end.
            </h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary">
            All services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/70 rounded-3xl overflow-hidden border border-border">
          {services.slice(0, 8).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-card hover:bg-secondary/40 p-7 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-colors" />
              <div className="relative">
                <div className="text-xs font-mono text-muted-foreground">0{i + 1}</div>
                <div className="mt-6 font-display text-xl">{s.name}</div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.short_desc}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-foreground/60 group-hover:text-primary transition-colors">
                  Explore <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { data: projects = [] } = useFeaturedProjects();

  return (
    <section className="relative py-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">/ 02 — Selected work</div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.95]">Products that<br /><span className="text-gradient">move metrics.</span></h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className={i % 3 === 0 ? "md:col-span-2" : ""}
            >
              <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block">
                <div className="relative overflow-hidden rounded-3xl aspect-[16/10] glass">
                  {p.hero_url && (
                    <img src={p.hero_url} alt={p.title} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-mono">{p.category}</div>
                      <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">{p.title}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full glass-strong grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "120+", l: "Products shipped across India", icon: Layers },
    { v: "₹400Cr+", l: "Client revenue impact", icon: Zap },
    { v: "30+", l: "AI features in production", icon: Cpu },
    { v: "60fps", l: "On every device, even 2G", icon: Sparkles },
  ];
  return (
    <section className="relative py-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-px bg-border/70 rounded-3xl overflow-hidden border border-border">
        {stats.map((s) => (
          <div key={s.l} className="bg-card p-8">
            <s.icon className="h-5 w-5 text-primary" />
            <div className="mt-6 font-display text-4xl md:text-5xl tracking-tight">{s.v}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="relative px-4 md:px-8 py-20">
      <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[2rem] glass-strong p-10 md:p-20">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <h3 className="font-display text-4xl md:text-6xl tracking-tighter leading-[0.95]">
            Have a vision?<br />Let's <span className="text-gradient">engineer it.</span>
          </h3>
          <div className="md:justify-self-end space-y-5">
            <p className="text-muted-foreground max-w-md">
              Tell us what you're building. We'll come back within 24 hours with a clear path forward.
            </p>
            <Link to="/contact"><MagneticButton>Start a conversation <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

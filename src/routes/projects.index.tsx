import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Rony Tech Labs" },
      { name: "description", content: "Selected case studies — web platforms, AI copilots, mobile apps and software products we've engineered." },
      { property: "og:title", content: "Projects — Rony Tech Labs" },
      { property: "og:description", content: "Selected work — products that move metrics." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects-all"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <section className="pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Portfolio</div>
        <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.92]">Selected <span className="text-gradient">work</span>.</h1>
        <p className="mt-6 max-w-xl text-foreground/70">A small slice of the products we've shipped — each engineered for measurable impact.</p>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block" data-cursor="hover">
                <div className="relative overflow-hidden rounded-3xl aspect-[16/10] glass">
                  {p.hero_url && <img src={p.hero_url} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
                    <div>
                      <div className="text-xs font-mono text-muted-foreground">{p.category}</div>
                      <div className="mt-1.5 font-display text-2xl tracking-tight">{p.title}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full glass-strong grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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

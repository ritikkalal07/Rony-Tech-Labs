import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights — Rony Tech Labs" },
      { name: "description", content: "Essays on engineering, design, AI and the craft of shipping digital products." },
      { property: "og:title", content: "Insights — Rony Tech Labs" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <section className="pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Insights</div>
        <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.92]">Field <span className="text-gradient">notes</span>.</h1>

        <div className="mt-20 divide-y divide-border/70">
          {posts.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to="/insights/$slug" params={{ slug: p.slug }} className="group flex flex-col md:flex-row gap-6 py-10 items-start" data-cursor="hover">
                {p.cover_url && (
                  <div className="md:w-72 aspect-[16/10] overflow-hidden rounded-2xl shrink-0">
                    <img src={p.cover_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-xs font-mono text-muted-foreground">{new Date(p.published_at).toLocaleDateString()} · {p.read_minutes} min read</div>
                  <h2 className="mt-2 font-display text-3xl md:text-4xl tracking-tight group-hover:text-gradient transition-all">{p.title}</h2>
                  <p className="mt-3 text-foreground/70 max-w-2xl">{p.excerpt}</p>
                  <div className="mt-4 flex gap-2">
                    {p.tags?.map((t: string) => <span key={t} className="text-[10px] px-2.5 py-1 rounded-full glass uppercase tracking-widest text-primary">{t}</span>)}
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

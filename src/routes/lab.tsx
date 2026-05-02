import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Innovation Lab — Rony Tech Labs" },
      { name: "description", content: "Interactive demos, shader experiments and AI sandboxes from the studio." },
      { property: "og:title", content: "Innovation Lab — Rony Tech Labs" },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  const { data: items = [] } = useQuery({
    queryKey: ["lab"],
    queryFn: async () => {
      const { data } = await supabase.from("lab_items").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <section className="pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Lab</div>
        <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.92]">Where we <span className="text-gradient">experiment</span>.</h1>
        <p className="mt-6 max-w-xl text-foreground/70">Open prototypes from the studio — interactive shaders, particle systems, AI demos. Some become products.</p>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <motion.div key={it.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl glass p-8 hover:shadow-[0_24px_60px_-20px_hsl(var(--electric)/0.3)] transition-all aspect-square md:aspect-[4/3] flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl group-hover:bg-primary/25 transition-colors" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Beaker className="h-3.5 w-3.5" /> {it.demo_type.toUpperCase()}
                </div>
                <div className="mt-6 font-display text-3xl md:text-4xl tracking-tight">{it.title}</div>
                <p className="mt-3 text-foreground/70">{it.description}</p>
              </div>
              <div className="relative text-xs text-muted-foreground">Coming online — interactive demo</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

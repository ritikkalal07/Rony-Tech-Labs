import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MagneticButton } from "@/components/ui-kit/MagneticButton";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Rony Tech Labs" },
      { name: "description", content: "Web, AI, mobile, software, design systems and tech consulting — engineered end-to-end." },
      { property: "og:title", content: "Services — Rony Tech Labs" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <section className="pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Services</div>
        <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.92]">An ecosystem<br /><span className="text-gradient">engineered</span> end-to-end.</h1>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl glass p-8 hover:shadow-[0_24px_60px_-20px_hsl(var(--electric)/0.25)] transition-all">
              <div className="text-xs font-mono text-primary">0{i + 1}</div>
              <div className="mt-4 font-display text-3xl tracking-tight">{s.name}</div>
              <p className="mt-3 text-sm text-muted-foreground">{s.short_desc}</p>
              <p className="mt-4 text-foreground/80 leading-relaxed">{s.long_desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/contact"><MagneticButton>Discuss your project <ArrowRight className="h-4 w-4" /></MagneticButton></Link>
        </div>
      </div>
    </section>
  );
}

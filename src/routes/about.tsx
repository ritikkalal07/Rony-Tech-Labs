import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Rony Tech Labs" },
      { name: "description", content: "A digital innovation lab building cinematic, production-grade products. Innovation, precision, systems." },
      { property: "og:title", content: "About — Rony Tech Labs" },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  { word: "Innovation", desc: "We treat every brief as a research problem. The answer is rarely the obvious one." },
  { word: "Precision", desc: "Tokens, types, tests, telemetry. Craft is the difference between memorable and forgettable." },
  { word: "Systems", desc: "We don't ship features — we ship systems that compound." },
];

const PROCESS = [
  { n: "01", t: "Discover", d: "Audit the problem space, the metric that matters, the constraints." },
  { n: "02", t: "Design", d: "Prototype the riskiest interaction first. Validate before scaling." },
  { n: "03", t: "Engineer", d: "Production code from day one. No throwaway demos." },
  { n: "04", t: "Ship", d: "Observability, evals, instrumentation. Land it cleanly." },
  { n: "05", t: "Compound", d: "Iterate on real signal. Every release should make the next one easier." },
];

function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ About</div>
          <h1 className="font-display text-6xl md:text-9xl tracking-tighter leading-[0.9]">A studio for <span className="text-gradient">ambitious</span> teams.</h1>
          <p className="mt-10 max-w-2xl text-lg text-foreground/70 leading-relaxed">
            Rony Tech Labs is a small senior team. We embed with founders and product leaders to build the next thing — fast, polished, in production.
          </p>
        </div>
      </section>

      <section className="py-32 px-4 md:px-8">
        <div className="mx-auto max-w-7xl space-y-32">
          {PILLARS.map((p, i) => (
            <motion.div key={p.word} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-150px" }} transition={{ duration: 0.8 }}
              className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="md:[direction:ltr]">
                <div className="font-display text-[clamp(4rem,15vw,12rem)] tracking-[-0.05em] leading-[0.85] text-gradient">{p.word}.</div>
              </div>
              <div className="md:[direction:ltr]">
                <p className="text-xl md:text-2xl text-foreground/80 leading-snug">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Process</div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.95] mb-16">How we work.</h2>
          <div className="grid md:grid-cols-5 gap-px bg-border/70 rounded-3xl overflow-hidden border border-border">
            {PROCESS.map((s) => (
              <div key={s.n} className="bg-card p-7">
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <div className="mt-4 font-display text-2xl">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

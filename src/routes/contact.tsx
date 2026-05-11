import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, Check, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MagneticButton } from "@/components/ui-kit/MagneticButton";
import { SITE } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rony Tech Labs" },
      { name: "description", content: "Tell us what you're building. We respond within 24 hours." },
      { property: "og:title", content: "Contact — Rony Tech Labs" },
    ],
  }),
  component: ContactPage,
});

const Schema = z.object({
  name: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Invalid email").max(320),
  phone: z.string().trim().max(50).optional(),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setLoading(true);
    const { error } = await supabase.from("contact_leads").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Couldn't send — try again or call us."); return; }
    setDone(true);
  };

  return (
    <section className="pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[5fr_7fr] gap-12 lg:gap-16">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Contact</div>
          <h1 className="font-display text-5xl md:text-6xl tracking-tighter leading-[0.95]">
            Let's build<br /><span className="text-gradient">something honest.</span>
          </h1>
          <p className="mt-6 text-foreground/70 max-w-md leading-relaxed">
            Tell us about your idea — no jargon, no hard sell. A real human from
            Ahmedabad replies within 24 hours with a clear next step and an
            honest estimate.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            {[
              ["24h", "Reply time"],
              ["120+", "Products shipped"],
              ["4.9★", "Client rating"],
              ["100%", "NDA-friendly"],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-3">
                <div className="font-display text-xl">{v}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <a href={`tel:${SITE.phone.replace(/\s/g,"")}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:bg-white/[0.08] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Call directly</div>
                <div className="font-mono text-base">{SITE.phone}</div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:bg-white/[0.08] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="text-base">{SITE.email}</div>
              </div>
            </a>
          </div>
        </div>

        <div>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-10 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center pulse-glow">
                <Check className="h-7 w-7 text-white" />
              </div>
              <h2 className="mt-6 font-display text-3xl tracking-tight">Message received.</h2>
              <p className="mt-3 text-foreground/70">We'll be in touch within 24 hours. In a hurry? Call <span className="font-mono">{SITE.phone}</span>.</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="glass-strong rounded-3xl p-6 md:p-8 space-y-5">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Project brief</div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your name" required value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="Aarav Sharma" />
                <Field label="Work email" required type="email" value={form.email} onChange={(v) => setForm(f => ({ ...f, email: v }))} placeholder="you@company.in" />
                <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} placeholder="+91 …" />
                <Field label="Company" value={form.company} onChange={(v) => setForm(f => ({ ...f, company: v }))} placeholder="Optional" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground/80">What are you building? <span className="text-destructive">*</span></label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Briefly describe the product, audience, and timeline. Even rough ideas are welcome."
                  className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50 resize-none placeholder:text-muted-foreground/60"
                />
                <div className="mt-1.5 text-[11px] text-muted-foreground">🔒 Your details stay private. We never share or sell.</div>
              </div>

              <MagneticButton type="submit" className="w-full justify-center" disabled={loading}>
                {loading ? "Sending…" : <>Send brief <ArrowRight className="h-4 w-4" /></>}
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground/80">{label}{required && <span className="text-destructive"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50 transition-shadow placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

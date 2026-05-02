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
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">/ Contact</div>
          <h1 className="font-display text-6xl md:text-7xl tracking-tighter leading-[0.92]">Let's <span className="text-gradient">talk</span>.</h1>
          <p className="mt-6 text-foreground/70 max-w-md">Tell us about the product. We respond within 24 hours with a clear next step.</p>

          <div className="mt-12 space-y-4">
            <a href={`tel:${SITE.phone.replace(/\s/g,"")}`} className="flex items-center gap-4 glass rounded-2xl p-5 hover:bg-white/[0.08] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Call directly</div>
                <div className="font-mono text-lg">{SITE.phone}</div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 glass rounded-2xl p-5 hover:bg-white/[0.08] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-lg">{SITE.email}</div>
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
            <form onSubmit={submit} className="glass-strong rounded-3xl p-8 space-y-4">
              {([
                ["name","Your name"],["email","Email"],["phone","Phone (optional)"],["company","Company (optional)"],
              ] as const).map(([k, label]) => (
                <div key={k}>
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <input
                    value={(form as never)[k]}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                    className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50 transition-shadow"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground">What are you building?</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50 resize-none"
                />
              </div>
              <MagneticButton type="submit" className="w-full justify-center" disabled={loading}>
                {loading ? "Sending…" : <>Send message <ArrowRight className="h-4 w-4" /></>}
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

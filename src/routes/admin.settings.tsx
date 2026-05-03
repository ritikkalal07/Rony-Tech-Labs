import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Globe, Share2, Flag, Mail } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

type Settings = {
  id: number;
  phone: string;
  email: string;
  admin_email: string;
  tagline: string;
  logo_url: string | null;
  social: Record<string, string>;
  feature_flags: Record<string, boolean>;
};

const TABS = [
  { id: "brand", label: "Brand", icon: Globe },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "social", label: "Social", icon: Share2 },
  { id: "flags", label: "Features", icon: Flag },
] as const;

function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("brand");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (error) { toast.error(error.message); return; }
      if (!data) { toast.error("Settings row missing"); return; }
      setS({
        ...(data as Settings),
        social: (data.social as Record<string, string>) ?? {},
        feature_flags: (data.feature_flags as Record<string, boolean>) ?? {},
        admin_email: (data as Settings).admin_email ?? "",
      });
    });
  }, []);

  if (!s) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      phone: s.phone, email: s.email, admin_email: s.admin_email, tagline: s.tagline, logo_url: s.logo_url,
      social: s.social, feature_flags: s.feature_flags,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  };

  const Field = ({ label, value, onChange, type = "text", hint, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string; placeholder?: string;
  }) => (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
      <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Site settings</h2>
          <p className="text-xs text-muted-foreground mt-1">Brand details, contact info & feature toggles for the public site.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-foreground text-background disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="flex gap-1 glass rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${tab === t.id ? "bg-foreground text-background" : "text-foreground/70 hover:bg-white/5"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "brand" && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <Field label="Tagline" value={s.tagline} onChange={v => setS({ ...s, tagline: v })} hint="Shown in the hero and meta description" />
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Logo</label>
            <ImageUpload value={s.logo_url ?? ""} onChange={v => setS({ ...s, logo_url: v })} />
          </div>
        </div>
      )}

      {tab === "contact" && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <Field label="Public phone" value={s.phone} onChange={v => setS({ ...s, phone: v })} hint="Displayed in header & footer" />
          <Field label="Public email" value={s.email} onChange={v => setS({ ...s, email: v })} type="email" hint="Visible to website visitors" />
          <Field label="Admin notification email" value={s.admin_email ?? ""} onChange={v => setS({ ...s, admin_email: v })} type="email"
            hint="New leads & chatbot conversations are forwarded here" />
        </div>
      )}

      {tab === "social" && (
        <div className="glass rounded-2xl p-6 space-y-5">
          {(["twitter", "linkedin", "instagram", "github"] as const).map(k => (
            <Field key={k} label={k} type="url" value={s.social[k] ?? ""} onChange={v => setS({ ...s, social: { ...s.social, [k]: v } })} placeholder="https://…" />
          ))}
        </div>
      )}

      {tab === "flags" && (
        <div className="glass rounded-2xl p-6 space-y-3">
          <p className="text-xs text-muted-foreground">Toggle public sections on or off without redeploying.</p>
          <div className="flex gap-2 flex-wrap">
            {(["lab", "chatbot"] as const).map(key => (
              <button key={key} onClick={() => setS({ ...s, feature_flags: { ...s.feature_flags, [key]: !s.feature_flags[key] } })}
                className={`px-4 py-2 rounded-xl text-sm capitalize ${s.feature_flags[key] ? "bg-foreground text-background" : "bg-white/5"}`}>
                {key}: {s.feature_flags[key] ? "On" : "Off"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

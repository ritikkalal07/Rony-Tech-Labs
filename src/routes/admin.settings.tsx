import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

type Settings = {
  id: number;
  phone: string;
  email: string;
  tagline: string;
  logo_url: string | null;
  social: Record<string, string>;
  feature_flags: Record<string, boolean>;
};

function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data, error }) => {
      if (error) { toast.error(error.message); return; }
      setS({
        ...(data as Settings),
        social: (data?.social as Record<string, string>) ?? {},
        feature_flags: (data?.feature_flags as Record<string, boolean>) ?? {},
      });
    });
  }, []);

  if (!s) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      phone: s.phone, email: s.email, tagline: s.tagline, logo_url: s.logo_url,
      social: s.social, feature_flags: s.feature_flags,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  };

  const field = (label: string, value: string, onChange: (v: string) => void, type: "text" | "url" = "text") => (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
      <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
    </div>
  );

  const flag = (key: string, label: string) => (
    <button onClick={() => setS({ ...s, feature_flags: { ...s.feature_flags, [key]: !s.feature_flags[key] } })}
      className={`px-4 py-2 rounded-xl text-sm ${s.feature_flags[key] ? "bg-foreground text-background" : "bg-white/5"}`}>
      {label}: {s.feature_flags[key] ? "On" : "Off"}
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Site settings</h2>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-foreground text-background disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        {field("Phone", s.phone, v => setS({ ...s, phone: v }))}
        {field("Email", s.email, v => setS({ ...s, email: v }))}
        {field("Tagline", s.tagline, v => setS({ ...s, tagline: v }))}
        {field("Logo URL", s.logo_url ?? "", v => setS({ ...s, logo_url: v }), "url")}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="font-display text-lg">Social</div>
        {field("Twitter / X", s.social.twitter ?? "", v => setS({ ...s, social: { ...s.social, twitter: v } }), "url")}
        {field("LinkedIn", s.social.linkedin ?? "", v => setS({ ...s, social: { ...s.social, linkedin: v } }), "url")}
        {field("Instagram", s.social.instagram ?? "", v => setS({ ...s, social: { ...s.social, instagram: v } }), "url")}
        {field("GitHub", s.social.github ?? "", v => setS({ ...s, social: { ...s.social, github: v } }), "url")}
      </div>

      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="font-display text-lg">Feature flags</div>
        <div className="flex gap-2 flex-wrap">
          {flag("lab", "Lab")}
          {flag("chatbot", "Chatbot")}
        </div>
      </div>
    </div>
  );
}

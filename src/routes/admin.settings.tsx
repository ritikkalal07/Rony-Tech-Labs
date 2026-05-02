import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/settings")({ component: () => (
  <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
    <h2 className="font-display text-2xl text-foreground">Site settings</h2>
    <p className="mt-3">Phone, branding and feature flags live in the <code className="font-mono px-1.5 py-0.5 rounded bg-white/10">site_settings</code> table — editable in Lovable Cloud's data viewer.</p>
  </div>
)});

import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/services")({ component: () => (
  <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
    <h2 className="font-display text-2xl text-foreground">Services</h2>
    <p className="mt-3">Edit services in Lovable Cloud's data viewer for now — full inline editing coming next.</p>
  </div>
)});

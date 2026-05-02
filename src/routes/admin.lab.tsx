import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/lab")({ component: () => (
  <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
    <h2 className="font-display text-2xl text-foreground">Lab items</h2>
    <p className="mt-3">Edit lab experiments in Lovable Cloud's data viewer — admin UI coming next.</p>
  </div>
)});

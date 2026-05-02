import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/insights")({ component: () => (
  <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
    <h2 className="font-display text-2xl text-foreground">Insights</h2>
    <p className="mt-3">Edit posts in Lovable Cloud's data viewer — full WYSIWYG editor coming next.</p>
  </div>
)});

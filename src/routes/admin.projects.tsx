import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/projects")({ component: () => <Stub title="Projects" /> });
function Stub({ title }: { title: string }) {
  return (
    <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <p className="mt-3">Full CRUD for {title.toLowerCase()} is scaffolded in the database (with RLS). The admin UI for create/edit/delete will be added in the next iteration.</p>
      <p className="mt-3">In the meantime, content is editable directly in Lovable Cloud's data viewer, and changes appear instantly on the public site.</p>
    </div>
  );
}

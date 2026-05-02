import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function useCount(table: "projects" | "posts" | "services" | "contact_leads" | "chatbot_leads") {
  return useQuery({
    queryKey: ["count", table],
    queryFn: async () => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
}

function Dashboard() {
  const projects = useCount("projects");
  const posts = useCount("posts");
  const services = useCount("services");
  const contact = useCount("contact_leads");
  const chat = useCount("chatbot_leads");

  const cards = [
    { label: "Projects", v: projects.data },
    { label: "Insights", v: posts.data },
    { label: "Services", v: services.data },
    { label: "Contact leads", v: contact.data },
    { label: "Chatbot leads", v: chat.data },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Welcome back.</h1>
      <p className="text-muted-foreground mt-1 text-sm">Quick snapshot of your studio.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
            <div className="mt-3 font-display text-4xl">{c.v ?? "—"}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 glass rounded-2xl p-6 text-sm text-muted-foreground">
        <strong className="text-foreground">First-time setup:</strong> create your account on the sign-in page,
        then ask the studio to grant your account the <code className="font-mono px-1.5 py-0.5 rounded bg-white/10">admin</code> role
        so you can manage content. Until then, this dashboard is read-only.
      </div>
    </div>
  );
}

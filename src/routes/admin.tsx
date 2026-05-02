import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FolderKanban, Wrench, FileText, Inbox, Settings, LogOut, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rony Tech Labs" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/admin/services", label: "Services", icon: Wrench, exact: false },
  { to: "/admin/insights", label: "Insights", icon: FileText, exact: false },
  { to: "/admin/lab", label: "Lab", icon: Beaker, exact: false },
  { to: "/admin/leads", label: "Leads", icon: Inbox, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!session && path !== "/admin/login") {
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    return null;
  }
  if (path === "/admin/login") return <Outlet />;

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-background">
      <aside className="border-r border-white/5 p-4 flex flex-col">
        <Link to="/" className="px-3 py-3 font-display text-lg">Rony <span className="text-gradient">Admin</span></Link>
        <nav className="mt-6 space-y-1 flex-1">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-white/10 text-foreground" : "text-foreground/60 hover:bg-white/5"
              )}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
          className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:bg-white/5"
        ><LogOut className="h-4 w-4" /> Sign out</button>
      </aside>
      <div className="p-8 overflow-y-auto"><Outlet /></div>
    </div>
  );
}

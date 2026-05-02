import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const contact = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => (await supabase.from("contact_leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const chat = useQuery({
    queryKey: ["admin-chat"],
    queryFn: async () => (await supabase.from("chatbot_leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const exportCsv = (rows: Record<string, unknown>[], name: string) => {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(","), ...rows.map(r => cols.map(c => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${name}.csv`; a.click();
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Contact form leads</h2>
          <button onClick={() => exportCsv(contact.data ?? [], "contact-leads")} className="text-xs px-3 py-1.5 rounded-lg glass">Export CSV</button>
        </div>
        <div className="mt-4 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-white/5">
              <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Message</th></tr>
            </thead>
            <tbody>
              {(contact.data ?? []).map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="p-3 text-muted-foreground font-mono text-xs">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-3">{l.name}</td>
                  <td className="p-3">{l.email}</td>
                  <td className="p-3 max-w-md truncate text-foreground/80">{l.message}</td>
                </tr>
              ))}
              {!contact.data?.length && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No leads yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Chatbot leads</h2>
          <button onClick={() => exportCsv(chat.data ?? [], "chatbot-leads")} className="text-xs px-3 py-1.5 rounded-lg glass">Export CSV</button>
        </div>
        <div className="mt-4 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-white/5">
              <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Name</th><th className="text-left p-3">Contact</th><th className="text-left p-3">Intent</th></tr>
            </thead>
            <tbody>
              {(chat.data ?? []).map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="p-3 text-muted-foreground font-mono text-xs">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-3">{l.name}</td>
                  <td className="p-3">{l.contact}</td>
                  <td className="p-3 max-w-md truncate text-foreground/80">{l.intent}</td>
                </tr>
              ))}
              {!chat.data?.length && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No chatbot leads yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

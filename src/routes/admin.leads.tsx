import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { Download, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

type Json = Record<string, unknown>;

function LeadsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Json | null>(null);

  const contact = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => (await supabase.from("contact_leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const chat = useQuery({
    queryKey: ["admin-chat"],
    queryFn: async () => (await supabase.from("chatbot_leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  // Realtime
  useEffect(() => {
    const ch = supabase.channel("leads-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_leads" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-contact"] });
        toast.success("New contact lead", { duration: 2500 });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "chatbot_leads" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-chat"] });
        toast.success("New chatbot lead", { duration: 2500 });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const exportXlsx = (rows: Json[], name: string) => {
    if (!rows.length) { toast.error("Nothing to export"); return; }
    const flat = rows.map(r => Object.fromEntries(
      Object.entries(r).map(([k, v]) => [k, typeof v === "object" && v !== null ? JSON.stringify(v) : v])
    ));
    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, `${name}-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="space-y-10">
      <Section
        title="Contact form leads"
        subtitle={`${contact.data?.length ?? 0} total · live updates`}
        onExport={() => exportXlsx(contact.data ?? [], "contact-leads")}
      >
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-white/5">
            <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Message</th></tr>
          </thead>
          <tbody>
            {(contact.data ?? []).map((l: Json) => (
              <tr key={String(l.id)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(l)}>
                <td className="p-3 text-muted-foreground font-mono text-xs">{new Date(String(l.created_at)).toLocaleString()}</td>
                <td className="p-3">{String(l.name ?? "")}</td>
                <td className="p-3">{String(l.email ?? "")}</td>
                <td className="p-3">{String(l.phone ?? "—")}</td>
                <td className="p-3 max-w-md truncate text-foreground/80">{String(l.message ?? "")}</td>
              </tr>
            ))}
            {!contact.data?.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No leads yet.</td></tr>}
          </tbody>
        </table>
      </Section>

      <Section
        title="Chatbot leads"
        subtitle={`${chat.data?.length ?? 0} total · with AI conversation notes`}
        onExport={() => exportXlsx(chat.data ?? [], "chatbot-leads")}
      >
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-white/5">
            <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Name</th><th className="text-left p-3">Contact</th><th className="text-left p-3">Intent</th><th className="text-left p-3">Score</th></tr>
          </thead>
          <tbody>
            {(chat.data ?? []).map((l: Json) => {
              const n = (l.notes ?? {}) as Json;
              return (
                <tr key={String(l.id)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(l)}>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{new Date(String(l.created_at)).toLocaleString()}</td>
                  <td className="p-3">{String(l.name ?? "")}</td>
                  <td className="p-3">{String(l.contact ?? "")}</td>
                  <td className="p-3 max-w-xs truncate text-foreground/80">{String(n.intent ?? l.intent ?? "")}</td>
                  <td className="p-3">{n.interest_score ? <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--electric))]/20 text-[hsl(var(--electric))] text-xs">{String(n.interest_score)}/10</span> : "—"}</td>
                </tr>
              );
            })}
            {!chat.data?.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No chatbot leads yet.</td></tr>}
          </tbody>
        </table>
      </Section>

      {selected && <DetailDrawer row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Section({ title, subtitle, onExport, children }: { title: string; subtitle: string; onExport: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <button onClick={onExport} className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg glass hover:bg-white/10">
          <Download className="h-3.5 w-3.5" /> Export Excel
        </button>
      </div>
      <div className="mt-4 glass rounded-2xl overflow-hidden">{children}</div>
    </div>
  );
}

function DetailDrawer({ row, onClose }: { row: Json; onClose: () => void }) {
  const notes = (row.notes ?? {}) as { summary?: string; key_points?: string[]; interest_score?: number; intent?: string };
  const transcript = Array.isArray(row.transcript) ? (row.transcript as { role: string; content: string }[]) : [];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-background border-l border-white/10 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 flex items-center justify-between border-b border-white/10 sticky top-0 bg-background z-10">
          <div className="font-display text-xl">Lead details</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Name" value={String(row.name ?? "—")} />
            <Info label="Contact" value={String(row.contact ?? row.email ?? "—")} />
            <Info label="Phone" value={String(row.phone ?? "—")} />
            <Info label="Date" value={new Date(String(row.created_at)).toLocaleString()} />
          </div>

          {(notes.summary || notes.key_points) && (
            <div className="rounded-xl border border-[hsl(var(--electric))]/30 bg-[hsl(var(--electric))]/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[hsl(var(--electric))]">
                <Sparkles className="h-3.5 w-3.5" /> AI notes
              </div>
              {notes.intent && <div className="text-sm"><span className="text-muted-foreground">Intent: </span>{notes.intent}</div>}
              {notes.summary && <p className="text-sm text-foreground/90">{notes.summary}</p>}
              {notes.key_points && (
                <ul className="text-sm space-y-1 list-disc pl-5 text-foreground/80">
                  {notes.key_points.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              )}
            </div>
          )}

          {row.message && (
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Message</div>
              <p className="text-sm whitespace-pre-wrap bg-white/5 rounded-xl p-4">{String(row.message)}</p>
            </div>
          )}

          {transcript.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Transcript</div>
              <div className="space-y-2">
                {transcript.map((m, i) => (
                  <div key={i} className={`text-sm rounded-lg p-3 ${m.role === "user" ? "bg-[hsl(var(--electric))]/10" : "bg-white/5"}`}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{m.role}</div>
                    <div className="text-foreground/90 whitespace-pre-wrap">{m.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground/90 break-all">{value}</div>
    </div>
  );
}

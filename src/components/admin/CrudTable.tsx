import { useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "tags" | "url" | "image" | "select";
  placeholder?: string;
  rows?: number;
  hint?: string;
  options?: { value: string; label: string }[];
};

type Row = Record<string, unknown> & { id: string };

type Props = {
  table: "projects" | "services" | "posts" | "lab_items";
  title: string;
  listColumns: { key: string; label: string; render?: (r: Row) => ReactNode }[];
  fields: Field[];
  defaults: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
};

export function CrudTable({ table, title, listColumns, fields, defaults, orderBy = { column: "created_at", ascending: false } }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useQuery({
    queryKey: ["admin-list", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy.column, { ascending: orderBy.ascending ?? false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (row: Row) => {
      const { id, ...rest } = row as Row & Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase.from(table) as any;
      if (id) {
        const { error } = await client.update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await client.insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-list", table] });
      toast.success("Saved");
      setEditing(null); setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-list", table] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const open = creating ? ({ id: "", ...defaults } as Row) : editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">{title}</h2>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-foreground text-background">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-white/5">
            <tr>
              {listColumns.map(c => <th key={c.key} className="text-left p-3">{c.label}</th>)}
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map(row => (
              <tr key={row.id} className="border-t border-white/5">
                {listColumns.map(c => (
                  <td key={c.key} className="p-3 max-w-xs truncate text-foreground/80">
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(row); setCreating(false); }} className="p-1.5 rounded hover:bg-white/10 mr-1"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { if (confirm("Delete this row?")) del.mutate(row.id); }} className="p-1.5 rounded hover:bg-white/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
            {!list.data?.length && <tr><td colSpan={listColumns.length + 1} className="p-8 text-center text-muted-foreground">No rows yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <EditDrawer row={open} fields={fields} onClose={() => { setEditing(null); setCreating(false); }} onSave={(r) => upsert.mutate(r)} saving={upsert.isPending} />
      )}
    </div>
  );
}

function EditDrawer({ row, fields, onClose, onSave, saving }: { row: Row; fields: Field[]; onClose: () => void; onSave: (r: Row) => void; saving: boolean }) {
  const [state, setState] = useState<Row>(row);
  const set = (k: string, v: unknown) => setState(s => ({ ...s, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-background border-l border-white/10 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 flex items-center justify-between border-b border-white/10 sticky top-0 bg-background z-10">
          <div className="font-display text-xl">{state.id ? "Edit" : "Create"}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => onSave(state)} disabled={saving} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-foreground text-background disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea rows={f.rows ?? 5} value={String(state[f.name] ?? "")} onChange={e => set(f.name, e.target.value)} placeholder={f.placeholder}
                  className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40 font-mono text-sm" />
              ) : f.type === "boolean" ? (
                <div className="mt-1.5">
                  <button onClick={() => set(f.name, !state[f.name])}
                    className={`px-4 py-2 rounded-xl text-sm ${state[f.name] ? "bg-foreground text-background" : "bg-white/5"}`}>
                    {state[f.name] ? "Yes" : "No"}
                  </button>
                </div>
              ) : f.type === "number" ? (
                <input type="number" value={Number(state[f.name] ?? 0)} onChange={e => set(f.name, Number(e.target.value))}
                  className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
              ) : f.type === "tags" ? (
                <input value={(Array.isArray(state[f.name]) ? (state[f.name] as string[]).join(", ") : "")}
                  onChange={e => set(f.name, e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="comma, separated, tags"
                  className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
              ) : (
                <input type={f.type === "url" ? "url" : "text"} value={String(state[f.name] ?? "")} onChange={e => set(f.name, e.target.value)} placeholder={f.placeholder}
                  className="mt-1.5 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

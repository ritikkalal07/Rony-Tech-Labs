import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setBusy(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `uploads/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) { toast.error(error.message); setBusy(false); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast.success("Image uploaded");
  };

  return (
    <div className="mt-1.5 space-y-2">
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      {value ? (
        <div className="relative inline-block group">
          <img src={value} alt="" className="h-32 w-auto rounded-lg border border-white/10 object-cover" />
          <button type="button" onClick={() => onChange("")}
            className="absolute -top-2 -right-2 h-6 w-6 grid place-items-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="h-3 w-3" />
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-black/70 text-white">Replace</button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="w-full border-2 border-dashed border-white/15 rounded-xl py-8 grid place-items-center text-sm text-muted-foreground hover:bg-white/5 hover:border-white/30 transition-colors disabled:opacity-50">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5 mb-1" /> Click to upload image</>}
        </button>
      )}
      <input value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder="…or paste an image URL"
        className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40" />
    </div>
  );
}

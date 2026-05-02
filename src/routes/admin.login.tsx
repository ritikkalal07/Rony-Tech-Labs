import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "signup") toast.success("Account created. Ask the studio to grant admin access.");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-background">
      <form onSubmit={submit} className="glass-strong rounded-3xl p-8 w-full max-w-sm space-y-4">
        <div className="font-display text-2xl">Admin {mode === "signin" ? "sign in" : "sign up"}</div>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/50" />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-foreground text-background font-medium">
          {loading ? "…" : (mode === "signin" ? "Sign in" : "Create account")}
        </button>
        <button type="button" onClick={() => setMode(m => m === "signin" ? "signup" : "signin")} className="w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

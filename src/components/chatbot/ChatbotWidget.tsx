import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { chat } from "@/server/chat.functions";
import { summarizeChat } from "@/server/chat-summary.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Build me a website",
  "AI automation for my business",
  "See your work",
  "Get a quote",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("rtl-chat") || "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({ name: "", contact: "" });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(chat);
  const summarizeFn = useServerFn(summarizeChat);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("rtl-chat", JSON.stringify(messages.slice(-30)));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Auto-save lead with AI summary when user closes a meaningful conversation
  const autoSaveLead = async (msgs: Msg[]) => {
    if (msgs.length < 4 || leadSent) return;
    try {
      const res = await summarizeFn({ data: { messages: msgs } });
      if (!res.ok) return;
      const sum = res.summary as { intent?: string; summary?: string; key_points?: string[]; interest_score?: number; name?: string | null; contact?: string | null };
      await supabase.from("chatbot_leads").insert({
        name: contact.name.trim() || sum.name || "Anonymous visitor",
        contact: contact.contact.trim() || sum.contact || "—",
        intent: sum.intent ?? null,
        transcript: msgs as unknown as never,
        notes: sum as unknown as never,
      });
      setLeadSent(true);
    } catch (e) { console.error("autoSaveLead", e); }
  };

  // Save when widget closes after exchange
  useEffect(() => {
    if (!open && messages.length >= 4 && !leadSent) {
      autoSaveLead(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatFn({ data: { messages: next } });
      if (res.ok) {
        setMessages([...next, { role: "assistant", content: res.reply }]);
        if (next.length >= 2 && !leadSent && !showLeadForm) {
          const intentMatch = /price|quote|hire|build|cost|timeline|when|start/i.test(text);
          if (intentMatch) setShowLeadForm(true);
        }
      } else {
        setMessages([...next, { role: "assistant", content: `_${res.error}_` }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "_Network hiccup. Please try again._" }]);
    } finally { setLoading(false); }
  };

  const submitLead = async () => {
    if (!contact.name.trim() || !contact.contact.trim()) return;
    try {
      // Generate AI summary alongside manual submission
      let notes: unknown = {};
      try {
        const res = await summarizeFn({ data: { messages } });
        if (res.ok) notes = res.summary;
      } catch { /* non-fatal */ }
      await supabase.from("chatbot_leads").insert({
        name: contact.name.trim(),
        contact: contact.contact.trim(),
        intent: messages.find((m) => m.role === "user")?.content ?? null,
        transcript: messages as unknown as never,
        notes: notes as never,
      });
      setLeadSent(true);
      setShowLeadForm(false);
      setMessages((m) => [...m, { role: "assistant", content: `Thanks, **${contact.name}** — a strategist will reach out shortly. You can also call **82000 61970** directly.` }]);
    } catch (e) { console.error(e); }
  };


  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full glass-strong grid place-items-center shadow-[0_0_40px_hsl(var(--electric)/0.5)] hover:shadow-[0_0_60px_hsl(var(--electric)/0.8)] transition-shadow"
        data-cursor="hover"
        aria-label="Open chat"
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[hsl(var(--electric))]/30 to-[hsl(var(--teal))]/30 blur-md" />
        <div className="relative">
          {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-8rem))] bg-white text-slate-900 rounded-3xl flex flex-col overflow-hidden shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] border border-slate-200"
          >
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3 bg-white">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] grid place-items-center pulse-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Rony AI · Concierge</div>
                <div className="text-[11px] text-slate-500">Live • typically replies in seconds</div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-sm bg-white">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-slate-700 leading-relaxed">
                    Namaste 🙏 — I'm <span className="text-gradient font-semibold">Rony AI</span>.
                    Ask me about pricing, timelines, or pick a starter:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-xs px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--electric))]/85 text-white shadow-sm"
                      : "bg-slate-100 text-slate-900 border border-slate-200",
                  )}>
                    {m.role === "assistant"
                      ? <div className="prose prose-sm max-w-none text-slate-900 [&>*]:my-1.5 [&_a]:text-[hsl(var(--electric))]"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                      : <span>{m.content}</span>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1.5 px-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]" />
                </div>
              )}

              {showLeadForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[hsl(var(--electric))]/40 bg-[hsl(var(--electric))]/5 p-4 space-y-2.5"
                >
                  <div className="text-xs text-slate-600">Want a strategist to call you back?</div>
                  <input
                    placeholder="Your name"
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40"
                  />
                  <input
                    placeholder="Email or phone"
                    value={contact.contact}
                    onChange={(e) => setContact((c) => ({ ...c, contact: e.target.value }))}
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40"
                  />
                  <div className="flex gap-2">
                    <button onClick={submitLead} className="flex-1 rounded-lg bg-slate-900 text-white px-3 py-2 text-xs font-medium hover:bg-slate-800">Send</button>
                    <button onClick={() => setShowLeadForm(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">Later</button>
                  </div>
                </motion.div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-slate-200 flex gap-2 bg-white"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a project, service, or quote…"
                disabled={loading}
                className="flex-1 rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[hsl(var(--electric))]/40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 w-10 grid place-items-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
                aria-label="Send"
              ><Send className="h-4 w-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(8000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
});

const SYSTEM_PROMPT = `You are the AI concierge for Rony Tech Labs — a premium digital innovation studio.

About us:
- We build production-grade web platforms, mobile apps, AI copilots, custom software, design systems and lifecycle marketing.
- Services: Web Development, WordPress, Mobile & Web Apps, AI & Automation, Digital Marketing, Design Systems (Canva), Custom Software, Tech Consulting.
- Phone: +91 82000 61970. Email: ronytechlabs@gmail.com. Based in Ahmedabad, India — serving clients across India and globally.
- Pages: /services /projects /lab /insights /contact /about

Voice: confident, concise, slightly futuristic. Never use emoji. Use markdown sparingly (bold, lists). Keep responses tight (3-6 sentences unless the user asks for more).

When a visitor shows buying intent (asks about pricing, timelines, "build me X", "I need X"), warmly invite them to share their name + email/phone so a strategist can follow up — and tell them they can also call 82000 61970 directly. Otherwise, answer questions, suggest the most relevant page, and end with a small forward-moving CTA when natural.`;

export const chat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured. LOVABLE_API_KEY missing." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
        }),
      });

      if (res.status === 429) return { ok: false as const, error: "Too many requests. Please wait a moment and try again." };
      if (res.status === 402) return { ok: false as const, error: "AI credits exhausted. Please contact us at 82000 61970." };
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "AI service is temporarily unavailable." };
      }

      const json = await res.json();
      const reply: string = json.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, reply };
    } catch (e) {
      console.error("chat handler failed", e);
      return { ok: false as const, error: "Something went wrong reaching the AI." };
    }
  });

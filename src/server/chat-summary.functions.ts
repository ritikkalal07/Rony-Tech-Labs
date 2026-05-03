import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(8000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(2).max(60),
});

const SUMMARY_PROMPT = `You analyse a chat transcript between a website visitor and the Rony Tech Labs AI concierge.
Return strict JSON with these keys:
- "intent": one short phrase capturing what the visitor wants (e.g. "AI automation for ecommerce")
- "summary": 2–3 sentence neutral summary of the conversation
- "key_points": array of 3–6 short bullets capturing important facts (budget, timeline, tech, contact info)
- "interest_score": integer 1–10 indicating buying intent
- "name": the visitor's name if mentioned, else null
- "contact": the visitor's email or phone if mentioned, else null
Only return the JSON object, no prose.`;

export const summarizeChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI not configured" };

    const transcript = data.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SUMMARY_PROMPT },
            { role: "user", content: transcript },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) return { ok: false as const, error: `AI ${res.status}` };
      const json = await res.json();
      const raw: string = json.choices?.[0]?.message?.content ?? "{}";
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      return { ok: true as const, summary: parsed };
    } catch (e) {
      console.error("summarizeChat failed", e);
      return { ok: false as const, error: "Failed to summarise" };
    }
  });

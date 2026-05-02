import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Rony Tech Labs` },
      { property: "og:title", content: `${params.slug} — Rony Tech Labs` },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div className="pt-40 px-8 text-center text-muted-foreground">Loading…</div>;
  if (!data) throw notFound();

  const metrics = (data.metrics as Array<{ label: string; value: string }>) ?? [];

  return (
    <article className="pt-32 pb-32">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"><ArrowLeft className="h-4 w-4" /> All projects</Link>
        <div className="text-xs font-mono text-muted-foreground">{data.category} · {data.year}</div>
        <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-tighter leading-[0.95]">{data.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70">{data.summary}</p>
      </div>

      {data.hero_url && (
        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-14">
          <div className="overflow-hidden rounded-3xl aspect-[21/9]">
            <img src={data.hero_url} alt={data.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-16 grid md:grid-cols-3 gap-px bg-border/70 rounded-3xl overflow-hidden border border-border">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{m.label}</div>
            <div className="mt-2 font-display text-4xl tracking-tight text-gradient">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-8 mt-20 prose prose-lg">
        <p className="text-foreground/80 whitespace-pre-line">{data.body}</p>
        {data.tech?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 not-prose">
            {data.tech.map((t: string) => <span key={t} className="px-3 py-1.5 rounded-full text-xs glass">{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

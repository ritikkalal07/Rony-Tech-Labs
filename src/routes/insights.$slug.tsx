import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Insights` },
      { property: "og:title", content: `${params.slug} — Insights` },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div className="pt-40 px-8 text-center text-muted-foreground">Loading…</div>;
  if (!data) throw notFound();

  return (
    <article className="pt-32 pb-32">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"><ArrowLeft className="h-4 w-4" /> All insights</Link>
        <div className="text-xs font-mono text-muted-foreground">{new Date(data.published_at).toLocaleDateString()} · {data.read_minutes} min read</div>
        <h1 className="mt-4 font-display text-5xl md:text-6xl tracking-tighter leading-[0.95]">{data.title}</h1>
        <p className="mt-4 text-lg text-foreground/70">{data.excerpt}</p>
      </div>
      {data.cover_url && (
        <div className="mx-auto max-w-5xl px-4 md:px-8 mt-12">
          <div className="overflow-hidden rounded-3xl aspect-[21/9]">
            <img src={data.cover_url} alt={data.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl px-4 md:px-8 mt-12 prose prose-lg">
        <ReactMarkdown>{data.body}</ReactMarkdown>
      </div>
    </article>
  );
}

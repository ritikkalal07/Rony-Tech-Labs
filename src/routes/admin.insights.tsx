import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/insights")({ component: InsightsAdmin });

function InsightsAdmin() {
  return (
    <CrudTable
      table="posts"
      title="Insights"
      orderBy={{ column: "published_at", ascending: false }}
      listColumns={[
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "read_minutes", label: "Read" },
        { key: "published", label: "Live", render: (r) => (r.published ? "●" : "○") },
      ]}
      defaults={{
        slug: "", title: "", excerpt: "", cover_url: "", body: "",
        tags: [], author: "Rony Tech Labs", read_minutes: 5, published: true,
      }}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "author", label: "Author" },
        { name: "read_minutes", label: "Read minutes", type: "number" },
        { name: "cover_url", label: "Cover image URL", type: "url" },
        { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
        { name: "body", label: "Body (Markdown)", type: "textarea", rows: 16 },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  );
}

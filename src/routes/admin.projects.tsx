import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

function ProjectsAdmin() {
  return (
    <CrudTable
      table="projects"
      title="Projects"
      orderBy={{ column: "sort_order", ascending: true }}
      listColumns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "client", label: "Client" },
        { key: "year", label: "Year" },
        { key: "featured", label: "Featured", render: (r) => (r.featured ? "★" : "—") },
        { key: "published", label: "Live", render: (r) => (r.published ? "●" : "○") },
      ]}
      defaults={{
        slug: "", title: "", category: "Web", summary: "", body: "", hero_url: "",
        gallery: [], metrics: [], tech: [], client: "", year: new Date().getFullYear(),
        featured: false, published: true, sort_order: 0,
      }}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug", placeholder: "kebab-case-url" },
        { name: "category", label: "Category", placeholder: "Web / AI / Mobile" },
        { name: "client", label: "Client" },
        { name: "year", label: "Year", type: "number" },
        { name: "hero_url", label: "Hero image URL", type: "url" },
        { name: "summary", label: "Summary", type: "textarea", rows: 3 },
        { name: "body", label: "Body (Markdown)", type: "textarea", rows: 12 },
        { name: "tech", label: "Tech stack", type: "tags" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "featured", label: "Featured", type: "boolean" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  );
}

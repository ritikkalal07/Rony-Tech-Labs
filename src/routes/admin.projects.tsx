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
        { name: "title", label: "Title", placeholder: "Project name shown to visitors" },
        { name: "slug", label: "URL slug", placeholder: "e.g. acme-redesign", hint: "Lowercase, dashes only. Becomes /projects/<slug>" },
        { name: "category", label: "Category", type: "select", options: [
          { value: "Web", label: "Web" }, { value: "AI", label: "AI" }, { value: "Mobile", label: "Mobile" },
          { value: "Design", label: "Design" }, { value: "Software", label: "Software" },
        ]},
        { name: "client", label: "Client name" },
        { name: "year", label: "Year", type: "number" },
        { name: "hero_url", label: "Hero image", type: "image", hint: "Upload or paste a URL — used in cards and detail page" },
        { name: "summary", label: "Short summary", type: "textarea", rows: 3, hint: "1–2 sentences shown in listings" },
        { name: "body", label: "Full case study (Markdown)", type: "textarea", rows: 12 },
        { name: "tech", label: "Tech stack", type: "tags", hint: "Press comma to add" },
        { name: "sort_order", label: "Sort order", type: "number", hint: "Lower numbers appear first" },
        { name: "featured", label: "Featured on homepage", type: "boolean" },
        { name: "published", label: "Published (visible publicly)", type: "boolean" },
      ]}
    />
  );
}

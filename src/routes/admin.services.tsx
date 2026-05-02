import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

function ServicesAdmin() {
  return (
    <CrudTable
      table="services"
      title="Services"
      orderBy={{ column: "sort_order", ascending: true }}
      listColumns={[
        { key: "name", label: "Name" },
        { key: "icon", label: "Icon" },
        { key: "sort_order", label: "Order" },
        { key: "published", label: "Live", render: (r) => (r.published ? "●" : "○") },
      ]}
      defaults={{ slug: "", name: "", icon: "Sparkles", short_desc: "", long_desc: "", sort_order: 0, published: true }}
      fields={[
        { name: "name", label: "Name" },
        { name: "slug", label: "Slug" },
        { name: "icon", label: "Lucide icon name", placeholder: "Sparkles" },
        { name: "short_desc", label: "Short description", type: "textarea", rows: 2 },
        { name: "long_desc", label: "Long description", type: "textarea", rows: 8 },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  );
}

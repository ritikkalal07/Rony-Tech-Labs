import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/lab")({ component: LabAdmin });

function LabAdmin() {
  return (
    <CrudTable
      table="lab_items"
      title="Lab experiments"
      orderBy={{ column: "sort_order", ascending: true }}
      listColumns={[
        { key: "title", label: "Title" },
        { key: "demo_type", label: "Type" },
        { key: "sort_order", label: "Order" },
        { key: "published", label: "Live", render: (r) => (r.published ? "●" : "○") },
      ]}
      defaults={{ title: "", description: "", demo_type: "shader", config: {}, sort_order: 0, published: true }}
      fields={[
        { name: "title", label: "Title" },
        { name: "demo_type", label: "Demo type", placeholder: "shader / 3d / canvas" },
        { name: "description", label: "Description", type: "textarea", rows: 4 },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  );
}

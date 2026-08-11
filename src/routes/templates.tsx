import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Grid2x2, Lightbulb } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { createMap } from "@/lib/mindmap";
import { TEMPLATES, type TemplateId } from "@/lib/templates";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Mind Mapping Studio" },
      {
        name: "description",
        content: "Start faster with Study Planner, SWOT Analysis and Brainstorming Map templates.",
      },
      { property: "og:title", content: "Templates — Mind Mapping Studio" },
      {
        property: "og:description",
        content: "Start faster with Study Planner, SWOT Analysis and Brainstorming Map templates.",
      },
    ],
  }),
  component: TemplatesPage,
});

const icons: Record<TemplateId, typeof CalendarCheck> = {
  "study-planner": CalendarCheck,
  swot: Grid2x2,
  brainstorm: Lightbulb,
};

function TemplatesPage() {
  const navigate = useNavigate();

  function useTemplate(id: TemplateId) {
    const template = TEMPLATES.find((t) => t.id === id);
    if (!template) return;
    const { nodes, connections } = template.build();
    const doc = createMap(template.mapTitle, nodes, connections);
    void navigate({ to: "/canvas", search: { map: doc.id } });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a starting point instead of a blank canvas.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => {
            const Icon = icons[template.id];
            return (
              <article
                key={template.id}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold">{template.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                <button
                  type="button"
                  onClick={() => useTemplate(template.id)}
                  className="mt-5 inline-flex rounded-xl border border-border px-3 py-2 text-sm font-medium transition-colors group-hover:border-primary group-hover:text-primary"
                >
                  Use template
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

import { OrgChartCanvas } from "@/components/dashboard/orgchart-canvas";

export default function OrgChartPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-8 py-5">
        <div>
          <span className="section-num">Módulo</span>
          <h1 className="mt-1 font-display text-3xl leading-tight">Org chart</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--flow-moss))]" />
          Cambios guardados localmente
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <OrgChartCanvas />
      </div>
    </div>
  );
}

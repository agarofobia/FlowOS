import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Users, CreditCard, Sparkles, type LucideIcon } from "lucide-react";

export default async function DashboardHome() {
  const { orgId, orgRole } = await auth();
  const user = await currentUser();

  const greeting = getGreeting();
  const firstName = user?.firstName || "amigo";

  return (
    <div className="mx-auto max-w-6xl px-8 py-12">
      {/* Hero */}
      <header className="mb-12">
        <span className="section-num">{greeting.toUpperCase()}</span>
        <h1 className="mt-3 font-display text-5xl leading-tight tracking-tight md:text-6xl">
          Hola, {firstName}.
          <br />
          <span className="italic text-[hsl(var(--muted-foreground))]">
            ¿En qué te puedo ayudar?
          </span>
        </h1>
      </header>

      <div className="rule mb-10" />

      {/* Quick actions grid */}
      <section className="mb-12">
        <span className="section-num">Acciones rápidas</span>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/dashboard/orgchart"
            icon={GitBranch}
            title="Diseñar org chart"
            description="Visualizá la estructura de tu equipo en el canvas infinito."
            accent="ochre"
          />
          <ActionCard
            href="/dashboard/team"
            icon={Users}
            title="Invitar miembros"
            description="Sumá a tu equipo. Asigná roles. Empezá a colaborar."
            accent="rust"
          />
          <ActionCard
            href="/dashboard/billing"
            icon={CreditCard}
            title="Ver tu plan"
            description="Plan Free activo. Subí cuando lo necesites."
            accent="moss"
          />
        </div>
      </section>

      <div className="rule mb-10" />

      {/* Stats / Highlights */}
      <section className="mb-12 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="section-num">Estado</span>
          <h2 className="mt-3 font-display text-3xl leading-tight">
            Tu organización
          </h2>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            Estos números se actualizan en tiempo real.
          </p>
        </div>
        <div className="md:col-span-8 grid grid-cols-2 gap-px bg-[hsl(var(--border))] border border-[hsl(var(--border))]">
          <Stat label="Miembros" value="1" sub="vos solo, por ahora" />
          <Stat label="Departamentos" value="0" sub="creá el primero" />
          <Stat label="Proyectos" value="0" sub="próximamente" />
          <Stat
            label="Tu rol"
            value={orgRole === "org:admin" ? "Admin" : "Member"}
            sub={orgId ? "en esta org" : ""}
          />
        </div>
      </section>

      <div className="rule mb-10" />

      {/* Tip editorial */}
      <section className="mb-12 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-3">
          <span className="section-num">Sugerencia</span>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          <Sparkles className="h-5 w-5 text-[hsl(var(--flow-ochre))]" />
          <p className="mt-3 font-display text-2xl leading-snug md:text-3xl">
            Empezá por crear tu primer departamento en el{" "}
            <Link
              href="/dashboard/orgchart"
              className="italic text-[hsl(var(--flow-rust))] underline decoration-1 underline-offset-4 hover:no-underline"
            >
              org chart
            </Link>
            . Es la forma más rápida de ver el sistema en acción.
          </p>
        </div>
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "Madrugada";
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "ochre" | "rust" | "moss";
}) {
  const accentColor = {
    ochre: "var(--flow-ochre)",
    rust: "var(--flow-rust)",
    moss: "var(--flow-moss)",
  }[accent];

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-colors hover:border-[hsl(var(--foreground)/0.4)] min-h-[180px]"
    >
      <header className="flex items-start justify-between">
        <Icon
          className="h-5 w-5"
          strokeWidth={1.75}
          style={{ color: `hsl(${accentColor})` }}
        />
        <ArrowUpRight
          className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
          strokeWidth={1.5}
        />
      </header>
      <div>
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          {description}
        </p>
      </div>
    </Link>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[hsl(var(--background))] p-6">
      <span className="label text-[10px]">{label}</span>
      <div className="mt-2 font-display text-4xl leading-none">{value}</div>
      {sub && (
        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{sub}</p>
      )}
    </div>
  );
}

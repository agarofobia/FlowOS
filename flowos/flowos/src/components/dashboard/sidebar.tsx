"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GitBranch,
  Users,
  CreditCard,
  Settings,
  FileText,
  CheckSquare,
} from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Inicio", icon: LayoutGrid },
  { href: "/dashboard/orgchart", label: "Org chart", icon: GitBranch },
  { href: "/dashboard/employees", label: "Empleados", icon: Users },
  { href: "/dashboard/projects", label: "Proyectos", icon: CheckSquare },
  { href: "/dashboard/docs", label: "Docs", icon: FileText },
  { href: "/dashboard/team", label: "Equipo", icon: Users },
];

const FOOTER_NAV = [
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      {/* Header con logo + org switcher */}
      <div className="flex flex-col gap-3 border-b border-[hsl(var(--border))] p-4">
        <Link href="/dashboard" className="font-display text-2xl tracking-tight">
          FlowOS
        </Link>
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/dashboard"
          afterCreateOrganizationUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger:
                "w-full justify-start border border-[hsl(var(--border))] rounded px-3 py-2 text-sm",
            },
          }}
        />
      </div>

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-3">
          <span className="label text-[10px]">Workspace</span>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.soon ? "#" : item.href}
                  className={cn(
                    "flex items-center justify-between rounded px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-medium"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary)/0.5)] hover:text-[hsl(var(--foreground))]",
                    item.soon && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </span>
                  {item.soon && (
                    <span className="text-[9px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                      Pronto
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer nav */}
      <div className="border-t border-[hsl(var(--border))] p-3">
        <ul className="flex flex-col gap-1">
          {FOOTER_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center gap-2 px-3 pt-3 border-t border-[hsl(var(--border))]">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Tu cuenta
          </span>
        </div>
      </div>
    </aside>
  );
}

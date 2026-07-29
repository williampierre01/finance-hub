"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/receitas",
    label: "Receitas",
  },
  {
    href: "/despesas",
    label: "Despesas",
  },
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação financeira"
      className="-mx-4 mb-10 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <div className="flex min-w-max gap-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "rounded-lg border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
                  : "rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
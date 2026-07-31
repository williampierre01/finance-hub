"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthenticatedUser } from "@/components/auth-guard";
import { LogoutButton } from "@/components/logout-button";

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
  const user = useAuthenticatedUser();

  return (
    <nav className="mb-10 flex flex-wrap items-center gap-3">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
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

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <strong className="block text-sm text-slate-100">
            {user.name}
          </strong>

          <span className="block text-xs text-slate-400">
            {user.email}
          </span>
        </div>

        <LogoutButton />
      </div>
    </nav>
  );
}
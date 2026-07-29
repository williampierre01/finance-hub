import type { ReactNode } from "react";

import { DashboardNavigation } from "@/components/dashboard-navigation";

interface FinanceLayoutProps {
  children: ReactNode;
}

export default function FinanceLayout({
  children,
}: FinanceLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <DashboardNavigation />

        {children}
      </section>
    </main>
  );
}
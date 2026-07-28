import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-6xl">
        {children}
      </section>
    </main>
  );
}
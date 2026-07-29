import Link from "next/link";

import { DashboardContent } from "@/components/dashboard-content";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <>
      <Link
        href="/"
        className="mb-8 inline-block text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
      >
        ← Voltar para o início
      </Link>

      <PageHeader
        eyebrow="Visão geral"
        title="Dashboard financeiro"
        description="Aqui você acompanhará seu saldo, receitas, despesas e transações recentes."
      />

      <DashboardContent />
    </>
  );
}
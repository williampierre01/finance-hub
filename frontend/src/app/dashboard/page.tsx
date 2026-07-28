import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SummaryCard } from "@/components/summary-card";

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

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SummaryCard
          title="Saldo atual"
          value="R$ 0,00"
        />

        <SummaryCard
          title="Receitas"
          value="R$ 0,00"
          valueClassName="text-emerald-400"
        />

        <SummaryCard
          title="Despesas"
          value="R$ 0,00"
          valueClassName="text-red-400"
        />
      </div>
    </>
  );
}
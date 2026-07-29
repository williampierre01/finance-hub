import { PageHeader } from "@/components/page-header";

export default function DespesasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saídas"
        title="Despesas"
        description="Consulte e gerencie todas as despesas cadastradas no FinanceHub."
      />

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Lista de despesas</h2>

        <p className="mt-4 text-slate-400">
          As despesas cadastradas serão exibidas nesta página.
        </p>
      </section>
    </>
  );
}
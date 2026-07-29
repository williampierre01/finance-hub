import { PageHeader } from "@/components/page-header";

export default function ReceitasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Entradas"
        title="Receitas"
        description="Consulte e gerencie todas as receitas cadastradas no FinanceHub."
      />

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Lista de receitas</h2>

        <p className="mt-4 text-slate-400">
          As receitas cadastradas serão exibidas nesta página.
        </p>
      </section>
    </>
  );
}
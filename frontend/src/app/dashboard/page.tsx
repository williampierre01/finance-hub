import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Voltar para o início
        </Link>

        <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Visão geral
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          Dashboard financeiro
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          Aqui você acompanhará seu saldo, receitas, despesas e transações
          recentes.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <span className="text-sm text-slate-400">
              Saldo atual
            </span>

            <strong className="mt-3 block text-3xl">
              R$ 0,00
            </strong>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <span className="text-sm text-slate-400">
              Receitas
            </span>

            <strong className="mt-3 block text-3xl text-emerald-400">
              R$ 0,00
            </strong>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <span className="text-sm text-slate-400">
              Despesas
            </span>

            <strong className="mt-3 block text-3xl text-red-400">
              R$ 0,00
            </strong>
          </article>
        </div>
      </section>
    </main>
  );
}
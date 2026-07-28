import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <span className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Controle financeiro
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          Organize suas finanças com o FinanceHub
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Registre receitas e despesas, acompanhe seu saldo e visualize sua
          evolução financeira em um único lugar.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Começar agora
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-900"
          >
            Conhecer recursos
          </Link>
        </div>
      </section>
    </main>
  );
}
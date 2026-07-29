import Link from "next/link";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Voltar para o início
        </Link>

        <span className="mt-12 block text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Acesso
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          Entre no FinanceHub
        </h1>

        <p className="mt-4 text-slate-400">
          Use suas credenciais para acessar seus dados financeiros.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
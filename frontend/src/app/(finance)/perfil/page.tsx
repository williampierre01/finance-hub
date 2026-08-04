"use client";

import { useAuthenticatedUser } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { ProfileUpdateForm } from "@/components/profile-update-form";

export default function ProfilePage() {
  const user = useAuthenticatedUser();

  const formattedCreatedAt = new Date(
    user.createdAt
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        eyebrow="Minha conta"
        title="Perfil"
        description="Consulte e atualize os dados da sua conta no FinanceHub."
      />

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-slate-100">
          Dados pessoais
        </h2>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <dt className="text-sm font-medium text-slate-400">
              Nome
            </dt>

            <dd className="mt-2 font-semibold text-slate-100">
              {user.name}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <dt className="text-sm font-medium text-slate-400">
              E-mail
            </dt>

            <dd className="mt-2 font-semibold text-slate-100">
              {user.email}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:col-span-2">
            <dt className="text-sm font-medium text-slate-400">
              Conta criada em
            </dt>

            <dd className="mt-2 font-semibold text-slate-100">
              {formattedCreatedAt}
            </dd>
          </div>
        </dl>
      </section>

      <ProfileUpdateForm />
    </>
  );
}
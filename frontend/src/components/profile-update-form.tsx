"use client";

import { FormEvent, useState } from "react";

import {
  useAuthenticatedUser,
  useRefreshAuthenticatedUser,
} from "@/components/auth-guard";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function ProfileUpdateForm() {
  const user = useAuthenticatedUser();
  const refreshUser = useRefreshAuthenticatedUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage("Informe seu nome.");
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${apiUrl}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
        }),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            "Não foi possível atualizar o perfil."
        );
      }

      await refreshUser();

      setSuccessMessage(
        "Perfil atualizado com sucesso."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o perfil."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-slate-100">
        Editar perfil
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Nome
          </span>

          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearMessages();
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            E-mail
          </span>

          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearMessages();
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="sm:col-span-2">
          {errorMessage && (
            <p className="mb-4 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mb-4 rounded-lg border border-emerald-900 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </div>
      </form>
    </section>
  );
}
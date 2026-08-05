"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function DeleteAccountForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!password) {
      setErrorMessage("Informe sua senha.");
      return;
    }

    if (confirmation !== "EXCLUIR") {
      setErrorMessage(
        'Digite "EXCLUIR" para confirmar a exclusão.'
      );
      return;
    }

    const confirmed = window.confirm(
      "Esta ação excluirá permanentemente sua conta e suas transações. Deseja continuar?"
    );

    if (!confirmed) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage(
        "A URL da API não foi configurada."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${apiUrl}/users/me`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
            confirmation,
          }),
        }
      );

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            "Não foi possível excluir a conta."
        );
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a conta."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-red-900 bg-red-950/20 p-6">
      <h2 className="text-xl font-bold text-red-300">
        Zona de perigo
      </h2>

      <p className="mt-2 text-sm text-red-200">
        A exclusão da conta é permanente. Todas as suas
        transações também serão removidas.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-red-200">
            Senha atual
          </span>

          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-red-900 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-red-200">
            Digite EXCLUIR para confirmar
          </span>

          <input
            type="text"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setErrorMessage("");
            }}
            placeholder="EXCLUIR"
            autoComplete="off"
            disabled={isSubmitting}
            className="rounded-lg border border-red-900 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {errorMessage && (
          <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !password ||
            confirmation !== "EXCLUIR"
          }
          className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Excluindo conta..."
            : "Excluir minha conta"}
        </button>
      </form>
    </section>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    if (!currentPassword) {
      setErrorMessage("Informe a senha atual.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(
        "A nova senha deve possuir pelo menos 8 caracteres."
      );
      return;
    }

    if (newPassword.length > 72) {
      setErrorMessage(
        "A nova senha deve possuir no máximo 72 caracteres."
      );
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setErrorMessage(
        "A confirmação não corresponde à nova senha."
      );
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
        `${apiUrl}/users/me/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            passwordConfirmation,
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
            "Não foi possível alterar a senha."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");

      setSuccessMessage(
        "Senha alterada com sucesso. Entre novamente."
      );

      window.setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a senha."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-slate-100">
        Alterar senha
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Após alterar sua senha, você precisará entrar novamente.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Senha atual
          </span>

          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              clearMessages();
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">
              Nova senha
            </span>

            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                clearMessages();
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">
              Confirmar nova senha
            </span>

            <input
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => {
                setPasswordConfirmation(
                  event.target.value
                );

                clearMessages();
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>

        {errorMessage && (
          <p className="rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-lg border border-emerald-900 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Alterando..."
            : "Alterar senha"}
        </button>
      </form>
    </section>
  );
}
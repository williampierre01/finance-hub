"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormMessage } from "@/components/form-message";

interface ApiErrorResponse {
  message?: string;
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setErrorMessage("Informe sua senha.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = (await response
        .json()
        .catch(() => null)) as ApiErrorResponse | null;

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Não foi possível fazer login.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível fazer login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          E-mail
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrorMessage("");
          }}
          autoComplete="email"
          placeholder="seu@email.com"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-60"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Senha
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrorMessage("");
          }}
          autoComplete="current-password"
          placeholder="Digite sua senha"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-60"
        />
      </div>

      {errorMessage && (
        <div className="mt-5">
          <FormMessage
            type="error"
            message={errorMessage}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-6 w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
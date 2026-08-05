"use client";

import { FormEvent, useState } from "react";

interface TransactionEditFormProps {
  transaction: {
    id: string;
    title: string;
    amount: string;
    category: string;
  };
  onUpdated: () => void;
  onCancel: () => void;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function TransactionEditForm({
  transaction,
  onUpdated,
  onCancel,
}: TransactionEditFormProps) {
  const [title, setTitle] = useState(
    transaction.title,
  );
  const [amount, setAmount] = useState(
    transaction.amount,
  );
  const [category, setCategory] = useState(
    transaction.category,
  );
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");

    const numericAmount = Number(amount);

    if (!title.trim()) {
      setErrorMessage("Informe o título.");
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setErrorMessage(
        "Informe um valor maior que zero.",
      );
      return;
    }

    if (!category.trim()) {
      setErrorMessage("Informe a categoria.");
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage(
        "A URL da API não foi configurada.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${apiUrl}/transactions/${transaction.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
            amount: numericAmount,
            category: category.trim(),
          }),
        },
      );

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            "Não foi possível atualizar a receita.",
        );
      }

      onUpdated();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a receita.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid gap-4 rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 sm:grid-cols-2"
    >
      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="text-sm font-medium text-slate-300">
          Título
        </span>

        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-60"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">
          Valor
        </span>

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-60"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">
          Categoria
        </span>

        <input
          type="text"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-60"
        />
      </label>

      {errorMessage && (
        <p className="rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300 sm:col-span-2">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Salvando..."
            : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
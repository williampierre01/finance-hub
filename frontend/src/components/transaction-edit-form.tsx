"use client";

import { FormEvent, useState } from "react";

type TransactionType = "INCOME" | "EXPENSE";

interface TransactionEditFormProps {
  transaction: {
    id: string;
    title: string;
    amount: string;
    category: string;
    type: TransactionType;
  };
  onUpdated: () => void | Promise<void>;
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
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isIncome = transaction.type === "INCOME";
  const transactionLabel = isIncome ? "receita" : "despesa";

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
      setErrorMessage("Informe um valor maior que zero.");
      return;
    }

    if (!category.trim()) {
      setErrorMessage("Informe a categoria.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    const defaultErrorMessage =
      `Não foi possível atualizar a ${transactionLabel}.`;

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
            defaultErrorMessage,
        );
      }

      await onUpdated();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : defaultErrorMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isIncome
          ? "mt-4 grid gap-4 rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 sm:grid-cols-2"
          : "mt-4 grid gap-4 rounded-xl border border-red-900 bg-red-950/20 p-4 sm:grid-cols-2"
      }
    >
      <div className="sm:col-span-2">
        <label
          htmlFor={`edit-title-${transaction.id}`}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Título
        </label>

        <input
          id={`edit-title-${transaction.id}`}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor={`edit-amount-${transaction.id}`}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Valor
        </label>

        <input
          id={`edit-amount-${transaction.id}`}
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor={`edit-category-${transaction.id}`}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Categoria
        </label>

        <input
          id={`edit-category-${transaction.id}`}
          type="text"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setErrorMessage("");
          }}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="sm:col-span-2">
        {errorMessage && (
          <p className="mb-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={
              isIncome
                ? "rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                : "rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
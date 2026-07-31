"use client";

import { FormEvent, useState } from "react";

interface TransactionFormProps {
  onTransactionCreated: () => void;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function TransactionForm({
  onTransactionCreated,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearMessage() {
    setMessage("");
    setIsError(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessage();

    const numericAmount = Number(amount);

    if (
      !title.trim() ||
      !category.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setMessage("Preencha todos os campos corretamente.");
      setIsError(true);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setMessage("A URL da API não foi configurada.");
      setIsError(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          amount: numericAmount,
          type,
          category: category.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            "Não foi possível salvar a transação."
        );
      }

      const formattedAmount = numericAmount.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      );

      setMessage(
        `Transação "${title.trim()}" no valor de ${formattedAmount} salva com sucesso.`
      );

      setIsError(false);

      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");

      onTransactionCreated();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a transação."
      );

      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <h2 className="text-xl font-bold">Nova transação</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">
            Título
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              clearMessage();
            }}
            placeholder="Ex.: Supermercado"
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Valor
          </span>

          <input
            type="number"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              clearMessage();
            }}
            placeholder="0,00"
            min="0.01"
            step="0.01"
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Tipo
          </span>

          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              clearMessage();
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">
            Categoria
          </span>

          <input
            type="text"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              clearMessage();
            }}
            placeholder="Ex.: Alimentação"
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>

      {message && (
        <p
          className={
            isError
              ? "mt-6 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300"
              : "mt-6 rounded-lg border border-emerald-900 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300"
          }
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar transação"}
      </button>
    </form>
  );
}
"use client";

import { FormEvent, useState } from "react";

interface ApiError {
  message?: string;
}

interface TransactionFormProps {
  onTransactionCreated: () => void;
}

export function TransactionForm({
  onTransactionCreated,
}: TransactionFormProps) {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const numericAmount = Number(amount);

    if (
      !userId.trim() ||
      !title.trim() ||
      !category.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setMessage("Preencha todos os campos corretamente.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setMessage("A URL da API não foi configurada.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.trim(),
          title: title.trim(),
          amount: numericAmount,
          type,
          category: category.trim(),
        }),
      });

      const data = (await response.json()) as ApiError;

      if (!response.ok) {
        setMessage(data.message ?? "Não foi possível salvar a transação.");
        return;
      }

      const formattedAmount = numericAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      setMessage(
        `Transação "${title.trim()}" no valor de ${formattedAmount} salva no banco.`
      );

      onTransactionCreated();

      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");
    } catch {
      setMessage("Não foi possível conectar ao backend.");
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
            ID do usuário
          </span>

          <input
            type="text"
            value={userId}
            onChange={(event) => {
              setUserId(event.target.value);
              setMessage("");
            }}
            placeholder="Cole o ID de um usuário existente"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Título</span>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setMessage("");
            }}
            placeholder="Ex.: Supermercado"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Valor</span>

          <input
            type="number"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setMessage("");
            }}
            placeholder="0,00"
            min="0.01"
            step="0.01"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Tipo</span>

          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              setMessage("");
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
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
              setMessage("");
            }}
            placeholder="Ex.: Alimentação"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>
      </div>

      {message && (
        <p className="mt-6 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
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
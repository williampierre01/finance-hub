"use client";

import { FormEvent, useState } from "react";

export function TransactionForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !amount) {
      setMessage("Preencha o título e o valor da transação.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Informe um valor maior que zero.");
      return;
    }

    const formattedAmount = numericAmount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setMessage(
      `Transação "${title.trim()}" no valor de ${formattedAmount} registrada.`
    );

    setTitle("");
    setAmount("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <h2 className="text-xl font-bold">Nova transação</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Título
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setMessage("");
            }}
            placeholder="Ex.: Salário"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
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
              setMessage("");
            }}
            placeholder="0,00"
            min="0.01"
            step="0.01"
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>
      </div>

      {message && (
        <p className="mt-6 rounded-lg border border-emerald-800 bg-emerald-950 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        Salvar transação
      </button>
    </form>
  );
}
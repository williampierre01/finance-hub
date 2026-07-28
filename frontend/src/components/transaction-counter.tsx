"use client";

import { useState } from "react";

export function TransactionCounter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((currentCount) => currentCount + 1);
  }

  function decrement() {
    setCount((currentCount) =>
      currentCount > 0 ? currentCount - 1 : 0
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <span className="text-sm font-medium text-slate-400">
        Simulação de transações
      </span>

      <strong className="mt-3 block text-4xl">
        {count}
      </strong>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={decrement}
          className="rounded-lg border border-slate-700 px-4 py-2 font-semibold transition hover:bg-slate-800"
        >
          Remover
        </button>

        <button
          type="button"
          onClick={increment}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Adicionar
        </button>
      </div>
    </section>
  );
}
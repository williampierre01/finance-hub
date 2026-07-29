"use client";

import type { Transaction } from "@/components/dashboard-content";
import { TransactionListLoading } from "@/components/transaction-list-loading";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export function TransactionList({
  transactions,
  isLoading,
  errorMessage,
  onRetry,
}: TransactionListProps) {
  if (isLoading) {
    return <TransactionListLoading />;
  }

  if (errorMessage) {
    return (
      <section className="mt-10 rounded-2xl border border-red-900 bg-red-950/30 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-red-300">
          Não foi possível carregar as transações
        </h2>

        <p role="alert" className="mt-3 text-sm text-red-200">
          {errorMessage}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 w-full rounded-lg bg-red-400 px-4 py-2 font-semibold text-red-950 transition hover:bg-red-300 sm:w-auto"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <h2 className="text-xl font-bold">Transações recentes</h2>

        <p className="mt-6 text-sm text-slate-400">
          Nenhuma transação cadastrada.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <h2 className="text-xl font-bold">Transações recentes</h2>

      <div className="mt-6 space-y-4">
        {transactions.map((transaction) => {
          const formattedAmount = Number(
            transaction.amount,
          ).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          const isIncome = transaction.type === "INCOME";

          return (
            <article
              key={transaction.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <strong className="block text-slate-100">
                  {transaction.title}
                </strong>

                <span className="mt-1 block text-sm text-slate-400">
                  {transaction.category}
                </span>
              </div>

              <div className="sm:text-right">
                <strong
                  className={
                    isIncome
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                >
                  {isIncome ? "+ " : "- "}
                  {formattedAmount}
                </strong>

                <span className="mt-1 block text-xs text-slate-500">
                  {new Date(transaction.createdAt).toLocaleDateString(
                    "pt-BR",
                  )}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
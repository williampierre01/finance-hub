"use client";

import { useCallback, useEffect, useState } from "react";

import { TransactionListLoading } from "@/components/transaction-list-loading";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
}

interface FilteredTransactionListProps {
  type: "INCOME" | "EXPENSE";
  emptyMessage: string;
}

export function FilteredTransactionList({
  type,
  emptyMessage,
}: FilteredTransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTransactions = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`${apiUrl}/transactions`);

      if (!response.ok) {
        throw new Error("Não foi possível carregar as transações.");
      }

      const data = (await response.json()) as Transaction[];

      const filteredTransactions = data.filter(
        (transaction) => transaction.type === type,
      );

      setTransactions(filteredTransactions);
    } catch {
      setErrorMessage(
        "Não foi possível conectar ao backend. Verifique se o servidor está rodando.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  if (isLoading) {
    return <TransactionListLoading />;
  }

  if (errorMessage) {
    return (
      <section className="mt-10 rounded-2xl border border-red-900 bg-red-950/30 p-4 sm:p-6">
        <p role="alert" className="text-sm text-red-200">
          {errorMessage}
        </p>

        <button
          type="button"
          onClick={loadTransactions}
          className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 sm:w-auto"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="space-y-4">
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
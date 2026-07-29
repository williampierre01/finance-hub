"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
}

interface TransactionListProps {
  refreshKey: number;
}

export function TransactionList({
  refreshKey,
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState("Carregando transações...");

  useEffect(() => {
    async function loadTransactions() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setMessage("A URL da API não foi configurada.");
        return;
      }

      try {
        setMessage("Carregando transações...");

        const response = await fetch(`${apiUrl}/transactions`);

        if (!response.ok) {
          setMessage("Não foi possível carregar as transações.");
          return;
        }

        const data = (await response.json()) as Transaction[];

        setTransactions(data);
        setMessage(
          data.length === 0
            ? "Nenhuma transação cadastrada."
            : ""
        );
      } catch {
        setMessage("Não foi possível conectar ao backend.");
      }
    }

    loadTransactions();
  }, [refreshKey]);

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">Transações recentes</h2>

      {message && (
        <p className="mt-6 text-sm text-slate-400">
          {message}
        </p>
      )}

      {transactions.length > 0 && (
        <div className="mt-6 space-y-4">
          {transactions.map((transaction) => {
            const formattedAmount = Number(
              transaction.amount
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
                    {new Date(
                      transaction.createdAt
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
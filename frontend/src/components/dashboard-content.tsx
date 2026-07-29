"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SummaryCard } from "@/components/summary-card";
import { TransactionCounter } from "@/components/transaction-counter";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardContent() {
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

      setTransactions(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao backend."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "INCOME") {
          totals.income += amount;
        } else {
          totals.expense += amount;
        }

        totals.balance = totals.income - totals.expense;

        return totals;
      },
      {
        income: 0,
        expense: 0,
        balance: 0,
      }
    );
  }, [transactions]);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <SummaryCard
          title="Saldo atual"
          value={formatCurrency(summary.balance)}
          valueClassName={
            summary.balance < 0 ? "text-red-400" : "text-slate-100"
          }
        />

        <SummaryCard
          title="Receitas"
          value={formatCurrency(summary.income)}
          valueClassName="text-emerald-400"
        />

        <SummaryCard
          title="Despesas"
          value={formatCurrency(summary.expense)}
          valueClassName="text-red-400"
        />
      </div>

      <TransactionCounter />

      <TransactionForm onTransactionCreated={loadTransactions} />

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={loadTransactions}
      />
    </>
  );
}
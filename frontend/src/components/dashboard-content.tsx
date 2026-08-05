"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

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

interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
}

const initialSummary: FinancialSummary = {
  income: 0,
  expense: 0,
  balance: 0,
};

export function DashboardContent() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [summary, setSummary] =
    useState<FinancialSummary>(initialSummary);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboardData = useCallback(async () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage(
        "A URL da API não foi configurada.",
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const [
        transactionsResponse,
        summaryResponse,
      ] = await Promise.all([
        fetch(`${apiUrl}/transactions`, {
          credentials: "include",
        }),
        fetch(`${apiUrl}/transactions/summary`, {
          credentials: "include",
        }),
      ]);

      if (
        !transactionsResponse.ok ||
        !summaryResponse.ok
      ) {
        throw new Error(
          "Não foi possível carregar os dados financeiros.",
        );
      }

      const [transactionsData, summaryData] =
        await Promise.all([
          transactionsResponse.json() as Promise<
            Transaction[]
          >,
          summaryResponse.json() as Promise<
            FinancialSummary
          >,
        ]);

      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao backend.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
            summary.balance < 0
              ? "text-red-400"
              : "text-slate-100"
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

      <TransactionForm
        onTransactionCreated={loadDashboardData}
      />

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={loadDashboardData}
      />
    </>
  );
}
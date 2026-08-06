"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ExpenseCategoryChart,
  type ExpenseCategoryChartData,
} from "@/components/expense-category-chart";
import { IncomeExpenseChart } from "@/components/income-expense-chart";
import { MonthlyComparison } from "@/components/monthly-comparison";
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

interface SummaryValues {
  income: number;
  expense: number;
  balance: number;
  month: string;
}

interface VariationValues {
  income: number;
  expense: number;
  balance: number;
}

interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
  month: string | null;
  previousMonth: SummaryValues | null;
  variation: VariationValues | null;
}

const initialSummary: FinancialSummary = {
  income: 0,
  expense: 0,
  balance: 0,
  month: null,
  previousMonth: null,
  variation: null,
};

export function DashboardContent() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [summary, setSummary] =
    useState<FinancialSummary>(initialSummary);

  const [expenseCategories, setExpenseCategories] =
    useState<ExpenseCategoryChartData[]>([]);

  const [selectedMonth, setSelectedMonth] =
    useState("");

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

    const summaryUrl = selectedMonth
      ? `${apiUrl}/transactions/summary?month=${encodeURIComponent(
          selectedMonth,
        )}`
      : `${apiUrl}/transactions/summary`;

    const categoriesUrl = selectedMonth
      ? `${apiUrl}/transactions/categories?type=expense&month=${encodeURIComponent(
          selectedMonth,
        )}`
      : `${apiUrl}/transactions/categories?type=expense`;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const [
        transactionsResponse,
        summaryResponse,
        categoriesResponse,
      ] = await Promise.all([
        fetch(`${apiUrl}/transactions`, {
          credentials: "include",
        }),
        fetch(summaryUrl, {
          credentials: "include",
        }),
        fetch(categoriesUrl, {
          credentials: "include",
        }),
      ]);

      if (
        !transactionsResponse.ok ||
        !summaryResponse.ok ||
        !categoriesResponse.ok
      ) {
        throw new Error(
          "Não foi possível carregar os dados financeiros.",
        );
      }

      const [
        transactionsData,
        summaryData,
        categoriesData,
      ] = await Promise.all([
        transactionsResponse.json() as Promise<
          Transaction[]
        >,
        summaryResponse.json() as Promise<
          FinancialSummary
        >,
        categoriesResponse.json() as Promise<
          ExpenseCategoryChartData[]
        >,
      ]);

      setTransactions(transactionsData);
      setSummary(summaryData);
      setExpenseCategories(categoriesData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao backend.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatSelectedMonth(month: string) {
    if (!month) {
      return "Todo o período";
    }

    const [year, monthNumber] = month
      .split("-")
      .map(Number);

    return new Date(
      year,
      monthNumber - 1,
      1,
    ).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label
              htmlFor="dashboard-month"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Período do resumo
            </label>

            <input
              id="dashboard-month"
              type="month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(event.target.value)
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedMonth("")}
            disabled={!selectedMonth}
            className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mostrar todo o período
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Resumo exibido:{" "}
          <strong className="text-slate-200">
            {formatSelectedMonth(selectedMonth)}
          </strong>
        </p>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
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

      {!isLoading && !errorMessage && (
        <>
          <IncomeExpenseChart
            income={summary.income}
            expense={summary.expense}
            periodLabel={formatSelectedMonth(
              selectedMonth,
            )}
          />

          <ExpenseCategoryChart
            data={expenseCategories}
            periodLabel={formatSelectedMonth(
              selectedMonth,
            )}
          />
        </>
      )}

      {summary.month &&
        summary.previousMonth &&
        summary.variation && (
          <MonthlyComparison
            currentSummary={{
              income: summary.income,
              expense: summary.expense,
              balance: summary.balance,
              month: summary.month,
            }}
            previousMonth={summary.previousMonth}
            variation={summary.variation}
          />
        )}

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
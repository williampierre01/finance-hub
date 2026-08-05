"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { TransactionDeleteButton } from "@/components/transaction-delete-button";
import { TransactionEditForm } from "@/components/transaction-edit-form";
import {
  TransactionFilters,
  TransactionFilterValues,
} from "@/components/transaction-filters";
import { TransactionListLoading } from "@/components/transaction-list-loading";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse {
  data: Transaction[];
  pagination: Pagination;
}

interface FilteredTransactionListProps {
  type: "INCOME" | "EXPENSE";
  emptyMessage: string;
  allowEditing?: boolean;
  allowDeleting?: boolean;
  enableFiltersAndPagination?: boolean;
}

const initialFilters: TransactionFilterValues = {
  search: "",
  category: "",
  startDate: "",
  endDate: "",
};

export function FilteredTransactionList({
  type,
  emptyMessage,
  allowEditing = false,
  allowDeleting = false,
  enableFiltersAndPagination = false,
}: FilteredTransactionListProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [editingTransactionId, setEditingTransactionId] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<TransactionFilterValues>({
      ...initialFilters,
    });

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadTransactions = useCallback(async () => {
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

      if (enableFiltersAndPagination) {
        const query = new URLSearchParams({
          type: type.toLowerCase(),
          page: String(page),
          limit: "5",
        });

        if (filters.search.trim()) {
          query.set(
            "search",
            filters.search.trim(),
          );
        }

        if (filters.category.trim()) {
          query.set(
            "category",
            filters.category.trim(),
          );
        }

        if (filters.startDate) {
          query.set(
            "startDate",
            filters.startDate,
          );
        }

        if (filters.endDate) {
          query.set(
            "endDate",
            filters.endDate,
          );
        }

        const response = await fetch(
          `${apiUrl}/transactions/paginated?${query.toString()}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Não foi possível carregar as transações.",
          );
        }

        const result =
          (await response.json()) as PaginatedResponse;

        setTransactions(result.data);
        setPagination(result.pagination);
        return;
      }

      const response = await fetch(
        `${apiUrl}/transactions`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar as transações.",
        );
      }

      const data =
        (await response.json()) as Transaction[];

      const filteredTransactions = data.filter(
        (transaction) =>
          transaction.type === type,
      );

      setTransactions(filteredTransactions);
      setPagination(null);
    } catch {
      setErrorMessage(
        "Não foi possível conectar ao backend. Verifique se o servidor está rodando.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    enableFiltersAndPagination,
    filters,
    page,
    type,
  ]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  function handleApplyFilters(
    newFilters: TransactionFilterValues,
  ) {
    setFilters(newFilters);
    setPage(1);
    setEditingTransactionId(null);
  }

  function handleClearFilters() {
    setFilters({
      ...initialFilters,
    });
    setPage(1);
    setEditingTransactionId(null);
  }

  async function handleTransactionUpdated() {
    setEditingTransactionId(null);
    await loadTransactions();
  }

  async function handleTransactionDeleted() {
    setEditingTransactionId(null);

    if (
      enableFiltersAndPagination &&
      transactions.length === 1 &&
      page > 1
    ) {
      setPage((current) => current - 1);
      return;
    }

    await loadTransactions();
  }

  function renderContent() {
    if (isLoading) {
      return <TransactionListLoading />;
    }

    if (errorMessage) {
      return (
        <section className="mt-10 rounded-2xl border border-red-900 bg-red-950/30 p-4 sm:p-6">
          <p
            role="alert"
            className="text-sm text-red-200"
          >
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
          <p className="text-sm text-slate-400">
            {emptyMessage}
          </p>
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

            const isIncome =
              transaction.type === "INCOME";

            const isEditing =
              editingTransactionId ===
              transaction.id;

            return (
              <div key={transaction.id}>
                <article className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <strong className="block text-slate-100">
                      {transaction.title}
                    </strong>

                    <span className="mt-1 block text-sm text-slate-400">
                      {transaction.category}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
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
                          transaction.createdAt,
                        ).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>

                    {(allowEditing ||
                      allowDeleting) && (
                      <div className="flex flex-wrap gap-2">
                        {allowEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTransactionId(
                                isEditing
                                  ? null
                                  : transaction.id,
                              )
                            }
                            className="rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-950"
                          >
                            {isEditing
                              ? "Fechar edição"
                              : "Editar"}
                          </button>
                        )}

                        {allowDeleting && (
                          <TransactionDeleteButton
                            transactionId={
                              transaction.id
                            }
                            transactionTitle={
                              transaction.title
                            }
                            onDeleted={
                              handleTransactionDeleted
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                </article>

                {allowEditing && isEditing && (
                  <TransactionEditForm
                    transaction={transaction}
                    onUpdated={
                      handleTransactionUpdated
                    }
                    onCancel={() =>
                      setEditingTransactionId(null)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {enableFiltersAndPagination &&
          pagination && (
            <div className="mt-6 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Página {pagination.page} de{" "}
                {Math.max(
                  pagination.totalPages,
                  1,
                )} — {pagination.total} receita(s)
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPage(
                      (current) => current - 1,
                    )
                  }
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage(
                      (current) => current + 1,
                    )
                  }
                  disabled={
                    pagination.totalPages === 0 ||
                    page >= pagination.totalPages
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
      </section>
    );
  }

  return (
    <>
      {enableFiltersAndPagination && (
        <TransactionFilters
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}

      {renderContent()}
    </>
  );
}
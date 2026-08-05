"use client";

import {
  FormEvent,
  useState,
} from "react";

export interface TransactionFilterValues {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
}

interface TransactionFiltersProps {
  onApply: (
    filters: TransactionFilterValues,
  ) => void;
  onClear: () => void;
}

const initialFilters: TransactionFilterValues = {
  search: "",
  category: "",
  startDate: "",
  endDate: "",
};

export function TransactionFilters({
  onApply,
  onClear,
}: TransactionFiltersProps) {
  const [filters, setFilters] =
    useState<TransactionFilterValues>(
      initialFilters,
    );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    onApply(filters);
  }

  function handleClear() {
    setFilters(initialFilters);
    onClear();
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <h2 className="text-xl font-bold text-slate-100">
        Filtrar receitas
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 md:grid-cols-2"
      >
        <div>
          <label
            htmlFor="transaction-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Buscar pelo título
          </label>

          <input
            id="transaction-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder="Ex.: Salário"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="transaction-category"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Categoria
          </label>

          <input
            id="transaction-category"
            type="text"
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            placeholder="Ex.: Trabalho"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="transaction-start-date"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Data inicial
          </label>

          <input
            id="transaction-start-date"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="transaction-end-date"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Data final
          </label>

          <input
            id="transaction-end-date"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Aplicar filtros
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
          >
            Limpar filtros
          </button>
        </div>
      </form>
    </section>
  );
}
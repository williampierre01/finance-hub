"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { FormMessage } from "@/components/form-message";

type TransactionType = "INCOME" | "EXPENSE";

interface SpecificTransactionFormProps {
  type: TransactionType;
  title: string;
  submitLabel: string;
  onTransactionCreated?: () => void;
}

interface FormData {
  title: string;
  amount: string;
  category: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const initialFormData: FormData = {
  title: "",
  amount: "",
  category: "",
};

export function SpecificTransactionForm({
  type,
  title,
  submitLabel,
  onTransactionCreated,
}: SpecificTransactionFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isIncome = type === "INCOME";

  function handleInputChange(
    field: keyof FormData,
    value: string,
  ) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    const trimmedTitle = formData.title.trim();
    const trimmedCategory = formData.category.trim();
    const amount = Number(formData.amount);

    if (!trimmedTitle) {
      setErrorMessage("Informe uma descrição.");
      return;
    }

    if (!trimmedCategory) {
      setErrorMessage("Informe uma categoria.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage("Informe um valor maior que zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          amount,
          category: trimmedCategory,
          type: type.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            "Não foi possível cadastrar a transação.",
        );
      }

      setFormData(initialFormData);

      setSuccessMessage(
        isIncome
          ? "Receita cadastrada com sucesso."
          : "Despesa cadastrada com sucesso.",
      );

      onTransactionCreated?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar a transação.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <h2 className="text-xl font-bold text-slate-100">
        {title}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label
            htmlFor={`${type}-title`}
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Descrição
          </label>

          <input
            id={`${type}-title`}
            type="text"
            value={formData.title}
            onChange={(event) =>
              handleInputChange("title", event.target.value)
            }
            placeholder={
              isIncome
                ? "Ex.: Salário, trabalho extra"
                : "Ex.: Aluguel, supermercado"
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor={`${type}-amount`}
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Valor
          </label>

          <input
            id={`${type}-amount`}
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(event) =>
              handleInputChange("amount", event.target.value)
            }
            placeholder="Ex.: 500,00"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor={`${type}-category`}
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Categoria
          </label>

          <input
            id={`${type}-category`}
            type="text"
            value={formData.category}
            onChange={(event) =>
              handleInputChange("category", event.target.value)
            }
            placeholder={
              isIncome
                ? "Ex.: Salário, freelance"
                : "Ex.: Moradia, alimentação"
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="md:col-span-2">
          <div className="space-y-3">
            {errorMessage && (
              <FormMessage
                type="error"
                message={errorMessage}
              />
            )}

            {successMessage && (
              <FormMessage
                type="success"
                message={successMessage}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={
              isIncome
                ? "mt-4 w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                : "mt-4 w-full rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            }
          >
            {isSubmitting ? "Salvando..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
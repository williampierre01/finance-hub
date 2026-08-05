"use client";

import { useState } from "react";

type TransactionType = "INCOME" | "EXPENSE";

interface TransactionDeleteButtonProps {
  transactionId: string;
  transactionTitle: string;
  transactionType: TransactionType;
  onDeleted: () => void | Promise<void>;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export function TransactionDeleteButton({
  transactionId,
  transactionTitle,
  transactionType,
  onDeleted,
}: TransactionDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const transactionLabel =
    transactionType === "INCOME" ? "receita" : "despesa";

  async function handleDelete() {
    const confirmed = window.confirm(
      `Deseja realmente excluir a ${transactionLabel} "${transactionTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    const defaultErrorMessage =
      `Não foi possível excluir a ${transactionLabel}.`;

    try {
      setIsDeleting(true);
      setErrorMessage("");

      const response = await fetch(
        `${apiUrl}/transactions/${transactionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorData?.message ??
            errorData?.error ??
            defaultErrorMessage,
        );
      }

      await onDeleted();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : defaultErrorMessage,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border border-red-800 px-3 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Excluindo..." : "Excluir"}
      </button>

      {errorMessage && (
        <p className="mt-2 max-w-64 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
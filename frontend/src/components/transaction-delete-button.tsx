"use client";

import { useState } from "react";

interface TransactionDeleteButtonProps {
  transactionId: string;
  transactionTitle: string;
  onDeleted: () => void | Promise<void>;
}

interface ApiErrorResponse {
  message?: string;
}

export function TransactionDeleteButton({
  transactionId,
  transactionTitle,
  onDeleted,
}: TransactionDeleteButtonProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Deseja realmente excluir a receita "${transactionTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage(
        "A URL da API não foi configurada.",
      );
      return;
    }

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
            "Não foi possível excluir a receita.",
        );
      }

      await onDeleted();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a receita.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border border-red-800 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Excluindo..." : "Excluir"}
      </button>

      {errorMessage && (
        <p
          role="alert"
          className="mt-2 max-w-64 text-xs text-red-400"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
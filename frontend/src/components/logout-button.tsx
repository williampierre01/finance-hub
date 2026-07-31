"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setErrorMessage("A URL da API não foi configurada.");
      return;
    }

    try {
      setIsLoggingOut(true);
      setErrorMessage("");

      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Não foi possível encerrar a sessão.");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setErrorMessage(
        "Não foi possível encerrar a sessão. Tente novamente."
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="ml-auto">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? "Saindo..." : "Sair"}
      </button>

      {errorMessage && (
        <p className="mt-2 text-right text-xs text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
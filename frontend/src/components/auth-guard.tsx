"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthGuardProps {
  children: ReactNode;
}

type AuthenticationStatus =
  | "loading"
  | "authenticated"
  | "error";

const AuthenticatedUserContext =
  createContext<AuthenticatedUser | null>(null);

export function useAuthenticatedUser() {
  const user = useContext(AuthenticatedUserContext);

  if (!user) {
    throw new Error(
      "useAuthenticatedUser deve ser utilizado dentro do AuthGuard."
    );
  }

  return user;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<AuthenticationStatus>("loading");

  const [user, setUser] =
    useState<AuthenticatedUser | null>(null);

  const verifyAuthentication = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");

      const response = await fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
      });

      if (response.status === 401) {
        setUser(null);
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error();
      }

      const authenticatedUser =
        (await response.json()) as AuthenticatedUser;

      setUser(authenticatedUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("error");
    }
  }, [router]);

  useEffect(() => {
    verifyAuthentication();
  }, [verifyAuthentication]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <p className="text-sm text-slate-400">
          Verificando sua sessão...
        </p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <section className="w-full max-w-md rounded-2xl border border-red-900 bg-red-950/30 p-6">
          <h1 className="text-xl font-bold text-red-300">
            Não foi possível verificar sua sessão
          </h1>

          <p className="mt-3 text-sm text-red-200">
            Verifique se o backend está funcionando e tente novamente.
          </p>

          <button
            type="button"
            onClick={verifyAuthentication}
            className="mt-6 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedUserContext.Provider value={user}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}
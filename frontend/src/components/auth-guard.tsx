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

interface AuthenticatedUserContextValue {
  user: AuthenticatedUser;
  refreshUser: () => Promise<void>;
}

type AuthenticationStatus =
  | "loading"
  | "authenticated"
  | "error";

const AuthenticatedUserContext =
  createContext<AuthenticatedUserContextValue | null>(null);

function useAuthenticationContext() {
  const context = useContext(AuthenticatedUserContext);

  if (!context) {
    throw new Error(
      "O contexto de autenticação deve ser utilizado dentro do AuthGuard."
    );
  }

  return context;
}

export function useAuthenticatedUser() {
  return useAuthenticationContext().user;
}

export function useRefreshAuthenticatedUser() {
  return useAuthenticationContext().refreshUser;
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
      setStatus((currentStatus) =>
  currentStatus === "authenticated"
    ? "authenticated"
    : "loading"
);

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
    <AuthenticatedUserContext.Provider
      value={{
        user,
        refreshUser: verifyAuthentication,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
}
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useCallback } from "react";
import type { AuthUser } from "@/types/auth";
import type { UserRole } from "@/types";
import useToast from "./useToast";
import { getErrorMessage } from "@/utils";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    name: string,
    password: string,
    role?: UserRole,
  ) => Promise<void>;
  refresh: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  const user = session?.user as AuthUser | null;
  const loading = status === "loading";

  const refresh = useCallback(async () => {
    try {
      await update();
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err;
    }
  }, [update, showError]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err;
    }
  };

  const register = async (
    email: string,
    name: string,
    password: string,
    role?: UserRole,
  ) => {
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      // After successful registration, log the user in
      await login(email, password);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refresh,
    setLoading: () => {}, // NextAuth handles loading state internally
    setError,
  };
}

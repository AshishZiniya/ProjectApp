// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import useToast from "./useToast";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showError } = useToast();

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ user: AuthUser }>("/auth/refresh");
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
    } catch (err: unknown) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", { email, name, password });
      await login(email, password);
    } catch (err: unknown) {
      showError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err: unknown) {
      showError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refresh: refreshUser,
  };
}

// Helper function to extract error message (reuse from previous answer or import)
function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  // Add more checks if needed
  return "An unknown error occurred";
}

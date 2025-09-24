/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { UserRole } from "@/types";
import useToast from "./useToast";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string, role?: UserRole) => Promise<void>;
  refresh: () => Promise<void>;
}

// Helper function to extract error message
function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  // Check for API error response structure
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return (error as any).message;
  }
  return "An unknown error occurred";
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
      const response = await api.get<{ user: AuthUser }>("/auth/me"); // Changed to /auth/me for fetching current user
      setUser(response.user);
    } catch {
      setUser(null);
      // Do not show error toast here, as it's expected if not logged in
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
      await refreshUser(); // Refresh user data after successful login
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err; // Re-throw to allow calling component to handle
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string, role?: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", { email, name, password, role });
      // After registration, typically you'd log them in or redirect to login
      // For this example, we'll just refresh the user state if they are auto-logged in
      // or rely on the calling component to redirect to login.
      // If the backend auto-logs in, refreshUser will pick it up.
      // If not, the user will need to manually log in.
      // For now, let's assume successful registration means they can proceed to login page.
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
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
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
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

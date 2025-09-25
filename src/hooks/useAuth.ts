"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const { showError } = useToast();

  const refreshUser = useCallback(async () => {
    // Prevent duplicate requests
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<{ user: AuthUser }>("/auth/me");
        setUser(response.user);
      } catch (err) {
        setUser(null);
        // Only set error if it's not a 401 (unauthorized) which is expected when not logged in
        if (err instanceof Error && !err.message.includes("401")) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, []);

  const refreshTokens = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setUser(null);
      return;
    }
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>("/auth/refresh", { refreshToken });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>("/auth/login", { email, password });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
      setLoading(false);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err; // Re-throw to allow calling component to handle
    }
  };

  const register = async (
    email: string,
    name: string,
    password: string,
    role?: UserRole,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>("/auth/register", { email, name, password, role });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
      setLoading(false);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      showError(msg);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setLoading(false);
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
    refresh: refreshTokens,
    setLoading,
    setError,
  };
}

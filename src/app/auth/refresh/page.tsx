// app/auth/refresh/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import useToast from "@/hooks/useToast";

export default function RefreshPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const refreshTokens = async () => {
      try {
        await api.post("/auth/refresh");
        setStatus("success");
        setMessage("Tokens refreshed successfully!");
      } catch {}
    };
    refreshTokens();
  }, []);

  const { showSuccess, showError } = useToast();

  if (status === "success") showSuccess(message);
  if (status === "error") showError(message);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Token Refresh Status
        </h2>
        {status === "loading" && (
          <>
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">
              Attempting to refresh tokens...
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

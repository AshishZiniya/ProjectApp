// app/auth/refresh/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Card from "@/components/ui/Card";
import useToast from "@/hooks/useToast";

export default function RefreshPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const refreshTokens = async () => {
      try {
        await api.post("/auth/refresh");
        setStatus("success");
        setMessage("Tokens refreshed successfully!");
        showSuccess("Tokens refreshed successfully!"); // Show toast on success
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to refresh tokens.");
        showError(err.message || "Failed to refresh tokens."); // Show toast on error
      }
    };
    refreshTokens();
  }, [showError, showSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Token Refresh Status
        </h2>
        {status === "loading" && (
          <>
            <p className="mt-4 text-gray-600">
              Attempting to refresh tokens...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="mt-4 text-gray-600">Error: {message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <p className="mt-4 text-gray-600">Tokens refreshed successfully!</p>
          </>
        )}
        {/* No need to display success/error message here, useToast handles it */}
      </Card>
    </div>
  );
}

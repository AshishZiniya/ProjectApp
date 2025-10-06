// app/admin/add-admin/AddAdmin.tsx
"use client";

import React, { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";

const AddAdmin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    name?: string;
  }>({});
  const { register, loading, error } = useAuth();
  const { showSuccess } = useToast();

  const validateForm = useCallback(() => {
    const errors: { email?: string; name?: string } = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }
    if (!name) {
      errors.name = "Name is required";
    } else if (name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, name]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        await register(email, name, "Admin@123", "ADMIN");
        showSuccess("Admin created successfully");
        setEmail("");
        setName("");
      } catch {
        // Error is handled by useAuth hook
      }
    },
    [validateForm, register, email, name, showSuccess],
  );

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6 w-full">
      <Card className="w-full max-w-lg glass-card shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-neon rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-glow shadow-xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-3 text-gradient">
            Add Administrator
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Create a new administrator account with full system access
          </p>
        </div>
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6 glass-card border-red-400/20 animate-fade-in-up"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-200 mb-3"
            >
              📧 Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`block w-full px-5 py-4 border rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 glass text-white placeholder-gray-400 backdrop-blur-md min-h-[56px] text-lg ${
                  validationErrors.email
                    ? "border-red-400/50"
                    : "border-white/20 hover:border-white/30"
                }`}
                placeholder="admin@example.com"
              />
              <svg
                className="absolute right-4 top-4.5 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            {validationErrors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-200 mb-3"
            >
              👤 Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`block w-full px-5 py-4 border rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 glass text-white placeholder-gray-400 backdrop-blur-md min-h-[56px] text-lg ${
                  validationErrors.name
                    ? "border-red-400/50"
                    : "border-white/20 hover:border-white/30"
                }`}
                placeholder="John Doe"
              />
              <svg
                className="absolute right-4 top-4.5 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            {validationErrors.name && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.name}
              </p>
            )}
          </div>
          <div className="glass-card border border-amber-400/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 animate-fade-in-up animate-delay-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-200 mb-1">Default Password</h4>
                <p className="text-sm text-amber-100/90 leading-relaxed">
                  The administrator account will be created with the default password:{" "}
                  <code className="bg-amber-400/20 text-amber-100 px-2 py-1 rounded-lg font-mono text-sm border border-amber-400/30">
                    Admin@123
                  </code>
                </p>
                <p className="text-xs text-amber-200/70 mt-2">
                  Please ensure the admin changes this password after first login for security.
                </p>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-xl font-semibold min-h-[60px] shadow-2xl hover:shadow-blue-500/30 animate-fade-in-up animate-delay-300"
          >
            {loading ? "Creating Administrator..." : "✨ Create Administrator"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddAdmin;

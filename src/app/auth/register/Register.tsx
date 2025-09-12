// app/auth/register/Register.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import api from "@/lib/api";
import useToast from "@/hooks/useToast";
import FormGroup from "@/components/common/FormGroup";
import { ROLE } from "@/constants";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, seRole] = useState(`${ROLE.USER}`);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", {
        email,
        name,
        password,
        role,
      });
      router.push("/auth/login");
      showSuccess("User Registered Successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Registration Failed...!");
      showError(err.message || "Registration Failed...!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormGroup label="Role" htmlFor="role">
            <select
              id="role"
              value={role}
              onChange={(e) => seRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value={ROLE.USER}>USER</option>
              <option value={ROLE.ADMIN}>ADMIN</option>
            </select>
          </FormGroup>
          <Button type="submit" loading={loading} className="w-full mt-4">
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Register;

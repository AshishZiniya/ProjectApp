// app/projects/create/CreateProject.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import api from "@/lib/api";
import useToast from "@/hooks/useToast";
import { Project } from "@/types";

const CreateProject: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Project>("/projects", {
        name,
        description,
      });
      console.log(response);
      router.push(`/projects/${response.id}`);
      showSuccess("Project created successfully!");
    } catch {
      showError("Failed to Create project...!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Project
        </h2>
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            type="textarea" // Note: Input component needs to handle textarea type or create a separate Textarea component
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full mt-4">
            Create Project
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-full mt-2"
          >
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;

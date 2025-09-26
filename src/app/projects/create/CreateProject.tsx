// app/projects/create/CreateProject.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      router.push(`/projects/${response.id}`);
      showSuccess("Project created successfully!");
      setLoading(false);
    } catch {
      showError("Failed to Create project...!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">📁</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create New Project
          </h2>
          <p className="text-gray-600">
            Start a new project and organize your tasks
          </p>
        </div>
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
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />
          <Button type="submit" loading={loading} className="w-full mt-4">
            Create Project
          </Button>
          <Link
            href="/projects"
            className="w-full mt-2 inline-block text-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;

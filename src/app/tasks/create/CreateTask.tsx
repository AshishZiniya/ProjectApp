// app/tasks/create/CreateTask.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import api from "@/lib/api";
import { User } from "@/types";
import useToast from "@/hooks/useToast";
import {
  TASK_PRIORITY_HIGH,
  TASK_PRIORITY_LOW,
  TASK_PRIORITY_MEDIUM,
} from "@/constants";
import FormGroup from "@/components/common/FormGroup";

const CreateTask: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("projectId");

  const [projectId, setProjectId] = useState(initialProjectId || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]); // For assignee dropdown
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await api.get<{ data: User[] }>("/users", {
          params: { limit: 100 },
        }); // Fetch all users for dropdown
        setUsers(response.data || []);
      } catch {
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dto = {
        projectId,
        title,
        description: description || undefined,
        priority: Number(priority),
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      };
      await api.post("/tasks", dto);
      router.push(`/projects/${projectId}?refresh=true`);
      showSuccess("Task created successfully!");
    } catch {
      showError("Failed to Create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Task
        </h2>
        {error && <Alert type="error" message={error} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <Input
            label="Project ID"
            type="text"
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            disabled={!!initialProjectId}
          />
          <Input
            label="Title"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            type="textarea"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormGroup label="Priority" htmlFor="priority">
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value={TASK_PRIORITY_HIGH}>High</option>
              <option value={TASK_PRIORITY_MEDIUM}>Medium</option>
              <option value={TASK_PRIORITY_LOW}>Low</option>
            </select>
          </FormGroup>
          <FormGroup label="Assignee (Optional)" htmlFor="assignee">
            {" "}
            {/* Use FormGroup */}
            {usersLoading ? (
              // Consider a skeleton loader here instead of just removing LoadingSpinner
              <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            ) : usersError ? (
              <Alert type="error" message={usersError} />
            ) : (
              <select
                id="assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </FormGroup>
          <Input
            label="Due Date (Optional)"
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full mt-4">
            Create Task
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

export default CreateTask;

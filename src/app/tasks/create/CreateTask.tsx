// app/tasks/create/CreateTask.tsx
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
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
        setUsersLoading(false);
      } catch {
        setUsersError("Failed to load assignees.");
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
        status,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      };
      await api.post("/tasks", dto);
      router.push(`/projects/${projectId}?refresh=true`);
      showSuccess("Task created successfully!");
      setLoading(false);
    } catch {
      showError("Failed to Create task");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <Card className="w-full max-w-7xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create New Task
          </h2>
          <p className="text-gray-600">
            Add a new task to your project and assign it to team members
          </p>
        </div>
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
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
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
          <FormGroup label="Status" htmlFor="status">
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </FormGroup>
          <FormGroup label="Assignee (Optional)" htmlFor="assignee">
            {usersLoading ? (
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
          <Link
            href={`/projects/${projectId}`}
            className="w-full mt-2 inline-block text-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
};

export default CreateTask;

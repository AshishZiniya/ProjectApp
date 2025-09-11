/* eslint-disable react-hooks/exhaustive-deps */
// app/projects/[id]/ProjectDetails.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Project, Task } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useToast from "@/hooks/useToast";

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // State for tasks within this project
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      setProject(response);
      setEditedName(response.name);
      setEditedDescription(response.description || "");
    } catch {
      showError("Failed to Fetch Data...!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchTasksForProject = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const response = await api.get<{ data: Task[] }>(`/tasks`, {
        params: { projectId: id, limit: 100 },
      });
      setTasks(response.data || []);
    } catch {
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchTasksForProject();
    }
  }, [fetchProject, fetchTasksForProject, id]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("refresh")) {
      fetchTasksForProject();
    }
  }, [fetchTasksForProject, id, router]);

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const response = await api.patch<Project>(`/projects/${id}`, {
        name: editedName,
        description: editedDescription,
      });
      setProject(response);
      setIsEditing(false);
      showSuccess("Project updated successfully!");
    } catch {
      showError("Failed to Update Project...!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project)
    return <Alert type="info" message="Project not found." className="m-6" />;

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Project Details: {project.name}
        </h1>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">ID:</p>
                <p className="text-lg font-medium text-gray-900">
                  {project.id}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Name:</p>
                <p className="text-lg font-medium text-gray-900">
                  {project.name}
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-gray-600 text-sm">Description:</p>
                <p className="text-lg font-medium text-gray-900">
                  {project.description || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Owner:</p>
                <p className="text-lg font-medium text-gray-900">
                  {project.owner.name} ({project.owner.email})
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Created At:</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Updated At:</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(project.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mb-8">
              <Button variant="secondary" onClick={() => router.back()}>
                Back to Projects
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit Project</Button>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Project Name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Description"
              type="textarea" // Again, assuming Input can handle textarea or you have a Textarea component
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="mb-6"
            />
            <div className="flex justify-end space-x-3 mb-8">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} loading={updateLoading}>
                Save Changes
              </Button>
            </div>
          </>
        )}

        <hr className="my-8" />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tasks for this Project
        </h2>
        <div className="flex justify-end mb-4">
          <Link href={`/tasks/create?projectId=${project.id}`}>
            <Button variant="primary">Add New Task</Button>
          </Link>
        </div>

        {tasksLoading && <LoadingSpinner />}
        {tasksError && (
          <Alert type="error" message={tasksError} className="mb-4" />
        )}
        {!tasksLoading &&
          Array.isArray(tasks) &&
          tasks.length === 0 &&
          !tasksError && (
            <Alert type="info" message="No tasks found for this project." />
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tasks ?? []).map((task) => (
            <Card key={task.id} className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description || "No description"}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Priority: {task.priority}
              </p>
              <p className="text-sm text-gray-700">
                Status: {task.completed ? "Completed" : "Pending"}
              </p>
              {task.assignedTo && (
                <p className="text-sm text-gray-700">
                  Assigned To: {task.assignedTo.name}
                </p>
              )}
              <div className="flex justify-end mt-3">
                <Link href={`/tasks/${task.id}`} passHref>
                  <Button variant="secondary" size="sm">
                    View Task
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetails;

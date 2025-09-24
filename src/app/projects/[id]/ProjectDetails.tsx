/* eslint-disable react-hooks/exhaustive-deps */
// app/projects/[id]/ProjectDetails.tsx
"use client";

import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Project, Task } from "@/types";
import Card from "@/components/ui/Card";
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
      showError("Failed to Fetch Project Data...!");
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
      setTasksError("Failed to fetch tasks for this project.");
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
  }, [fetchProject, fetchTasksForProject]);

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
      setUpdateError("Failed to update project.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const ProjectDetailsSkeleton = () => (
    <Card className="max-w-8xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div> {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-1/2"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-3/4"></div> {/* Value */}
        </div>
        <div className="col-span-full">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-full"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
        </div>
      </div>
      <div className="flex justify-end space-x-3 mb-8">
        <div className="h-10 w-28 bg-gray-200 rounded"></div> {/* Button */}
        <div className="h-10 w-28 bg-gray-200 rounded"></div> {/* Button */}
      </div>
      <hr className="my-8" />
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>{" "}
      {/* Tasks for this Project title */}
      <div className="flex justify-end mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded"></div>{" "}
        {/* Add New Task Button */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>{" "}
            {/* Task Title */}
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>{" "}
            {/* Description */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>{" "}
            {/* Priority */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div> {/* Status */}
            <div className="flex justify-end mt-3">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>{" "}
              {/* View Task Button */}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="container mx-auto p-6">
        <ProjectDetailsSkeleton />
      </div>
    );
  if (!project)
    return <Alert type="info" message="Project not found." className="m-6" />;

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-8xl mx-auto shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Details
          </h1>
          <p className="text-2xl text-gray-600 font-medium">{project.name}</p>
        </div>

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
              type="textarea"
              value={editedDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setEditedDescription(e.target.value)
              }
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

        <hr className="my-8 border-gray-200" />

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tasks for this Project
          </h2>
          <p className="text-gray-600">Manage and track all tasks associated with this project</p>
        </div>
        <div className="flex justify-end mb-4">
          <Link href={`/tasks/create?projectId=${project.id}`}>
            <Button variant="primary">Add New Task</Button>
          </Link>
        </div>

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
          {tasksLoading ? (
            <>
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex justify-end mt-3">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </>
          ) : (
            (tasks ?? []).map((task) => (
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
                  Status: {task.status}
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetails;

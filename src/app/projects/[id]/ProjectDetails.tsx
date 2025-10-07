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
      setLoading(false);
    } catch {
      showError("Failed to Fetch Project Data...!");
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
    <Card className="w-full animate-pulse">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="flex gap-2 mb-2">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
            <div className="flex justify-end mt-3">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="w-full">
        <ProjectDetailsSkeleton />
      </div>
    );
  if (!project)
    return <Alert type="info" message="Project not found." className="m-6" />;

  return (
    <div className="w-full">
      <Card className="w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Details
          </h1>
          <p className="text-2xl text-gray-600 font-medium">{project.name}</p>
        </div>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">#</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Project ID
                  </h3>
                </div>
                <p className="text-gray-600 font-mono text-sm">{project.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">📁</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Project Name
                  </h3>
                </div>
                <p className="text-gray-600">{project.name}</p>
              </div>
              <div className="col-span-full bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Description
                  </h3>
                </div>
                <p className="text-gray-600">
                  {project.description || "No description provided"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-bold">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Owner</h3>
                </div>
                <p className="text-gray-600">{project.owner.name}</p>
                <p className="text-gray-700 dark:text-gray-500 text-sm">{project.owner.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Created At
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-bold">🔄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Last Updated
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(project.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mb-8">
              <Link href={"/projects"} className="mr-auto">
                Back to Projects
              </Link>
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
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tasks for this Project
          </h2>
          <p className="text-gray-600">
            Manage and track all tasks associated with this project
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasksLoading ? (
            <>
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="p-4 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex gap-2 mb-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="flex justify-end mt-3">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </>
          ) : (
            (tasks ?? []).map((task) => (
              <Card
                key={task.id}
                className="p-4 transition-transform"
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-gray-900 dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {task.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {task.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === "HIGH"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.priority === "LOW"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {task.priority === "HIGH"
                      ? "High"
                      : task.priority === "MEDIUM"
                        ? "Medium"
                        : task.priority === "LOW"
                          ? "Low"
                          : "Unknown"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {task.status === "DONE" ? "Completed" : "Pending"}
                  </span>
                </div>
                {task.assignedTo && (
                  <div className="flex items-center text-gray-700 text-sm">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-500"
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
                    <span className="font-medium">{task.assignedTo.name}</span>
                  </div>
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

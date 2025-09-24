/* eslint-disable react-hooks/exhaustive-deps */
// app/projects/ProjectsList.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Project, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useToast from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { PROJECTS_PAGE_LIMIT_OPTIONS } from "@/constants";
import PaginationControls from "@/components/common/PaginationControls";

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Project>>("/projects", {
        params: { q, page, limit },
      });
      setProjects(response.data);
      setTotalPages(response.pages);
    } catch {
      showError("Failed to Fetch Projects...!");
    } finally {
      setLoading(false);
    }
  }, [limit, page, q]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter((project) => project.id !== id));
        showSuccess("Project deleted successfully!");
      } catch {
        showError("Failed to Delete project...!");
      }
    }
  };

  const ProjectCardSkeleton = () => (
    <Card className="flex flex-col justify-between animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div> {/* Name */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>{" "}
      {/* Description */}
      <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* Owner */}
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>{" "}
        {/* View Details Button */}
        <div className="h-8 w-20 bg-gray-200 rounded"></div>{" "}
        {/* Delete Button */}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Project Dashboard
      </h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search projects by name..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-1/3"
        />
        <Link href="/projects/create" passHref>
          <Button variant="primary">Create New Project</Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {projects.length === 0 && !error && (
            <Alert
              type="info"
              message="No projects found. Start by creating one!"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm">
                    Owner:{" "}
                    <span className="font-medium">{project.owner.name}</span>
                  </p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link href={`/projects/${project.id}`} passHref>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              limitOptions={PROJECTS_PAGE_LIMIT_OPTIONS}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsList;

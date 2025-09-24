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
      <div>
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 w-20 bg-gray-200 rounded flex-1"></div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Project Dashboard
        </h1>
        <p className="text-xl text-gray-600">Manage and track all your projects in one place</p>
      </div>

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
              <Card key={project.id} className="flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {project.name}
                    </h3>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center text-gray-700 text-sm">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{project.owner.name}</span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link href={`/projects/${project.id}`} passHref>
                    <Button variant="secondary" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="flex-1"
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

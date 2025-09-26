"use client";

import React, { Suspense, lazy, memo } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkeletonCard from "@/components/ui/SkeletonCard";

const ProjectsList = lazy(() => import("./ProjectsList"));

const ProjectsPageSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto p-6 min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12 min-h-[120px]">
        <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
      </div>
      <div className="flex justify-between items-center mb-6 min-h-[40px]">
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} variant="project" />
        ))}
      </div>
    </div>
  </div>
));

ProjectsPageSkeleton.displayName = "ProjectsPageSkeleton";

const ProjectsPage: React.FC = memo(() => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Suspense fallback={<ProjectsPageSkeleton />}>
          <ProjectsList />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

ProjectsPage.displayName = "ProjectsPage";

export default ProjectsPage;

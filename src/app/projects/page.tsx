"use client";

import React, { Suspense, lazy, memo } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkeletonCard from "@/components/ui/SkeletonCard";

const ProjectsList = lazy(() => import("./ProjectsList"));

const ProjectsPageSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50" style={{ contain: 'layout style' }}>
    <div className="container mx-auto p-6" style={{ contain: 'layout style' }}>
      <div className="text-center mb-12" style={{ minHeight: '120px', contain: 'layout style' }}>
        <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
      </div>
      <div className="flex justify-between items-center mb-6" style={{ minHeight: '40px', contain: 'layout style' }}>
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ contain: 'layout style' }}>
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
      <div style={{ contain: 'layout style' }}>
        <Suspense fallback={<ProjectsPageSkeleton />}>
          <ProjectsList />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

ProjectsPage.displayName = "ProjectsPage";

export default ProjectsPage;

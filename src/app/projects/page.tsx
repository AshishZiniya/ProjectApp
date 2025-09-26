"use client";

import React, { Suspense, lazy, memo } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const ProjectsList = lazy(() => import("./ProjectsList"));

const ProjectsPageSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

ProjectsPageSkeleton.displayName = "ProjectsPageSkeleton";

const ProjectsPage: React.FC = memo(() => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProjectsPageSkeleton />}>
        <ProjectsList />
      </Suspense>
    </ErrorBoundary>
  );
});

ProjectsPage.displayName = "ProjectsPage";

export default ProjectsPage;

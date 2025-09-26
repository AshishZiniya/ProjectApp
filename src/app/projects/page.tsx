"use client";

import React, { Suspense, lazy, memo } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

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
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse min-h-[280px] flex flex-col justify-between" style={{ contain: 'layout style' }}>
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex-shrink-0" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="flex items-center text-gray-700 text-sm mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded mr-1 flex-shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="flex space-x-2 mt-auto">
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

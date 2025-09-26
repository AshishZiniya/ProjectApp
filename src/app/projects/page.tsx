// app/projects/page.tsx
"use client";
import ProjectsList from "./ProjectsList";

export default function ProjectsListPage() {
  // Let the backend API handle authentication and authorization
  // This prevents client-side authentication loops
  return <ProjectsList />;
}

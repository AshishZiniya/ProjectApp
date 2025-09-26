// app/admin/add-admin/page.tsx
"use client";
import AddAdmin from "@/app/admin/add-admin/AddAdmin";

export default function AddAdminPage() {
  // Authentication and authorization are now handled entirely in middleware
  // This page will only be accessible to users with admin permissions
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AddAdmin />
    </div>
  );
}

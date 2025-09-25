// app/admin/add-admin/page.tsx
"use client";
import { useEffect } from "react";
import AddAdmin from "@/app/admin/add-admin/AddAdmin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AddAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      router.replace("/projects");
    }
  }, [user, loading, router]);

  if (loading || (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN")) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AddAdmin />
    </div>
  );
}

// app/admin/add-admin/page.tsx
"use client";
import { useEffect } from "react";
import AddAdmin from "@/app/admin/add-admin/AddAdmin";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/hooks/useAuthorization";

export default function AddAdminPage() {
  const { loading, canAddAdmin } = useAuthorization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canAddAdmin) {
      router.replace("/projects");
    }
  }, [canAddAdmin, loading, router]);

  if (loading || !canAddAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AddAdmin />
    </div>
  );
}

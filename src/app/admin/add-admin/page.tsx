// app/admin/add-admin/page.tsx
"use client";
import { useEffect } from "react";
import AddAdmin from "@/app/admin/add-admin/AddAdmin";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/hooks/useAuthorization";
import Alert from "@/components/ui/Alert";

export default function AddAdminPage() {
  const { loading, canAddAdmin, user } = useAuthorization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canAddAdmin) {
      // Only redirect if user is not logged in, otherwise show error message
      if (!user) {
        router.replace("/auth/login");
      }
    }
  }, [canAddAdmin, loading, router, user]);

  if (loading) {
    return null;
  }

  // If user is not logged in, don't show error message (redirect will handle it)
  if (!user) {
    return null;
  }

  // If user is logged in but doesn't have permission, show error message
  if (!canAddAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert
            message="You don't have permission to add administrators. This action is only available to administrators."
            type="error"
            className="mb-4"
          />
          <div className="text-center">
            <button
              onClick={() => router.push("/projects")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AddAdmin />
    </div>
  );
}

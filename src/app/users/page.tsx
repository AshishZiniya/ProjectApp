// app/users/page.tsx
"use client";
import { useEffect } from "react";
import UsersList from "./UsersList";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/hooks/useAuthorization";
import Alert from "@/components/ui/Alert";

export default function UsersListPage() {
  const { loading, canViewUsers, user } = useAuthorization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canViewUsers) {
      // Only redirect if user is not logged in, otherwise show error message
      if (!user) {
        router.replace("/auth/login");
      }
    }
  }, [canViewUsers, loading, router, user]);

  // Handle edge case where user data is corrupted
  useEffect(() => {
    if (!loading && user && !user.role) {
      console.error("User object missing role information");
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  // If user is not logged in, don't show error message (redirect will handle it)
  if (!user) {
    return null;
  }

  // If user is logged in but doesn't have permission, show error message
  if (!canViewUsers) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert
            message="You don't have permission to view users. This page is only accessible to administrators."
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

  return <UsersList />;
}

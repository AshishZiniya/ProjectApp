// app/users/page.tsx
"use client";
import { useEffect } from "react";
import UsersList from "./UsersList";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function UsersListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace("/projects");
    }
  }, [user, loading, router]);

  if (loading || user?.role !== "ADMIN") {
    return null;
  }

  return <UsersList />;
}

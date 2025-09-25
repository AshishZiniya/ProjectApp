// app/users/page.tsx
"use client";
import { useEffect } from "react";
import UsersList from "./UsersList";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/hooks/useAuthorization";

export default function UsersListPage() {
  const { loading, canViewUsers } = useAuthorization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canViewUsers) {
      router.replace("/projects");
    }
  }, [canViewUsers, loading, router]);

  if (loading || !canViewUsers) {
    return null;
  }

  return <UsersList />;
}

// app/users/[id]/page.tsx
"use client";
import UserDetails from "./UserDetails";
import { useEffect, useState } from "react";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useRouter } from "next/navigation";

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading, canAccessResource } = useAuthorization();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!loading && userId && user) {
      const canAccess = canAccessResource(userId, "MANAGE_USERS");
      if (!canAccess) {
        router.replace("/projects");
      }
    }
  }, [user, loading, router, userId, canAccessResource]);

  if (
    loading ||
    !userId ||
    (user && !canAccessResource(userId, "MANAGE_USERS"))
  ) {
    return null;
  }

  return <UserDetails />;
}

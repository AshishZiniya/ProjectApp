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
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setUserId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
        router.replace("/users");
      }
    };

    resolveParams();
  }, [params, router]);

  useEffect(() => {
    if (!loading && userId && user) {
      try {
        const canAccess = canAccessResource(userId, "MANAGE_USERS");
        if (!canAccess) {
          router.replace("/projects");
        }
      } catch (error) {
        console.error("Error checking user permissions:", error);
        router.replace("/users");
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

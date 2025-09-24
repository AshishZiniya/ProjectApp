// app/users/[id]/page.tsx
"use client";
import UserDetails from "./UserDetails";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!loading && userId && user) {
      const isOwnProfile = user.id === userId;
      const isAdmin = user.role === "ADMIN";
      if (!isOwnProfile && !isAdmin) {
        router.replace("/projects");
      }
    }
  }, [user, loading, router, userId]);

  if (loading || !userId || (user && user.id !== userId && user.role !== "ADMIN")) {
    return null;
  }

  return <UserDetails />;
}

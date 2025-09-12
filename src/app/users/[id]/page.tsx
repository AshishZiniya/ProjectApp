// app/users/[id]/page.tsx
"use client";
import UserDetails from "./UserDetails";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function UserDetailsPage() {
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

  return <UserDetails />;
}

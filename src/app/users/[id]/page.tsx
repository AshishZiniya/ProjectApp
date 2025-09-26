// app/users/[id]/page.tsx
"use client";
import UserDetails from "./UserDetails";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  if (!userId) {
    return null;
  }

  return <UserDetails />;
}

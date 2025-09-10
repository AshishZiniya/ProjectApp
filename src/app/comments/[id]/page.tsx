import React from "react";
import CommentsList from "./CommentsList";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Match Next.js's async params type
}

export default async function CommentsPage({ params }: PageProps) {
  const { id } = await params; // Resolve the Promise to get taskId
  if (!id) {
    notFound(); // Trigger 404 if taskId is missing
  }

  return <CommentsList id={id} />;
}

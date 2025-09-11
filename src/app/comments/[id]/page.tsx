import React from "react";
import CommentsList from "./CommentsList";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string }; // Changed to direct string as it's resolved by Next.js
}

export default async function CommentsPage({ params }: PageProps) {
  const { id } = params; // Directly access id
  if (!id) {
    notFound(); // Trigger 404 if taskId is missing
  }

  return <CommentsList id={id} />;
}

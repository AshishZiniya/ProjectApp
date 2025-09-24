"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import api from "@/lib/api";
import useToast from "@/hooks/useToast";

export default function CreateCommentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId") || "";

  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) {
      showError("Task ID is required to post a comment.");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/comments/${taskId}`, { body });
      showSuccess("Comment posted successfully!");
      setBody("");
    } catch {
      showError("Failed to Post Comment...!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">💬</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Add Comment
          </h2>
          <p className="text-gray-600">Share your thoughts on this task</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="Comment"
            type="textarea"
            id="body"
            value={body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setBody(e.target.value)
            }
            required
          />
          <Button type="submit" loading={loading} className="w-full mt-4">
            Post Comment
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-full mt-2"
          >
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
}

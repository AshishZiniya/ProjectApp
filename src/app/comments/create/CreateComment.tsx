"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import api from "@/lib/api";
import useToast from "@/hooks/useToast";

interface CreateCommentProps {
  taskId: string;
  onCommentPosted?: () => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  taskId,
  onCommentPosted,
}) => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/comments/${taskId}`, { body });
      showSuccess("Comment posted successfully!");
      setBody("");
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch {
      showError("Failed to Post Comment...!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} className="mb-4" />}
      <Input
        label="Comment"
        type="textarea"
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full mt-4">
        Post Comment
      </Button>
    </form>
  );
};

export default CreateComment;

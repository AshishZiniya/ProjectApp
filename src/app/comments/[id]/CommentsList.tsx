"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Comment } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import useToast from "@/hooks/useToast";
import CommentItem from "../CommentItem";
import { io } from "socket.io-client";

interface CommentsListProps {
  id: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ id }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Comment[]>(`/comments/${id}/taskId`);
      setComments(response);
    } catch {
      showError("Failed to Fetch Data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchComments();
    // Initialize Socket.io connection
    const socket = io("http://localhost:4000", {
      transports: ["websocket"], // force websocket (optional but recommended)
      withCredentials: true,
    }); // Replace with your backend Socket.io URL
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("joinTaskComments", id); // Join a room specific to the task
    });
    socket.on("newComment", (newComment: Comment & { taskId?: string }) => {
      if (newComment.task?.id === id || newComment.taskId === id) {
        setComments((prev) => [newComment, ...prev]);
      }
    });

    socket.on("deletedComment", (deletedCommentId: string) => {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== deletedCommentId)
      );
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });
    return () => {
      socket.emit("leaveTaskComments", id); // Leave the room on unmount
      socket.disconnect();
    };
  }, [fetchComments, id]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${id}`);
        showSuccess("Comment deleted successfully!");
      } catch {
        showError("Failed to Delete Comment");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (comments.length === 0)
    return <Alert type="info" message="No comments found for this task." />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Comments for Task {id}
      </h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;

"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Comment } from "@/types";
import Alert from "@/components/ui/Alert";
import useToast from "@/hooks/useToast";
import CommentItem from "../CommentItem";
import { io } from "socket.io-client";
import Card from "@/components/ui/Card"; // Import Card for skeleton

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
      showError("Failed to Fetch Comments");
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchComments();
    // Initialize Socket.io connection
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      // Added ! for non-null assertion
      transports: ["websocket"], // force websocket (optional but recommended)
      withCredentials: true,
    });
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

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        showSuccess("Comment deleted successfully!");
        // Socket.io will handle updating the list, no need to manually filter here
      } catch {
        showError("Failed to Delete Comment");
      }
    }
  };

  const CommentItemSkeleton = () => (
    <Card className="p-4 bg-gray-50 border border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>{" "}
          {/* Author Name */}
          <div className="h-3 bg-gray-200 rounded w-40"></div> {/* Date */}
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>{" "}
        {/* Delete Button */}
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>{" "}
      {/* Body line 1 */}
      <div className="h-4 bg-gray-200 rounded w-5/6"></div> {/* Body line 2 */}
    </Card>
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Comments
        </h2>
        <p className="text-xl text-gray-600">All comments for Task {id}</p>
      </div>
      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(3)].map(
              (
                _,
                index // Display 3 skeleton items
              ) => (
                <CommentItemSkeleton key={index} />
              )
            )}
          </>
        ) : (
          <>
            {comments.length === 0 && (
              <Alert type="info" message="No comments found for this task." />
            )}
            {comments.map((comment) => (
              <CommentItem
                comment={comment}
                key={comment.id}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsList;

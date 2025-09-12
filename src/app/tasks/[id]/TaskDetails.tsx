"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  ReactNode,
  ChangeEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Task, Comment } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import CommentItem from "@/app/comments/CommentItem";
import useToast from "@/hooks/useToast";
import { io } from "socket.io-client";
import {
  TASK_PRIORITY_HIGH,
  TASK_PRIORITY_LOW,
  TASK_PRIORITY_MEDIUM,
} from "@/constants";
import FormGroup from "@/components/common/FormGroup";

const TaskDetails: React.FC = (): ReactNode => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState(2);
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [editedDueDate, setEditedDueDate] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [postCommentLoading, setPostCommentLoading] = useState(false);
  const [postCommentError, setPostCommentError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  const fetchTaskAndComments = useCallback(async () => {
    if (!id) {
      showError("No task ID provided");
      setLoading(false);
      setCommentsLoading(false);
      return;
    }
    setLoading(true);
    setCommentsLoading(true);
    setCommentsError(null);

    try {
      const taskResponse = await api.get<Task>(`/tasks/${id}`);
      if (!taskResponse.project || !taskResponse) {
        showError("Task or project data is missing");
      }
      setTask(taskResponse);
      setEditedTitle(taskResponse.title);
      setEditedDescription(taskResponse.description || "");
      setEditedPriority(taskResponse.priority);
      setEditedCompleted(taskResponse.completed);
      setEditedDueDate(
        taskResponse.dueDate
          ? new Date(taskResponse.dueDate).toISOString().split("T")[0]
          : ""
      );

      const commentsResponse = await api.get<Comment[]>(
        `/comments/${id}/taskId`
      );
      setComments(commentsResponse);
    } catch {
      showError("Failed to fetch task or comments. Please try again.");
      setTask(null);
      setCommentsError("Failed to load comments.");
    } finally {
      setLoading(false);
      setCommentsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchTaskAndComments();
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      // Added ! for non-null assertion
      transports: ["websocket"], // force websocket (optional but recommended)
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("joinTaskComments", id);
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
      socket.emit("leaveTaskComments", id);
      socket.disconnect();
    };
  }, [fetchTaskAndComments, id]);

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const response = await api.patch<Task>(`/tasks/${id}`, {
        title: editedTitle,
        description: editedDescription,
        priority: Number(editedPriority),
        completed: editedCompleted,
        dueDate: editedDueDate || null,
      });
      setTask(response);
      setIsEditing(false);
      showSuccess("Task updated successfully!");
    } catch {
      showError("Failed to Update Task...!");
      setUpdateError("Failed to update task.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim()) return;

    setPostCommentLoading(true);
    setPostCommentError(null);
    try {
      await api.post<Comment>(`/comments/${id}`, {
        body: newCommentBody,
      });
      setNewCommentBody("");
      showSuccess("Comment added successfully!");
      // Socket.io will handle updating the comments list
    } catch {
      showError("Failed to Add Comment...!");
      setPostCommentError("Failed to post comment.");
    } finally {
      setPostCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        showSuccess("Comment deleted successfully!");
        // Socket.io will handle updating the comments list
      } catch {
        showError("Failed to delete Comment...!");
      }
    }
  };

  const TaskDetailsSkeleton = () => (
    <Card className="max-w-8xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div> {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-1/2"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-3/4"></div> {/* Value */}
        </div>
        <div className="col-span-full">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-full"></div> {/* Value */}
        </div>
        <div className="col-span-full">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-full"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>{" "}
          {/* Label */}
          <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
        </div>
      </div>
      <div className="flex justify-end space-x-3 mb-8">
        <div className="h-10 w-28 bg-gray-200 rounded"></div> {/* Button */}
        <div className="h-10 w-28 bg-gray-200 rounded"></div> {/* Button */}
      </div>
      <hr className="my-8" />
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>{" "}
      {/* Comments title */}
      <div className="flex justify-end mb-4">
        <div className="h-10 w-40 bg-gray-200 rounded"></div>{" "}
        {/* View All Comments Button */}
      </div>
      <div className="h-20 bg-gray-200 rounded mb-2"></div>{" "}
      {/* New comment input */}
      <div className="h-10 bg-gray-200 rounded w-full"></div>{" "}
      {/* Post Comment Button */}
      <div className="space-y-4 mt-6">
        {[...Array(2)].map((_, index) => (
          <Card
            key={index}
            className="p-4 bg-gray-50 border border-gray-200 animate-pulse"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>{" "}
                {/* Author Name */}
                <div className="h-3 bg-gray-200 rounded w-40"></div>{" "}
                {/* Date */}
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>{" "}
              {/* Delete Button */}
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>{" "}
            {/* Body line 1 */}
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>{" "}
            {/* Body line 2 */}
          </Card>
        ))}
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="container mx-auto p-6">
        <TaskDetailsSkeleton />
      </div>
    );
  if (!task)
    return <Alert type="info" message="Task not found." className="m-6" />;

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Task Details: {task.title}
        </h1>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">ID:</p>
                <p className="text-lg font-medium text-gray-900">{task.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Project:</p>
                {task.project ? (
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    <p className="text-lg font-medium text-gray-900">
                      {task.project.name}
                    </p>
                  </Link>
                ) : (
                  <p className="text-lg font-medium text-gray-900">
                    No project assigned
                  </p>
                )}
              </div>
              <div className="col-span-full">
                <p className="text-gray-600 text-sm">Title:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.title}
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-gray-600 text-sm">Description:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.description || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Priority:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.priority}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.completed ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Due Date:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Assigned To:</p>
                <p className="text-lg font-medium text-gray-900">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Created At:</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Updated At:</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(task.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mb-8">
              <Button variant="secondary" onClick={() => router.back()}>
                Back to Project
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit Task</Button>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Title"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Description"
              type="textarea"
              value={editedDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setEditedDescription(e.target.value)
              }
              className="mb-4"
            />
            <FormGroup label="Priority" htmlFor="priority">
              <select
                id="priority"
                value={editedPriority}
                onChange={(e) => setEditedPriority(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={TASK_PRIORITY_HIGH}>High</option>
                <option value={TASK_PRIORITY_MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY_LOW}>Low</option>
              </select>
            </FormGroup>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={editedCompleted}
                onChange={(e) => setEditedCompleted(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="completed"
                className="ml-2 block text-sm text-gray-900"
              >
                Completed
              </label>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="mb-6"
            />
            <div className="flex justify-end space-x-3 mb-8">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} loading={updateLoading}>
                Save Changes
              </Button>
            </div>
          </>
        )}

        <hr className="my-8" />

        <div className="flex justify-between justify-items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 align-text-bottom">Comments</h2>
          <Button onClick={() => router.push(`/comments/${task.id}`)}>
            View All Comments
          </Button>
        </div>
        {postCommentError && (
          <Alert type="error" message={postCommentError} className="mb-4" />
        )}
        <form onSubmit={handlePostComment} className="mb-6">
          <Input
            type="textarea"
            placeholder="Add a new comment..."
            value={newCommentBody}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewCommentBody(e.target.value)
            }
            className="mb-2"
          />
          <Button type="submit" loading={postCommentLoading} className="w-full">
            Post Comment
          </Button>
        </form>

        {commentsError && (
          <Alert type="error" message={commentsError} className="mb-4" />
        )}
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <Card
                key={index}
                className="p-4 bg-gray-50 border border-gray-200 animate-pulse"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {!commentsLoading && comments.length === 0 && !commentsError && (
              <Alert
                type="info"
                message="No comments yet. Be the first to comment!"
              />
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default TaskDetails;

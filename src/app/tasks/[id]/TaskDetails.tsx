"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  ReactNode,
  ChangeEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { LegacyTask as Task, Comment } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CommentItem from "@/app/comments/CommentItem";
import useToast from "@/hooks/useToast";
import { io } from "socket.io-client";
import { TASK_PRIORITY } from "@/constants";
import FormGroup from "@/components/common/FormGroup";

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return "High";
    case TASK_PRIORITY.MEDIUM:
      return "Medium";
    case TASK_PRIORITY.LOW:
      return "Low";
    default:
      return "Unknown";
  }
};

const TaskDetails: React.FC = (): ReactNode => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState(2);
  const [editedStatus, setEditedStatus] = useState<
    "TODO" | "IN_PROGRESS" | "DONE"
  >("TODO");
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
      setEditedPriority(Number(taskResponse.priority));
      setEditedStatus(taskResponse.status);
      const dueDateString = taskResponse.dueDate
        ? new Date(taskResponse.dueDate).toISOString().split("T")[0]
        : "";
      setEditedDueDate(dueDateString || "");

      const commentsResponse = await api.get<Comment[]>(`/comments/task/${id}`);
      setComments(commentsResponse);
      setLoading(false);
      setCommentsLoading(false);
    } catch (error) {
      console.error("Error fetching task and comments:", error);
      showError("Failed to fetch task or comments. Please try again.");
      setTask(null);
      setCommentsError("Failed to load comments.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchTaskAndComments();
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      showError("API base URL not configured");
      return;
    }

    const socket = io(apiBaseUrl, {
      transports: ["websocket"], // force websocket (optional but recommended)
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("joinTaskComments", id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });
    socket.on("newComment", (newComment: Comment & { taskId?: string }) => {
      if (newComment.task?.id === id || newComment.taskId === id) {
        setComments((prev) => [newComment, ...prev]);
      }
    });

    socket.on("deletedComment", (deletedCommentId: string) => {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== deletedCommentId),
      );
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });
    return () => {
      socket.emit("leaveTaskComments", id);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTaskAndComments, id]);

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const response = await api.patch<Task>(`/tasks/${id}`, {
        title: editedTitle,
        description: editedDescription,
        priority: Number(editedPriority),
        status: editedStatus,
        dueDate: editedDueDate || null,
      });
      setTask(response);
      setIsEditing(false);
      showSuccess("Task updated successfully!");
      setUpdateLoading(false);
    } catch (error) {
      console.error("Error updating task:", error);
      showError("Failed to Update Task...!");
      setUpdateError("Failed to update task.");
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
    } catch (error) {
      console.error("Error posting comment:", error);
      showError("Failed to Add Comment...!");
      setPostCommentError("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${comment.id}`);
        showSuccess("Comment deleted successfully!");
        // Socket.io will handle updating the comments list
      } catch (error) {
        console.error("Error deleting comment:", error);
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
      <div className="p-6 w-full">
        <TaskDetailsSkeleton />
      </div>
    );
  if (!task)
    return <Alert type="info" message="Task not found." className="m-6" />;

  return (
    <div className="px-6 py-8 w-full">
      <Card className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Task Details
          </h1>
          <p className="text-lg text-gray-600 font-medium">{task.title}</p>
        </div>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">#</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Task ID
                  </h3>
                </div>
                <p className="text-gray-600 font-mono text-sm">{task.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">📁</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Project
                  </h3>
                </div>
                {task.project ? (
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="text-blue-600"
                  >
                    <p className="text-gray-600">{task.project.name}</p>
                  </Link>
                ) : (
                  <p className="text-gray-600">No project assigned</p>
                )}
              </div>
              <div className="col-span-full bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Title</h3>
                </div>
                <p className="text-gray-600">{task.title}</p>
              </div>
              <div className="col-span-full bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-bold">📖</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Description
                  </h3>
                </div>
                <p className="text-gray-600">
                  {task.description || "No description provided"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-bold">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Priority
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    Number(task.priority) === TASK_PRIORITY.HIGH
                      ? "bg-red-100 text-red-800"
                      : Number(task.priority) === TASK_PRIORITY.MEDIUM
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {getPriorityLabel(Number(task.priority))}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-bold">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Status
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "DONE"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status === "DONE" ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Due Date
                  </h3>
                </div>
                <p className="text-gray-600">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No due date"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-pink-600 font-bold">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Assigned To
                  </h3>
                </div>
                <p className="text-gray-600">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🕒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Created At
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lime-600 font-bold">🔄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Last Updated
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(task.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mb-8">
              <Link
                href={`/projects/${task.project?.id}`}
                className="px-4 py-2 bg-gray-500 text-gray-900 dark:text-white rounded-md transition-all duration-200"
              >
                Back to Project
              </Link>
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
                <option value={TASK_PRIORITY.HIGH}>High</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.LOW}>Low</option>
              </select>
            </FormGroup>
            <FormGroup label="Status" htmlFor="status">
              <select
                id="status"
                value={editedStatus}
                onChange={(e) =>
                  setEditedStatus(
                    e.target.value as "TODO" | "IN_PROGRESS" | "DONE",
                  )
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </FormGroup>
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

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
          </div>
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

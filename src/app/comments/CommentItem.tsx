// app/comments/CommentItem.tsx
import React from "react";
import { Comment } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface CommentItemProps {
  comment: Comment;
  onDelete: (comment: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  return (
    <Card className="group p-4 bg-gray-50 border border-gray-200 transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 text-gray-900 dark:text-white font-bold text-sm">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{comment.author.name}</p>
            <div className="flex items-center text-xs text-gray-700 dark:text-gray-500">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(comment)}
          className="opacity-0 transition-opacity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment.body}</p>
    </Card>
  );
};

export default CommentItem;

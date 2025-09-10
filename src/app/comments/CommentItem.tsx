// app/comments/CommentItem.tsx
import React from 'react';
import { Comment } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  return (
    <Card className="p-4 bg-gray-50 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">{comment.author.name}</p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => onDelete(comment.id)}>
          Delete
        </Button>
      </div>
      <p className="text-gray-700">{comment.body}</p>
    </Card>
  );
};

export default CommentItem;

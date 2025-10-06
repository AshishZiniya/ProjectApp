// app/tasks/create/CreateTask.tsx
'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import api from '@/lib/api';
import { User } from '@/types';
import useToast from '@/hooks/useToast';
import { TASK_PRIORITY } from '@/constants';
import FormGroup from '@/components/common/FormGroup';

const CreateTask: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('projectId');

  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(2);
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]); // For assignee dropdown
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await api.get<{ data: User[] }>('/users', {
          params: { limit: 100 },
        }); // Fetch all users for dropdown
        setUsers(response.data || []);
        setUsersLoading(false);
      } catch {
        setUsersError('Failed to load assignees.');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dto = {
        projectId,
        title,
        description: description || undefined,
        priority: Number(priority),
        status,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      };
      await api.post('/tasks', dto);
      router.push(`/projects/${projectId}?refresh=true`);
      showSuccess('Task created successfully!');
      setLoading(false);
    } catch {
      showError('Failed to Create task');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg p-6">
      <Card className="w-full max-w-2xl glass-card shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
            <span className="text-white font-bold text-3xl">✅</span>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">
            Create New Task
          </h2>
          <p className="text-gray-500 text-lg">
            Add a new task to your project and assign it to team members
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6 glass-card border-red-400/20"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Project ID"
              type="text"
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              disabled={!!initialProjectId}
              className="text-white"
            />

            <Input
              label="Title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-white"
            />
          </div>

          <Input
            label="Description (Optional)"
            type="textarea"
            id="description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormGroup label="Priority" htmlFor="priority">
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="block w-full px-4 py-3 border border-white/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 glass text-white backdrop-blur-md"
              >
                <option value={TASK_PRIORITY.HIGH}>High</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.LOW}>Low</option>
              </select>
            </FormGroup>

            <FormGroup label="Status" htmlFor="status">
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')
                }
                className="block w-full px-4 py-3 border border-white/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 glass text-white backdrop-blur-md"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </FormGroup>

            <Input
              label="Due Date (Optional)"
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-white"
            />
          </div>

          <FormGroup label="Assignee (Optional)" htmlFor="assignee">
            {usersLoading ? (
              <div className="h-12 glass-card rounded-xl animate-pulse"></div>
            ) : usersError ? (
              <Alert
                type="error"
                message={usersError}
                className="glass-card border-red-400/20"
              />
            ) : (
              <select
                id="assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="block w-full px-4 py-3 border border-white/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 glass text-white backdrop-blur-md"
              >
                <option value="">Select Assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </FormGroup>

          <div className="flex space-x-4 pt-4">
            <Link href={`/projects/${projectId}`} className="flex-1">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 shadow-2xl hover:shadow-blue-500/30"
              loading={loading}
            >
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTask;

// app/projects/create/CreateProject.tsx
'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import api from '@/lib/api';
import useToast from '@/hooks/useToast';
import { Project } from '@/types';

const CreateProject: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Project>('/projects', {
        name,
        description,
      });
      router.push(`/projects/${response.id}`);
      showSuccess('Project created successfully!');
      setLoading(false);
    } catch {
      showError('Failed to Create project...!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg p-6">
      <Card className="w-full max-w-lg glass-card shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
            <span className="text-white font-bold text-3xl">📁</span>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">
            Create New Project
          </h2>
          <p className="text-gray-500 text-lg">
            Start a new project and bring your ideas to life
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Enter project name"
            required
            className="text-white"
          />

          <Input
            label="Description"
            type="textarea"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your project (optional)"
            className="text-white"
          />

          {error && (
            <Alert
              type="error"
              message={error}
              className="glass-card border-red-400/20"
            />
          )}

          <div className="flex space-x-4 pt-4">
            <Link href="/projects" className="flex-1">
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
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;

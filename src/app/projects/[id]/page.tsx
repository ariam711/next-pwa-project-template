'use client';

import { format } from 'date-fns';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/domain/entities';
import { TaskList } from '@/features/tasks/TaskList';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Failed to fetch project', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Button asChild variant="outline">
          <Link href="/projects">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/projects">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created on {format(new Date(project.createdAt), 'PPP')}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <section className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
            <TaskList projectId={id} />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold">Project Info</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { CreateProjectForm } from '@/features/projects/CreateProjectForm';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { useProjectStore } from '@/stores/useProjectStore';

export default function ProjectsPage() {
  const { projects, fetchProjects, isLoading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Create and manage your project portfolio.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {isLoading && projects.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No projects found. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <h2 className="text-xl font-semibold">New Project</h2>
          <CreateProjectForm />
        </aside>
      </div>
    </div>
  );
}

import { ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card as UICard,
  CardDescription as UICardDescription,
  CardFooter as UICardFooter,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
} from '@/components/ui/card';
import type { Project } from '@/domain/entities';
import { useProjectStore } from '@/stores/useProjectStore';

export function ProjectCard({ project }: { project: Project }) {
  const deleteProject = useProjectStore((state) => state.deleteProject);

  return (
    <UICard className="group transition-all hover:shadow-md">
      <UICardHeader>
        <div className="flex items-start justify-between">
          <div>
            <UICardTitle>{project.name}</UICardTitle>
            {project.description && (
              <UICardDescription className="mt-2 line-clamp-2">
                {project.description}
              </UICardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              if (confirm('Are you sure?')) deleteProject(project.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </UICardHeader>
      <UICardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/projects/${project.id}`}>
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </UICardFooter>
    </UICard>
  );
}

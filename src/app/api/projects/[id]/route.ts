import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProjectRepository, getTaskRepository } from '@/infrastructure';

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = getProjectRepository();
  const project = await repo.findById(id);

  if (!project) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateProjectSchema.parse(body);
    const repo = getProjectRepository();
    const project = await repo.update(id, validated);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectRepo = getProjectRepository();
  const taskRepo = getTaskRepository();

  const success = await projectRepo.delete(id);
  if (!success) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  // Cascading delete
  await taskRepo.deleteByProjectId(id);

  return new NextResponse(null, { status: 204 });
}

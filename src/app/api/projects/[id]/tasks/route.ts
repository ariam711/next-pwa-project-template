import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getTaskRepository } from '@/infrastructure';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const repo = getTaskRepository();
  const tasks = await repo.findByProjectId(projectId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const validated = createTaskSchema.parse(body);
    const repo = getTaskRepository();
    const task = await repo.create({
      ...validated,
      projectId,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

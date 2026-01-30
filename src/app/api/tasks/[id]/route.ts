import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getTaskRepository } from '@/infrastructure';

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateTaskSchema.parse(body);
    const repo = getTaskRepository();
    const task = await repo.update(id, validated);

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = getTaskRepository();
  const success = await repo.delete(id);

  if (!success) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProjectRepository } from '@/infrastructure';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export async function GET() {
  const repo = getProjectRepository();
  const projects = await repo.findAll();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createProjectSchema.parse(body);
    const repo = getProjectRepository();
    const project = await repo.create(validated);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

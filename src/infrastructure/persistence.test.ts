import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JsonProjectRepository, JsonTaskRepository } from './persistence';

// Mock fs
vi.mock('node:fs/promises', () => {
  const mockFs = {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
    mkdir: vi.fn(),
  };
  return {
    ...mockFs,
    default: mockFs,
  };
});

describe('JsonProjectRepository', () => {
  let repo: JsonProjectRepository;
  const mockProjects = [
    {
      id: '1',
      name: 'Test Project',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    repo = new JsonProjectRepository();
    vi.clearAllMocks();
  });

  it('should find all projects', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockProjects));
    const projects = await repo.findAll();
    expect(projects).toEqual(mockProjects);
  });

  it('should return empty array if file read fails', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));
    const projects = await repo.findAll();
    expect(projects).toEqual([]);
  });

  it('should create a new project', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('[]');
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.access).mockRejectedValue(new Error('Dir not found'));
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    const newProject = await repo.create({ name: 'New Project', description: 'Desc' });

    expect(newProject.name).toBe('New Project');
    expect(newProject.id).toBeDefined();
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe('JsonTaskRepository', () => {
  let repo: JsonTaskRepository;
  const mockTasks = [
    {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Test Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    repo = new JsonTaskRepository();
    vi.clearAllMocks();
  });

  it('should find tasks by project id', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockTasks));
    const tasks = await repo.findByProjectId('project-1');
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('task-1');
  });

  it('should create a new task', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('[]');
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const newTask = await repo.create({
      projectId: 'project-1',
      title: 'New Task',
      completed: false,
    });

    expect(newTask.title).toBe('New Task');
    expect(newTask.projectId).toBe('project-1');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('should update a task', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockTasks));
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const updatedTask = await repo.update('task-1', { completed: true });

    expect(updatedTask?.completed).toBe(true);
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('should delete a task', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockTasks));
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const result = await repo.delete('task-1');

    expect(result).toBe(true);
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

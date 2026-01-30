import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JsonProjectRepository } from './persistence';

// Mock fs
vi.mock('node:fs/promises');

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
    vi.resetAllMocks();
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
    // Mock access to fail so it tries to create dir, but we just want to ensure it doesn't crash
    vi.mocked(fs.access).mockRejectedValue(new Error('Dir not found'));
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    const newProject = await repo.create({
      name: 'New Project',
      description: 'Desc',
    });

    expect(newProject.name).toBe('New Project');
    expect(newProject.id).toBeDefined();
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

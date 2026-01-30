import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  CreateProjectInput,
  CreateTaskInput,
  Project,
  Task,
  UpdateProjectInput,
  UpdateTaskInput,
} from '@/domain/entities';
import type { IProjectRepository, ITaskRepository } from '@/domain/repositories';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJson<T>(filePath: string): Promise<T[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (_error) {
    return [];
  }
}

async function writeJson<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export class JsonProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    return readJson<Project>(PROJECTS_FILE);
  }

  async findById(id: string): Promise<Project | null> {
    const projects = await this.findAll();
    return projects.find((p) => p.id === id) || null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const projects = await this.findAll();
    const newProject: Project = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    await writeJson(PROJECTS_FILE, projects);
    return newProject;
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const projects = await this.findAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProject: Project = {
      ...projects[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    await writeJson(PROJECTS_FILE, projects);
    return updatedProject;
  }

  async delete(id: string): Promise<boolean> {
    const projects = await this.findAll();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;
    await writeJson(PROJECTS_FILE, filtered);
    return true;
  }
}

export class JsonTaskRepository implements ITaskRepository {
  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await readJson<Task>(TASKS_FILE);
    return tasks.filter((t) => t.projectId === projectId);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const tasks = await readJson<Task>(TASKS_FILE);
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await writeJson(TASKS_FILE, tasks);
    return newTask;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const tasks = await readJson<Task>(TASKS_FILE);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTask: Task = {
      ...tasks[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    tasks[index] = updatedTask;
    await writeJson(TASKS_FILE, tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await readJson<Task>(TASKS_FILE);
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    await writeJson(TASKS_FILE, filtered);
    return true;
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    const tasks = await readJson<Task>(TASKS_FILE);
    const filtered = tasks.filter((t) => t.projectId !== projectId);
    await writeJson(TASKS_FILE, filtered);
  }
}

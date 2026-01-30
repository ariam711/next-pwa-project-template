import type {
  CreateProjectInput,
  CreateTaskInput,
  Project,
  Task,
  UpdateProjectInput,
  UpdateTaskInput,
} from './entities';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, input: UpdateProjectInput): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

export interface ITaskRepository {
  findByProjectId(projectId: string): Promise<Task[]>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  deleteByProjectId(projectId: string): Promise<void>;
}

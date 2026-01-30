import { create } from 'zustand';
import type { CreateProjectInput, CreateTaskInput, Project, Task } from '@/domain/entities';

interface ProjectState {
  projects: Project[];
  tasks: Record<string, Task[]>;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  addProject: (input: CreateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  fetchTasks: (projectId: string) => Promise<void>;
  addTask: (projectId: string, input: CreateTaskInput) => Promise<void>;
  toggleTask: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  tasks: {},
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addProject: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create project');
      const newProject = await res.json();
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchTasks: async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set((state) => ({
        tasks: { ...state.tasks, [projectId]: data },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addTask: async (projectId, input) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTask = await res.json();
      set((state) => ({
        tasks: {
          ...state.tasks,
          [projectId]: [...(state.tasks[projectId] || []), newTask],
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  toggleTask: async (taskId, completed) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      const projectId = updatedTask.projectId;
      set((state) => ({
        tasks: {
          ...state.tasks,
          [projectId]: state.tasks[projectId].map((t) => (t.id === taskId ? updatedTask : t)),
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTask: async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');

      // We need to find the project ID for this task to update the store
      // A bit inefficient but keep the store simple
      const state = get();
      for (const projectId in state.tasks) {
        const taskIndex = state.tasks[projectId].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          set((state) => ({
            tasks: {
              ...state.tasks,
              [projectId]: state.tasks[projectId].filter((t) => t.id !== taskId),
            },
          }));
          break;
        }
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));

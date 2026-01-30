import { JsonProjectRepository, JsonTaskRepository } from './persistence';

const projectRepository = new JsonProjectRepository();
const taskRepository = new JsonTaskRepository();

export function getProjectRepository() {
  return projectRepository;
}

export function getTaskRepository() {
  return taskRepository;
}

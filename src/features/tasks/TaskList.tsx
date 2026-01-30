import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/useProjectStore';

export function TaskList({ projectId }: { projectId: string }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { tasks, fetchTasks, addTask, toggleTask, deleteTask } = useProjectStore();

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(projectId, { title: newTaskTitle, completed: false, projectId });
    setNewTaskTitle('');
  };

  const projectTasks = tasks[projectId] || [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {projectTasks.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No tasks yet. Add one above!
          </p>
        ) : (
          projectTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
                />
                <span className={task.completed ? 'text-muted-foreground line-through' : ''}>
                  {task.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

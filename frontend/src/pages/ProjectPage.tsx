import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { Navbar } from '../components/layout/Navbar';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/ui/Button';
import { Plus, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading: isProjectLoading } = useProject(id!);
  const { tasks, isLoading: isTasksLoading } = useTasks(id!);

  const columns = [
    { id: 'todo', title: 'Tehtävät', status: 'todo' },
    { id: 'in_progress', title: 'Työn alla', status: 'in_progress' },
    { id: 'review', title: 'Tarkistettavana', status: 'review' },
    { id: 'done', title: 'Valmis', status: 'done' },
  ];

  if (isProjectLoading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Projektia ei löytynyt</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Takaisin projekteihin</span>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {project.description && (
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                )}
              </div>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Uusi tehtävä</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{column.title}</h2>
                <span className="text-xs text-muted-foreground">
                  {tasks?.filter((t) => t.status === column.status).length || 0}
                </span>
              </div>
              <div className="space-y-3">
                {isTasksLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  tasks
                    ?.filter((task) => task.status === column.status)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
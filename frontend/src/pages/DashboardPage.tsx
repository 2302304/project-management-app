import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Navbar } from '../components/layout/Navbar';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { Button } from '../components/ui/Button';
import { Plus, Loader2 } from 'lucide-react';

export const DashboardPage = () => {
  const { projects, isLoading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projektit</h1>
            <p className="text-muted-foreground mt-1">
              Hallinnoi projektejasi ja tehtäviäsi
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Uusi projekti</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Ei vielä projekteja</p>
            <Button onClick={() => setIsModalOpen(true)}>
              Luo ensimmäinen projekti
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
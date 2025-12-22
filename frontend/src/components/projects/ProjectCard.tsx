import type { Project } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Calendar, Users, CheckSquare } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    planning: 'Suunnittelu',
    active: 'Aktiivinen',
    on_hold: 'Jäissä',
    completed: 'Valmis',
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: project.color }}
              />
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckSquare className="h-4 w-4" />
                <span>{project._count?.tasks || 0} tehtävää</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{project.members?.length || 0}</span>
              </div>
            </div>
            {project.endDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(project.endDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
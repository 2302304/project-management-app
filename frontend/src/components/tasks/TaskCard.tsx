import type { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Calendar, MessageSquare, Clock } from 'lucide-react';
import { formatDate, getInitials } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    low: 'Matala',
    medium: 'Normaali',
    high: 'Korkea',
    urgent: 'Kiireellinen',
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              {task._count && task._count.comments > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task._count.comments}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.estimatedHours && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

            {task.assignedTo && (
              <div
                className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium"
                title={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}
              >
                {getInitials(task.assignedTo.firstName, task.assignedTo.lastName)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
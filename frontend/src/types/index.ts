export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  timezone?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  color: string;
  startDate?: string;
  endDate?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  owner: User;
  members: ProjectMember[];
  _count?: {
    tasks: number;
  };
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user: User;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedToId?: string;
  createdById: string;
  parentTaskId?: string;
  position: number;
  estimatedHours?: number;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
  createdBy: User;
  subTasks?: Task[];
  _count?: {
    comments: number;
    timeEntries: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  estimatedHours?: number;
}
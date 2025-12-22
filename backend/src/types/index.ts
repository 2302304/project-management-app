import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  color?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  estimatedHours?: number;
}
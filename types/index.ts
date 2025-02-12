export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface Task {
  id: string;
  content: string;
  assignees: User[];
  labels?: string[];
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

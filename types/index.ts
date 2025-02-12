export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface Task {
  id: string;
  content: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  description?: string;
}

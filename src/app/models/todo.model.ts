export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TodoStatus = 'PENDING' | 'COMPLETED';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: Priority;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
}

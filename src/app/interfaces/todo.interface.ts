import { Priority, TodoStatus } from '../models/todo.model';

export interface TodoRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: Priority;
  status: TodoStatus;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

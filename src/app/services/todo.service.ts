import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo, TodoStats, TodoStatus } from '../models/todo.model';
import { TodoRequest } from '../interfaces/todo.interface';

export interface TodoQuery {
  status?: TodoStatus | '';
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  direction?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll(query: TodoQuery = {}): Observable<Todo[]> {
    let params = new HttpParams();
    if (query.status) params = params.set('status', query.status);
    if (query.search) params = params.set('search', query.search);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.direction) params = params.set('direction', query.direction);

    return this.http.get<Todo[]>(this.apiUrl, { params });
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats`);
  }

  getById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  create(request: TodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, request);
  }

  update(id: number, request: TodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, request);
  }

  updateStatus(id: number, status: TodoStatus): Observable<Todo> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

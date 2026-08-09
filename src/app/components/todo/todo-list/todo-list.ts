import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { TodoService } from '../../../services/todo.service';
import { Todo, TodoStatus } from '../../../models/todo.model';
import { TodoRequest } from '../../../interfaces/todo.interface';
import { TodoForm } from '../todo-form/todo-form';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

type SortOption = 'createdAt' | 'dueDate' | 'priority';
type StatusFilter = '' | TodoStatus;

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TodoForm, LoadingSpinner],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {
  private authService = inject(AuthService);
  private todoService = inject(TodoService);
  private router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly saving = signal(false);
  readonly deletingId = signal<number | null>(null);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('');
  readonly sortBy = signal<SortOption>('createdAt');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly showForm = signal(false);
  readonly editingTodo = signal<Todo | null>(null);
  readonly confirmDeleteTodo = signal<Todo | null>(null);

  readonly isEmpty = computed(() => !this.loading() && this.todos().length === 0);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.loadTodos();
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.todoService
      .getAll({
        status: this.statusFilter() || undefined,
        search: this.searchTerm() || undefined,
        sortBy: this.sortBy(),
        direction: this.sortDirection()
      })
      .subscribe({
        next: (todos) => {
          this.todos.set(todos);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Could not load your todos. Please try again.');
          this.loading.set(false);
        }
      });
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  onFilterChange(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.loadTodos();
  }

  onSortChange(sortBy: SortOption): void {
    if (this.sortBy() === sortBy) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortDirection.set('asc');
    }
    this.loadTodos();
  }

  openCreateForm(): void {
    this.editingTodo.set(null);
    this.showForm.set(true);
  }

  openEditForm(todo: Todo): void {
    this.editingTodo.set(todo);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }

  saveTodo(request: TodoRequest): void {
    this.saving.set(true);
    const editing = this.editingTodo();

    const request$ = editing
      ? this.todoService.update(editing.id, request)
      : this.todoService.create(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.loadTodos();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save the todo. Please check the form and try again.');
      }
    });
  }

  toggleStatus(todo: Todo): void {
    const newStatus: TodoStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    this.todoService.updateStatus(todo.id, newStatus).subscribe({
      next: (updated) => {
        this.todos.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      },
      error: () => this.errorMessage.set('Could not update the todo status.')
    });
  }

  askDelete(todo: Todo): void {
    this.confirmDeleteTodo.set(todo);
  }

  cancelDelete(): void {
    this.confirmDeleteTodo.set(null);
  }

  confirmDelete(): void {
    const todo = this.confirmDeleteTodo();
    if (!todo) return;

    this.deletingId.set(todo.id);
    this.todoService.delete(todo.id).subscribe({
      next: () => {
        this.todos.update((list) => list.filter((t) => t.id !== todo.id));
        this.deletingId.set(null);
        this.confirmDeleteTodo.set(null);
      },
      error: () => {
        this.errorMessage.set('Could not delete the todo. Please try again.');
        this.deletingId.set(null);
        this.confirmDeleteTodo.set(null);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

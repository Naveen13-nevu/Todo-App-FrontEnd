import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TodoService } from '../../services/todo.service';
import { TodoStats } from '../../models/todo.model';
import { LoadingSpinner } from '../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private todoService = inject(TodoService);
  private router = inject(Router);

  readonly loading = signal(true);
  readonly stats = signal<TodoStats>({ total: 0, completed: 0, pending: 0 });

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.todoService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  get completionRate(): number {
    const total = this.stats().total;
    if (!total) return 0;
    return Math.round((this.stats().completed / total) * 100);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.Register),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./components/todo/todo-list/todo-list').then((m) => m.TodoList),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../../models/todo.model';
import { TodoRequest } from '../../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss'
})
export class TodoForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() todo: Todo | null = null;
  @Input() saving = false;

  @Output() save = new EventEmitter<TodoRequest>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    dueDate: [''],
    priority: ['MEDIUM', [Validators.required]],
    status: ['PENDING', [Validators.required]]
  });

  get f() {
    return this.form.controls;
  }

  get isEditMode(): boolean {
    return !!this.todo;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo']) {
      if (this.todo) {
        this.form.patchValue({
          title: this.todo.title,
          description: this.todo.description || '',
          dueDate: this.todo.dueDate ? this.todo.dueDate.substring(0, 10) : '',
          priority: this.todo.priority,
          status: this.todo.status
        });
      } else {
        this.form.reset({
          title: '',
          description: '',
          dueDate: '',
          priority: 'MEDIUM',
          status: 'PENDING'
        });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.save.emit({
      title: raw.title!,
      description: raw.description || '',
      dueDate: raw.dueDate || null,
      priority: raw.priority as TodoRequest['priority'],
      status: raw.status as TodoRequest['status']
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

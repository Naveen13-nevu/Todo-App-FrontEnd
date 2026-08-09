import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrap" [class.inline]="inline">
      <span class="leaf-spinner" [style.width.px]="size" [style.height.px]="size"></span>
      @if (label) {
        <span class="spinner-label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 24px;
    }
    .spinner-wrap.inline {
      flex-direction: row;
      padding: 0;
    }
    .leaf-spinner {
      display: inline-block;
      border-radius: 50% 0 50% 50%;
      border: 3px solid var(--color-primary-soft, #ece4fd);
      border-top-color: var(--color-primary, #6c3ef3);
      animation: spin 0.8s linear infinite;
    }
    .spinner-label {
      font-size: 13px;
      color: var(--color-ink-soft, #5a5680);
      font-weight: 500;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinner {
  @Input() size = 28;
  @Input() label = '';
  @Input() inline = false;
}

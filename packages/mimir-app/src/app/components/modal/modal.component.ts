import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  title = input.required<string>();
  message = input.required<string>();
  type = input<'success' | 'error' | 'info'>('info');
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}

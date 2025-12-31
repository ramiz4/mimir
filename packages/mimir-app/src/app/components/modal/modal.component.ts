import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, X, Info } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  title = input.required<string>();
  message = input.required<string>();
  type = input<'success' | 'error' | 'info'>('info');
  close = output<void>();

  readonly Check = Check;
  readonly X = X;
  readonly Info = Info;

  onClose() {
    this.close.emit();
  }
}

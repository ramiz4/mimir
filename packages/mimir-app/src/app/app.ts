import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TvService } from './services/tv.service';
import { DeviceInfo } from '@mimir/shared';
import { ModalComponent } from './components/modal/modal.component';
import { LucideAngularModule, Eye, RefreshCw, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ModalComponent, LucideAngularModule],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // We need to expose icons to the template if we want to use [img] binding,
  // OR we use the name attribute if we provided them.
  // But LucideAngularModule.pick({ ... }) returns a ModuleWithProviders.
  // Let's use the provider approach which is arguably safer if pick isn't working as I expect in this specific version.
  // Actually, let's stick to the most robust way:
  // Import the icons in the class and bind them: <lucide-icon [img]="Eye" />
  readonly Eye = Eye;
  readonly RefreshCw = RefreshCw;
  readonly Loader2 = Loader2;
  private tvService = inject(TvService);

  protected readonly title = signal('Mimir Control');
  protected readonly devices = signal<DeviceInfo[]>([]);
  protected readonly loading = signal(false);
  protected readonly scanning = signal(false);
  protected readonly pinRequired = signal<string | null>(null);

  protected readonly modalState = signal<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  ngOnInit(): void {
    this.refreshDevices();
  }

  refreshDevices(): void {
    this.loading.set(true);
    this.tvService.getDevices().subscribe({
      next: (devices) => {
        this.devices.set(devices);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startDiscovery(): void {
    this.scanning.set(true);
    this.tvService.discover().subscribe(() => {
      // Small delay to let discovery work before auto-refresh
      setTimeout(() => {
        this.refreshDevices();
        this.scanning.set(false);
      }, 6000);
    });
  }

  sendCommand(ip: string, command: string): void {
    this.tvService.sendCommand(ip, command).subscribe({
      next: (res) => console.log('Command sent:', res),
      error: (err) => console.error('Command failed:', err),
    });
  }

  initConnection(ip: string): void {
    this.tvService.register(ip).subscribe({
      next: (res) => {
        if (res.pinRequired) {
          this.pinRequired.set(ip);
        } else {
          this.showModal('Success', 'Connected successfully! No PIN required.', 'success');
        }
      },
      error: (err) => this.showModal('Connection Failed', err.message, 'error'),
    });
  }

  submitPin(pin: string): void {
    const ip = this.pinRequired();
    if (!ip || !pin) return;

    this.tvService.confirmPin(ip, pin).subscribe({
      next: () => {
        this.pinRequired.set(null);
        this.showModal('Success', 'Connected successfully!', 'success');
      },
      error: (err) => this.showModal('Error', 'PIN verification failed: ' + err.message, 'error'),
    });
  }

  cancelPin(): void {
    this.pinRequired.set(null);
  }

  private showModal(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.modalState.set({ title, message, type });
  }

  closeModal() {
    this.modalState.set(null);
  }
}

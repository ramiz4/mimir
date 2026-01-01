import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TvService } from './services/tv.service';
import { DeviceInfo } from '@mimir/shared';
import { ModalComponent } from './components/modal/modal.component';
import {
  LucideAngularModule,
  Eye,
  RefreshCw,
  Loader2,
  Power,
  Menu,
  Home,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ArrowLeft,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Grid,
} from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ModalComponent, LucideAngularModule],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Icons
  readonly Eye = Eye;
  readonly RefreshCw = RefreshCw;
  readonly Loader2 = Loader2;
  readonly Power = Power;
  readonly Menu = Menu;
  readonly Home = Home;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Volume2 = Volume2;
  readonly VolumeX = VolumeX;
  readonly ArrowLeft = ArrowLeft;
  readonly Settings = Settings;
  readonly Play = Play;
  readonly Pause = Pause;
  readonly SkipBack = SkipBack;
  readonly SkipForward = SkipForward;
  readonly Grid = Grid;

  private tvService = inject(TvService);

  protected readonly title = signal('Mimir Control');
  protected readonly devices = signal<DeviceInfo[]>([]);
  protected readonly loading = signal(false);
  protected readonly scanning = signal(false);
  protected readonly pinRequired = signal<string | null>(null);

  // New state for active remote view
  protected readonly activeDevice = signal<DeviceInfo | null>(null);

  protected readonly modalState = signal<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  ngOnInit(): void {
    this.refreshDevices();
  }

  refreshDevices(): void {
    // Only show loading if we don't have devices yet
    if (this.devices().length === 0) {
      this.loading.set(true);
    }

    this.tvService.getDevices().subscribe({
      next: (devices) => {
        this.devices.set(devices);
        this.loading.set(false);

        // If we have an active device, update it with fresh data
        const active = this.activeDevice();
        if (active) {
          const found = devices.find((d) => d.ip === active.ip);
          if (found) this.activeDevice.set(found);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  startDiscovery(): void {
    this.scanning.set(true);
    this.tvService.discover().subscribe(() => {
      setTimeout(() => {
        this.refreshDevices();
        this.scanning.set(false);
      }, 6000);
    });
  }

  selectDevice(device: DeviceInfo): void {
    if (this.activeDevice()?.ip !== device.ip) {
      this.activeDevice.set(device);
      // Auto-register/connect when opening remote
      this.initConnection(device.ip, true);
    }
  }

  clearActiveDevice(): void {
    this.activeDevice.set(null);
  }

  sendCommand(command: string): void {
    const device = this.activeDevice();
    if (!device) return;

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    this.tvService.sendCommand(device.ip, command).subscribe({
      next: (res) => console.log('Command sent:', res),
      error: (err) => console.error('Command failed:', err),
    });
  }

  initConnection(ip: string, silent = false): void {
    this.tvService.register(ip).subscribe({
      next: (res) => {
        if (res.pinRequired) {
          this.pinRequired.set(ip);
        } else if (!silent) {
          this.showModal('Success', 'Connected successfully! No PIN required.', 'success');
        }
      },
      error: (err) => {
        if (!silent) this.showModal('Connection Failed', err.message, 'error');
      },
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

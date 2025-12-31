import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TvService } from './services/tv.service';
import { DeviceInfo } from '@mimir/shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private tvService = inject(TvService);

  protected readonly title = signal('Mimir Control');
  protected readonly devices = signal<DeviceInfo[]>([]);
  protected readonly loading = signal(false);
  protected readonly scanning = signal(false);

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
}

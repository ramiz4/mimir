import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceInfo, CommandResponse } from '@mimir/shared';

@Injectable({
  providedIn: 'root',
})
export class TvService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<DeviceInfo[]> {
    return this.http.get<DeviceInfo[]>(`${this.apiUrl}/devices`);
  }

  discover(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/discover`);
  }

  sendCommand(ip: string, command: string): Observable<CommandResponse> {
    return this.http.post<CommandResponse>(`${this.apiUrl}/command/${ip}/${command}`, {});
  }

  register(ip: string): Observable<{ message: string; pinRequired: boolean }> {
    return this.http.post<{ message: string; pinRequired: boolean }>(
      `${this.apiUrl}/device/${ip}/register`,
      {},
    );
  }

  confirmPin(ip: string, pin: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/device/${ip}/confirm-pin`, { pin });
  }
}

import { type Request, type Response } from 'express';
import { discoveryService } from '../services/discovery.service.js';
import type { CommandResponse } from '@mimir/shared';

export class TVController {
  public static getDevices(_req: Request, res: Response): void {
    res.json(discoveryService.getDevices().map((d) => d.toJSON()));
  }

  public static discover(_req: Request, res: Response): void {
    discoveryService.clear();
    discoveryService.start();
    res.json({ message: 'Network scan started' });
  }

  public static async sendCommand(req: Request, res: Response): Promise<Response | void> {
    const { ip, name } = req.params;

    if (!ip || !name) {
      return res.status(400).json({ error: 'IP and command name required' });
    }

    const tv = discoveryService.getDevice(ip);

    if (!tv) return res.status(404).json({ error: 'TV not found' });

    try {
      await tv.sendCommand(name);
      const response: CommandResponse = { success: true, brand: tv.brand, command: name };
      return res.json(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: message });
    }
  }
}

import { BaseTV } from './base-tv.js';
import logger from '../utils/logger.js';

export class SamsungTV extends BaseTV {
  constructor(ip: string, name: string, model: string, location: string) {
    super(ip, name, model, location);
    this.brand = 'Samsung';
  }

  getAvailableCommands(): string[] {
    return ['Power', 'VolumeUp', 'VolumeDown'];
  }

  async sendCommand(commandName: string): Promise<void> {
    logger.info(`Sending Samsung command: ${commandName}`, { brand: this.brand, ip: this.ip });
    logger.error('Samsung protocol not yet implemented', { brand: this.brand, ip: this.ip });
    throw new Error('Samsung protocol not yet implemented');
  }
}

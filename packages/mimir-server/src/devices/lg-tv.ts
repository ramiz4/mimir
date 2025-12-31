import { BaseTV } from './base-tv.js';
import logger from '../utils/logger.js';

export class LGTV extends BaseTV {
  constructor(ip: string, name: string, model: string, location: string) {
    super(ip, name, model, location);
    this.brand = 'LG';
  }

  getAvailableCommands(): string[] {
    return ['Power', 'VolumeUp', 'VolumeDown'];
  }

  async sendCommand(commandName: string): Promise<void> {
    logger.info(`Sending LG command: ${commandName}`, { brand: this.brand, ip: this.ip });
    logger.error('LG protocol not yet implemented', { brand: this.brand, ip: this.ip });
    throw new Error('LG WebOS protocol not yet implemented');
  }
}

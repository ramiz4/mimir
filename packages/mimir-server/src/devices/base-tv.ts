import type { DeviceInfo } from '@mimir/shared';

export abstract class BaseTV {
  public ip: string;
  public name: string;
  public model: string;
  public location: string;
  public brand: string = 'Generic';
  public lastFound: Date;

  constructor(ip: string, name: string, model: string, location: string) {
    this.ip = ip;
    this.name = name;
    this.model = model;
    this.location = location;
    this.lastFound = new Date();
  }

  abstract sendCommand(commandName: string): Promise<void>;

  abstract getAvailableCommands(): string[];

  toJSON(): DeviceInfo {
    return {
      ip: this.ip,
      name: this.name,
      model: this.model,
      brand: this.brand,
      lastFound: this.lastFound.toISOString(),
      commands: this.getAvailableCommands(),
    };
  }
}

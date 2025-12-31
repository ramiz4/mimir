import axios from 'axios';
import { BaseTV } from './base-tv.js';
import logger from '../utils/logger.js';

export class SonyTV extends BaseTV {
  private irccCodes: Record<string, string> = {
    Power: 'AAAAAQAAAAEAAAAVAw==',
    VolumeUp: 'AAAAAQAAAAEAAAASAw==',
    VolumeDown: 'AAAAAQAAAAEAAAATAw==',
    Mute: 'AAAAAQAAAAEAAAAUAw==',
    Confirm: 'AAAAAQAAAAEAAABlAw==',
    Home: 'AAAAAQAAAAEAAABgAw==',
    Return: 'AAAAAgAAAJcAAAAjAw==',
    Netflix: 'AAAAAgAAABoAAAB8Aw==',
  };

  constructor(ip: string, name: string, model: string, location: string) {
    super(ip, name, model, location);
    this.brand = 'Sony';
  }

  getAvailableCommands(): string[] {
    return Object.keys(this.irccCodes);
  }

  async sendCommand(commandName: string): Promise<void> {
    const code = this.irccCodes[commandName];
    if (!code) throw new Error(`Code for ${commandName} unknown.`);

    const url = `http://${this.ip}/sony/ircc`;
    const xml = `<?xml version="1.0" encoding="utf-8"?>
        <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <s:Body>
                <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
                    <IRCCCode>${code}</IRCCCode>
                </u:X_SendIRCC>
            </s:Body>
        </s:Envelope>`;

    try {
      logger.info(`Sending Sony command: ${commandName}`, { brand: this.brand, ip: this.ip });
      await axios.post(url, xml, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
        },
        timeout: 3000,
      });
      logger.info(`Command ${commandName} sent successfully`, { brand: this.brand, ip: this.ip });
    } catch (error) {
      logger.error(`Failed to send Sony command: ${commandName}`, {
        brand: this.brand,
        ip: this.ip,
        error,
      });
      throw error;
    }
  }
}

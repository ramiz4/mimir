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

  private authCookie: string | undefined;

  constructor(ip: string, name: string, model: string, location: string) {
    super(ip, name, model, location);
    this.brand = 'Sony';
  }

  getAvailableCommands(): string[] {
    return Object.keys(this.irccCodes);
  }

  async register(): Promise<boolean> {
    const url = `http://${this.ip}/sony/accessControl`;
    const payload = {
      id: 13,
      method: 'actRegister',
      version: '1.0',
      params: [
        {
          clientid: 'Mimir',
          nickname: 'Mimir',
          level: 'private',
        },
        [{ value: 'yes', function: 'WOL' }],
      ],
    };

    try {
      await axios.post(url, payload, { timeout: 3000 });
      logger.info('Sony TV register call success (already paired?)', { ip: this.ip });
      return false;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        logger.info('Sony TV requested PIN', { ip: this.ip });
        return true;
      }
      throw error;
    }
  }

  async confirmPin(pin: string): Promise<void> {
    const url = `http://${this.ip}/sony/accessControl`;
    const payload = {
      id: 13,
      method: 'actRegister',
      version: '1.0',
      params: [
        {
          clientid: 'Mimir',
          nickname: 'Mimir',
          level: 'private',
        },
        [{ value: 'yes', function: 'WOL' }],
      ],
    };

    const auth = 'Basic ' + Buffer.from(`:${pin}`).toString('base64');

    try {
      const response = await axios.post(url, payload, {
        headers: { Authorization: auth },
        timeout: 3000,
      });

      const cookies = response.headers['set-cookie'];
      if (cookies) {
        this.authCookie = cookies.map((c: string) => c.split(';')[0]).join('; ');
        logger.info('Sony TV paired successfully', { ip: this.ip });
      }
    } catch (error) {
      logger.error('Sony TV PIN confirmation failed', { error });
      throw error;
    }
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
      const psk = process.env['SONY_PSK'] || '0000'; // Default to 0000 which is common

      const headers: Record<string, string> = {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      };

      if (this.authCookie) {
        headers['Cookie'] = this.authCookie;
      } else {
        headers['X-Auth-PSK'] = psk;
      }

      await axios.post(url, xml, {
        headers,
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

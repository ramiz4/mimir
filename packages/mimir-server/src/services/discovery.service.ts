import type { RemoteInfo } from 'dgram';
import pkg from 'node-ssdp';
import { BaseTV } from '../devices/base-tv.js';
import { TVFactory, type SsdpHeaders } from '../devices/tv-factory.js';
import logger from '../utils/logger.js';

const { Client } = pkg;

export class DiscoveryService {
  private foundDevices: Map<string, BaseTV> = new Map();

  public async start(): Promise<void> {
    logger.info('🔍 Scanning network for TVs (Sony, Samsung, LG)...');
    const client = new Client();

    client.on('response', async (headers: unknown, _statusCode: number, rinfo: RemoteInfo) => {
      if (this.foundDevices.has(rinfo.address)) return;

      try {
        const tv = await TVFactory.createFromDiscovery(headers as SsdpHeaders, rinfo);
        if (tv) {
          this.foundDevices.set(tv.ip, tv);
          logger.info(`✅ ${tv.brand} TV found: ${tv.name} (${tv.model || tv.brand}) @ ${tv.ip}`, {
            brand: tv.brand,
            ip: tv.ip,
          });
        }
      } catch (error) {
        logger.error('Error creating TV from discovery', { error, rinfo });
      }
    });

    client.search('ssdp:all');
    setTimeout(() => {
      logger.info(`📡 Scan complete. ${this.foundDevices.size} devices ready.`);
    }, 5000);
  }

  public getDevices(): BaseTV[] {
    return Array.from(this.foundDevices.values());
  }

  public getDevice(ip: string): BaseTV | undefined {
    return this.foundDevices.get(ip);
  }

  public clear(): void {
    this.foundDevices.clear();
  }
}

export const discoveryService = new DiscoveryService();

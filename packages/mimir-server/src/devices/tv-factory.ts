import type { RemoteInfo } from 'dgram';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { BaseTV } from './base-tv.js';
import { SonyTV } from './sony-tv.js';
import { SamsungTV } from './samsung-tv.js';
import { LGTV } from './lg-tv.js';

export interface SsdpHeaders {
  LOCATION?: string;
  SERVER?: string;
  ST?: string;
  [key: string]: string | number | boolean | symbol | undefined;
}

export class TVFactory {
  static async createFromDiscovery(
    headers: SsdpHeaders,
    rinfo: RemoteInfo
  ): Promise<BaseTV | null> {
    const location = headers.LOCATION;
    if (!location) return null;

    const server = String(headers.SERVER || '');
    const st = String(headers.ST || '');

    const details = { name: 'Unbekannter TV', model: 'Unbekannt' };
    try {
      const response = await axios.get(location, { timeout: 2000 });
      const result = await parseStringPromise(response.data);
      const dev = result.root.device[0];
      details.name = dev.friendlyName?.[0];
      details.model = dev.modelName?.[0];
    } catch {
      /* Ignore parsing errors */
    }

    const isSony = server.toLowerCase().includes('sony') || st.toLowerCase().includes('sony');
    const isSamsung =
      server.toLowerCase().includes('samsung') || st.toLowerCase().includes('samsung');
    const isLG = server.toLowerCase().includes('lg') || server.toLowerCase().includes('webos');

    if (isSony) return new SonyTV(rinfo.address, details.name, details.model, location);
    if (isSamsung) return new SamsungTV(rinfo.address, details.name, details.model, location);
    if (isLG) return new LGTV(rinfo.address, details.name, details.model, location);

    return null;
  }
}

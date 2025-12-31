export interface DeviceInfo {
  ip: string;
  name: string;
  model: string;
  brand: string;
  lastFound: string; // Changed to string for better JSON serialization across network
  commands: string[];
}

export type TVBrand = 'Sony' | 'Samsung' | 'LG' | 'Generic';

export interface CommandResponse {
  success: boolean;
  brand: string;
  command: string;
  error?: string;
}

import 'dotenv/config';
import app from './app.js';
import { discoveryService } from './services/discovery.service.js';
import logger from './utils/logger.js';

const PORT = process.env['PORT'] || 3000;

// Start Discovery
discoveryService.start().catch((err) => {
  logger.error('Error starting discovery service', { error: err });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Universal Remote API running on http://localhost:${PORT}`);
});

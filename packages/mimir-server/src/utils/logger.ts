import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for terminal output
const consoleFormat = printf(({ level, message, timestamp, stack, brand, ip }) => {
  const brandInfo = brand ? ` [${brand}]` : '';
  const ipInfo = ip ? ` (${ip})` : '';
  return `${timestamp} [${level}]${brandInfo}${ipInfo}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack traces if present
    json()
  ),
  defaultMeta: { service: 'mimir' },
  transports: [
    // Output all logs to console with colors and custom format
    new winston.transports.Console({
      format: combine(colorize({ all: true }), consoleFormat),
    }),
    // Optionally write logs to files in production
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
    }),
  ],
});

export default logger;

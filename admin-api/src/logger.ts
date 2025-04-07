//src/logger.ts
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Define the log format
const logFormat = format.combine(
  format.timestamp(),
  format.json(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
);

// Create the logger instance
const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new transports.Console(),

    // File transport for daily log files with compression for old logs
    new DailyRotateFile({
      filename: 'logs/%DATE%-logs.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Compress old log files
      maxSize: '20m', // Optional: Max size of each log file before rotation
      maxFiles: '7d', // Retain logs for 7 days before deletion
    }),
  ],
});

export default logger;

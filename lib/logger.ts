import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

// Helper functions for different log levels
export const log = {
  info: (message: string, obj?: any) => logger.info(obj || {}, message),
  error: (message: string, obj?: any) => logger.error(obj || {}, message),
  warn: (message: string, obj?: any) => logger.warn(obj || {}, message),
  debug: (message: string, obj?: any) => logger.debug(obj || {}, message),
  trace: (message: string, obj?: any) => logger.trace(obj || {}, message),
};
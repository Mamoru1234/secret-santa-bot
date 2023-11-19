import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.APP_LOG_LEVEL || 'info',
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

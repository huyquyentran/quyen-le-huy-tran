import dotenv from 'dotenv';
dotenv.config();

export const loggerConfig = {
  enableLogFile: process.env.ENABLE_LOG_FILE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
};

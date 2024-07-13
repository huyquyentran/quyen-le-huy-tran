import { loggerConfig } from '../config/logger.config';
import pino, { TransportTargetOptions } from 'pino';

const transportTargets: TransportTargetOptions[] = [{ target: 'pino-pretty' }];

if (loggerConfig.enableLogFile) {
  transportTargets.push({ target: 'pino/file', options: { destination: './logs/app.log', append: true, mkdir: true } });
}

const transport = pino.transport({
  targets: transportTargets,
  level: loggerConfig.logLevel,
});

export const logger = pino(transport);
